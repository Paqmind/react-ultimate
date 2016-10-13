let Http = require("http")
let logger = require("backend/logger")
let app = require("backend/app")

let server = Http.createServer(app)
server.on("error", onError)
server.on("listening", onListening)
server.listen(process.env.HTTP_PORT)

function onError(error) {
  if (error.syscall !== "listen") {
    throw error
  }
  switch (error.code) {
    case "EACCES":
      logger.error(process.env.HTTP_PORT + " requires elevated privileges")
      process.exit(1)
      break
    case "EADDRINUSE":
      logger.error(process.env.HTTP_PORT + " is already in use")
      process.exit(1)
      break
    default:
      throw error
  }
}

function onListening() {
  logger.info("Listening on port " + process.env.HTTP_PORT)
}
