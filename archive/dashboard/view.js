var View = require("ampersand-view"),
    _ = require("lodash"),
    io = require("socket.io-client"),
    ss = require("socket.io-stream"),
    es = require("event-stream");

var utils = require("../utils"),
    templater = require("../templater"),
    SummaryView = require("../summary/view"),
    ProcessIndexView = require("../process/views/index");

es.filter = es.through.bind(null, function write(data) {
  if (!_.isEmpty(data)) {
    this.emit("data", data);
  }
});

es.updateState = function(summaryLineCallback, processLineCallback) {
  return es.through(function write(data) {
    var self = this;
    this.pause();
    setTimeout(function() {
      if (data.type === "summary") {
          summaryLineCallback(data);
      } else if (data.type === "process") {
        processLineCallback(data);
      }
      self.resume();
    }, 1000);
  });
};

module.exports = View.extend({
  template: templater.lazyRender("dashboard/template.html"),

  initialize: function() {
    var self = this;
    this.listenToAndRun(this.model, "change", this.render);
    this.listenToAndRun(this.model, "change", this.changeTracker);

    var socket = io();
    socket.on("connect", function() {
      console.log("[]-> connect");
      var stream = ss.createStream();
      ss(socket).emit("enter", stream, {username: "ginger"});
      stream
        .pipe(es.split())
        .pipe(es.mapSync(utils.parseRow))
        .pipe(es.filter())
        .pipe(es.updateState(self.handleSummaryRow.bind(self), self.handleProcessRow.bind(self)));
    });
  },

  remove: function() {
    // TODO unbind streaming
  },

  handleSummaryRow: function(row) {
    console.log("*** summary row ***:", row);
    this.model.summary[row.key] = row.data;
//    console.log(this.model.summary);
  },

  handleProcessRow: function(row) {
    console.log("*** process row ***:", row);
    this.model.processes.add(row);
//    console.log(this.model.processes);
  },

  changeTracker: function() {
//    console.log("Model changed!");
  },

  /*syncTracker: function() {
    console.log("Model synced!");
  },

  resetTracker: function() {
    console.log("Model reseted!");
  },*/

  render: function() {
    this.renderWithTemplate(this);
//    this.renderSubview(new SummaryView({model: this.model.summary}), "#summary");
    this.renderSubview(new ProcessIndexView({collection: this.model.processes}), "#processes");
    return this;
  },
});
