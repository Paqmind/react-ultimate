let Path = require("path")

let PROJECT_DIR = Path.dirname(__dirname)

exports.PROJECT_DIR = PROJECT_DIR

exports.NODE_MODULES_DIR = Path.join(PROJECT_DIR, "node_modules")

exports.COMMON_DIR = Path.join(PROJECT_DIR, "common")

exports.FRONTEND_DIR = Path.join(PROJECT_DIR, "frontend")

exports.BACKEND_DIR = Path.join(PROJECT_DIR, "backend")

exports.MESSAGES_DIR = Path.join(PROJECT_DIR, "messages")

exports.PUBLIC_DIR = Path.join(PROJECT_DIR, "public")

exports.UPLOADS_DIR = Path.join(exports.PUBLIC_DIR, "uploads")

exports.AJAX = {
  throttleTimeoutMs: 500,
}

exports.ALERT = {
  throttleTimeoutMs: 100,
  expire: 5000,
}

exports.ROBOT = {
  index: {
    defaultFilters: undefined,
    defaultSorts: ["+name"],
    defaultLimit: 12,
  }
}

exports.MONSTER = {
  index: {
    defaultFilters: undefined,
    defaultSorts: ["+name"],
    defaultLimit: 12,
  }
}
