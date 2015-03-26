// IMPORTS =========================================================================================
let Path = require("path");

// EVALS ===========================================================================================
let projectDir = Path.dirname(__dirname);
let staticDir = Path.join(projectDir, "static");

// CONFIG ==========================================================================================
export default {
  "use-etag": true,
  "project-dir": projectDir,
  "static-dir": staticDir,
  "smtp-host": "localhost",
  "smtp-port": 25,
  "mail-robot": "robot@localhost",
  "mail-support": "support@localhost",
};
