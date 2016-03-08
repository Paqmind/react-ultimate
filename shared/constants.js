import Path from "path";

export const PROJECT_DIR = Path.dirname(__dirname);

export const NODE_MODULES_DIR = Path.join(PROJECT_DIR, "node_modules");

export const SHARED_DIR = Path.join(PROJECT_DIR, "shared");

export const FRONTEND_DIR = Path.join(PROJECT_DIR, "frontend");

export const BACKEND_DIR = Path.join(PROJECT_DIR, "backend");

export const MESSAGES_DIR = Path.join(PROJECT_DIR, "messages");

export const PUBLIC_DIR = Path.join(PROJECT_DIR, "public");

export const UPLOADS_DIR = Path.join(PUBLIC_DIR, "uploads");

export const AJAX = {
  throttleTimeoutMs: 500,
};

export const ALERT = {
  throttleTimeoutMs: 100,
  expire: 5000,
};

export const ROBOT = {
  index: {
    filters: undefined,
    sorts: ["+name"],
    offset: 0,
    limit: 12,
  }
};

export const MONSTER = {
  index: {
    filters: undefined,
    sorts: ["+name"],
    offset: 0,
    limit: 12,
  }
};