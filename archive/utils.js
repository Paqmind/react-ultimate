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

function cleanKey(key) {
  if (typeof key !== "string") {
    throw Error(`Invalid key ${key}`);
  }
  return key
    .replace(" ", "")
    .replace("#", "")
    .replace("%", "")
    .toLowerCase();
}

function fixChunks(chunks) {
  let result = chunks.slice();
  let delta = result.length - processRowMap.length;
  if (delta > 0) {
    let dropped = result.splice(2, delta);
    result[1] = result[1] + " " + dropped.join(" ");
  }
  return result;
}

function parseSummaryRow(row) {
  if (row.indexOf(":") >= 0) {
    let chunks = row.split(":");
    return {
      type: "summary",
      key: cleanKey(chunks.shift()),
      data: chunks.join(":"),
    };
  } else {
    return {};
  }
}

function parseProcessRow(row) {
  let result = {type: "process"};
  if (row.indexOf(" ") >= 0) {
    let chunks = row.trim().split(/\s+/);
    // Remove potential extra spaces from "command" argument
    chunks = fixChunks(chunks);
    chunks.forEach(function(v, i) {
      let key = processRowMap[i];
      let val = v.trim();
      result[cleanKey(key)] = val;
    });
  }
  return result;
}

exports.parseRow = function(row) {
  console.debug(row);
  if (!row) {
    return {};
  } else if (/^\d+/.test(row)) {
    return parseProcessRow(row);
  } else {
    return parseSummaryRow(row);
  }
};
