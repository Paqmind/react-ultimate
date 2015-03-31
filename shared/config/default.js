// IMPORTS =========================================================================================
let Path = require("path");

// EVALS ===========================================================================================
let projectDir = Path.dirname(__dirname);
let staticDir = Path.join(projectDir, "static");

// CONFIG ==========================================================================================
export default {
  // HTTP
  "http-port": 80,
  "http-use-etag": true,

  // DIRS
  "project-dir": projectDir,
  "static-dir": staticDir,

  // SMTP
  "smtp-host": "localhost",
  "smtp-port": 25,

  // MAIL
  "mail-robot": "robot@localhost",
  "mail-support": "support@localhost",

  // HOSTS (required in "development" envs)
  "production-ssh": "xxx@dgo",
  "production-host": "react-starter.xxx.com",
  "production-service": "react-starter.xxx.node.service",

  "staging-ssh": "yyy@dgo",
  "staging-host": "demo.react-starter.xxx.com",
  "staging-service": "demo.react-starter.xxx.node.service",
};
