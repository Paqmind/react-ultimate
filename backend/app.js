/**
 * Note: imports are statically hoisted at compile time
 * and splitted on sections only to improve readability
 * in this complex file.
 */
import "shared/shims";
import Fs from "fs";
import Path from "path";
import Express from "express";

// GLOBALIZE =======================================================================================
import Globalize from "globalize";
import CldrGregorian from "cldr-data/main/en/ca-gregorian";
import CldrCurrencies from "cldr-data/main/en/currencies";
import CldrDateFields from "cldr-data/main/en/dateFields";
import CldrNumbers from "cldr-data/main/en/numbers";
import CldrCurrencyData from "cldr-data/supplemental/currencyData";
import CldrLikelySubtags from "cldr-data/supplemental/likelySubtags";
import CldrPlurals from "cldr-data/supplemental/plurals";
import CldrTimeData from "cldr-data/supplemental/timeData";
import CldrWeekData from "cldr-data/supplemental/weekData";

Globalize.load(
	CldrGregorian, CldrCurrencies,
  CldrDateFields, CldrNumbers,
  CldrLikelySubtags, CldrCurrencyData,
  CldrPlurals, CldrTimeData, CldrWeekData
);

Globalize.locale("en");

// APP =============================================================================================
import {PUBLIC_DIR} from "shared/constants";

let app = Express();

app.set("etag", Boolean(process.env.HTTP_USE_ETAG));

// LOGGER ==========================================================================================
import logger from "backend/logger";

// TEMPLATES =======================================================================================
import templater from "backend/templater";
templater(app);

// MIDDLEWARES =====================================================================================
import Compression from "compression";
import Morgan from "morgan";
import CookieParser from "cookie-parser";
import BodyParser from "body-parser";

app.use(Compression());
app.use(CookieParser());
app.use(BodyParser.json());                        // parse application/json
app.use(BodyParser.urlencoded({extended: false})); // parse application/x-www-form-urlencoded

if (process.env.NODE_ENV != "testing") {
  app.use(Morgan("dev", {
    skip: function (req, res) {
      return req.originalUrl.includes("/public");
    }
  }));
}

import appRouter from "backend/pages/app";
import alertRouters from "backend/actions/alert";
import robotRouters from "backend/actions/robot";
import monsterRouters from "backend/actions/monster";

let publicRouter = Express.static("public", {etag: false});

app.use("/", appRouter);
app.use("/public", publicRouter);
forEach(router => app.use("/api/alerts/", router), alertRouters);
forEach(router => app.use("/api/robots/", router), robotRouters);
forEach(router => app.use("/api/monsters/", router), monsterRouters);

app.use((req, res, cb) => {
  res.status(404).sendFile(Path.join(PUBLIC_DIR, "errors/404.html"));
});

app.use((err, req, res, cb) => {
  logger.error(err.stack);
  res.status(err.status || 500).sendFile(Path.join(PUBLIC_DIR, "errors/500.html"));
});

export default app;
