// IMPORTS =========================================================================================
import Winston from "winston";
import WinstonMail from "winston-mail";
import Moment from "moment";
import Config from "config";

// LOGGING =========================================================================================
let customColors = {
  trace: "white",
  debug: "blue",
  info: "green",
  warn: "yellow",
  fatal: "red"
};

let customLevels = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
};

Winston.addColors(customColors);

let logger = new (Winston.Logger)({
  colors: customColors,
  levels: customLevels,
  transports: [
    new (Winston.transports.Console)({
      level: process.env.NODE_ENV == "development" ? "info" : "warn",
      colorize: true,
      timestamp: function () {
        return Moment();
      },
      formatter: function (options) {
        let timestamp = options.timestamp().format("YYYY-MM-DD hh:mm:ss");
        let level = Winston.config.colorize(options.level, options.level.toUpperCase());
        let message = options.message;
        let meta;
        if (options.meta instanceof Error) {
          meta = "\n  " + options.meta.stack;
        } else {
          meta = Object.keys(options.meta).length ? Util.inspect(options.meta) : "";
        }
        return `${timestamp} ${level} ${message} ${meta}`;
      }
    }),
    //new (Winston.transports.File)({
    //  filename: "somefile.log"
    //})
  ],
});

if (process.env.NODE_ENV == "production") {
  // https://www.npmjs.com/package/winston-mail
  logger.add(Winston.transports.Mail, {
    level: "error",
    host: Config.get("smtp-host"),
    port: Config.get("smtp-port"),
    from: Config.get("mail-robot"),
    to: Config.get("mail-support"),
    subject: "Application Failed",
  });
}

export default logger;