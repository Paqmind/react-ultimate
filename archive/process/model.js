var State = require("ampersand-state");

module.exports = State.extend({
  idAttribute: "pid",

  session: {
    pid: {type: "string", required: true},
    command: {type: "string", required: true},
    user: {type: "string", required: true},
//    requestLimit: {type: "integer", default: 50},
//    currentPage: {type: "integer", default: 1},
//    perPage: {type: "integer", default: 10},
  },
});

/*var processRowMap = [
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
];*/
