import Path from "path";

const PROJECT_DIR = Path.dirname(__dirname);
const NODE_MODULES_DIR = Path.join(PROJECT_DIR, "node_modules");
const SHARED_DIR = Path.join(PROJECT_DIR, "shared");
const FRONTEND_DIR = Path.join(PROJECT_DIR, "frontend");
const BACKEND_DIR = Path.join(PROJECT_DIR, "backend");
const MESSAGES_DIR = Path.join(PROJECT_DIR, "messages");
const PUBLIC_DIR = Path.join(PROJECT_DIR, "public");
const UPLOADS_DIR = Path.join(PUBLIC_DIR, "uploads");

const AJAX = {
  throttleTimeoutMs: 500,
};

const ALERT = {
  throttleTimeoutMs: 100,
  expire: 5000,
};

const ROBOT = {
  index: {
    filters: undefined,
    sorts: ["+name"],
    offset: 0,
    limit: 12,
  },
};

const MONSTER = {
  index: {
    filters: undefined,
    sorts: ["+name"],
    offset: 0,
    limit: 12,
  },
  indexUSACitizen: {
    filters: {
      citizenship: "USA",
    },
    sorts: ["+name"],
    offset: 0,
    limit: Infinity,
  }
};

export default {
  // DIRS
  PROJECT_DIR,
  NODE_MODULES_DIR,
  SHARED_DIR,
  FRONTEND_DIR,
  BACKEND_DIR,
  MESSAGES_DIR,
  PUBLIC_DIR,
  UPLOADS_DIR,

  // MODELS
  AJAX,
  ALERT,
  ROBOT,
  MONSTER,
};
