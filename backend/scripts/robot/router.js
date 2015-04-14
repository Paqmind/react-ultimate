// IMPORTS =========================================================================================
let Express = require("express");

// EXPORTS =========================================================================================
let router = Express.Router();

module.exports = router;

// CYCLIC IMPORTS (blame node taken index.js as folder root) =======================================
require("backend/robot/routes/create-post");
require("backend/robot/routes/create-put");
require("backend/robot/routes/delete");
require("backend/robot/routes/detail");
require("backend/robot/routes/index");
require("backend/robot/routes/random");