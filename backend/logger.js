import {keys} from "ramda";
import {inspect} from "util";
import Winston from "winston";
import WinstonMail from "winston-mail";
import Moment from "moment";

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
          meta = keys(options.meta).length ? inspect(options.meta) : "";
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
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    from: process.env.MAIL_ROBOT,
    to: process.env.MAIL_SUPPORT,
    subject: "Application Failed",
  });
}

export default logger;
