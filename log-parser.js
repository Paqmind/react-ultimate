// IMPORTS
var fs = require("fs"),
    util = require("util"),
    stream = require("stream"),
    es = require("event-stream");

/*var logParser = new stream.Transform({objectMode: true});
logParser._transform = function(chunk, encoding, done) {
  var row = chunk.toString();
  if (this._headerEnded) {
    var rowData = {row: "row"}; // here should be parsed header fields
    this.push(JSON.stringify(rowData));
  } else {
    if (row) {
      var headerData = {row: "header"}; // here should be parsed header fields
      this.push(JSON.stringify(headerData));
    } else {
      this._headerEnded = true;
    }
  }
  done();
};

logParser._flush = function (done) {
  this._headerParsed = false;
  done();
};*/

// EXPORTS
/*var logOSX = new fs.ReadStream("log-osx.log");
logOSX
  .pipe(es.split("\n"))
  .pipe(es.mapSync(function(chunk) {
    var data = chunk.toString();
    if (/^\d+ /.test(data)) {
      console.log("ROW LINE");
    } else {
      console.log("HEADER LINE");
    }
//    return data + "\n";
  }))
  .pipe(process.stdout);*/





function parseHeaderRow(row) {
  var result;
  if (row.indexOf(":") >= 0) {
    result = row.split(":");
    result[0].trim();
    result[1] = result.splice(1, result.length).join(":");
  } else {
    result = [];
  }
  return result;
}

function parseProcessRow(row) {
  var result = {};
  var processRowMap = [
    "PID",
    "COMMAND",
    "%CPU",
    "TIME",
    "#TH",
    "#WQ",
    "#PORTS",
    "#MREGS",
    "MEM",
    "RPRVT",
    "PURG",
    "CMPRS",
    "VPRVT",
    "VSIZE",
    "PGRP",
    "PPID",
    "STATE",
    "UID",
    "FAULTS",
    "COW",
    "MSGSENT",
    "MSGRECV",
    "SYSBSD",
    "SYSMACH",
    "CSW",
    "PAGEINS",
    "KPRVT",
    "KSHRD",
    "IDLEW",
    "POWER",
    "USER",
  ];
  row.split(/\s+/).forEach(function(v, i) {
    var key = processRowMap[i];
    var val = v.trim();
    result[key] = val;
  });
  return result;
}

//Processes: 171 total, 2 running, 5 stuck, 164 sleeping, 948 threads
//2014/11/25 14:54:19
//Load Avg: 2.18, 2.14, 1.96
//CPU usage: 20.68% user, 34.48% sys, 44.82% idle
//SharedLibs: 12M resident, 15M data, 0B linkedit.
//MemRegions: 25696 total, 3379M resident, 95M private, 943M shared.
//PhysMem: 6717M used (997M wired), 1473M unused.
//VM: 432G vsize, 1068M framework vsize, 0(0) swapins, 0(0) swapouts.
//Networks: packets: 331283/166M in, 269951/36M out.
//Disks: 269696/13G read, 472914/7173M written.
