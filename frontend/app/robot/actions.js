// IMPORTS =========================================================================================
let Request = require("superagent");
let Reflux = require("reflux");

// EXPORTS =========================================================================================
let Actions = Reflux.createActions({
  //"toggleItem",     // called by button in TodoItem
  //"toggleAllItems", // called by button in TodoMain (even though you'd think TodoHeader)
  //"addItem",        // called by hitting enter in field in TodoHeader
  //"removeItem",     // called by button in TodoItem
  //"clearCompleted", // called by button in TodoFooter
  "load": {children: ["completed", "failed"]},
  "add": {},
  "addRandom": {},
  "edit": {},
});

// when 'load' is triggered, call async operation and trigger related actions
Actions.load.listen(function() {
  // By default, the listener is bound to the action
  // so we can access child actions using 'this'
  Request
    .get("/api/robots/")
    .end((res) => {
      if (res.ok) {
        console.log("Robot load completed!", res.body);
        this.completed(res.body);
      } else {
        console.log("Robot load failed!");
        this.failed();
      }
    });
});

module.exports = Actions;
