"use strict";

let Path = require("path");

exports.PROJECT_DIR = Path.dirname(__dirname);

exports.NODE_MODULES_DIR = Path.join(exports.PROJECT_DIR, "node_modules");

exports.SHARED_DIR = Path.join(exports.PROJECT_DIR, "shared");

exports.FRONTEND_DIR = Path.join(exports.PROJECT_DIR, "frontend");

exports.BACKEND_DIR = Path.join(exports.PROJECT_DIR, "backend");

exports.MESSAGES_DIR = Path.join(exports.PROJECT_DIR, "messages");

exports.PUBLIC_DIR = Path.join(exports.PROJECT_DIR, "public");

exports.UPLOADS_DIR = Path.join(exports.PUBLIC_DIR, "uploads");

// export const AJAX = {
//   throttleTimeoutMs: 500,
// };
//
// export const ALERT = {
//   throttleTimeoutMs: 100,
//   expire: 5000,
// };
//
// export const ROBOT = {
//   index: {
//     defaultFilters: undefined,
//     defaultSorts: ["+name"],
//     defaultLimit: 12,
//   }
// };
//
// export const MONSTER = {
//   index: {
//     defaultFilters: undefined,
//     defaultSorts: ["+name"],
//     defaultLimit: 12,
//   }
// };