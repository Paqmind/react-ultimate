var path = require("path");

var projectDir = path.dirname(__dirname);
var staticDir = path.join(projectDir, "static");

module.exports = {
  "use-etag": true,
  "project-dir": projectDir,
  "static-dir": staticDir,
  "smtp-host": "localhost",
  "smtp-port": 25,
  "mail-robot": "robot@paqmind.com",
  "mail-support": "support@paqmind.com",
};
