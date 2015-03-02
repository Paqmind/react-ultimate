let path = require("path");

let projectDir = path.dirname(__dirname);
let staticDir = path.join(projectDir, "static");

module.exports = {
  "use-etag": true,
  "project-dir": projectDir,
  "static-dir": staticDir,
  "smtp-host": "localhost",
  "smtp-port": 25,
  "mail-robot": "robot@localhost",
  "mail-support": "support@localhost",
};
