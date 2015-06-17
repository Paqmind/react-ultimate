import Http from "http";
import Config from "config";
import logger from "backend/logger";
import app from "backend/app";

// SERVER ==========================================================================================
let server = Http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(Config.get("http-port"));

// HELPERS =========================================================================================
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  switch (error.code) {
    case "EACCES":
      logger.error(Config.get("http-port") + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(Config.get("http-port") + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  logger.info("Listening on port " + Config.get("http-port"));
}
