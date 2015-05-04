// IMPORTS =========================================================================================
import Nunjucks from "nunjucks";

// TEMPLATER =======================================================================================
export default function (app) {
  app.set("views", __dirname + "/templates");
  app.set("view engine", "html");

  return Nunjucks.configure("backend/templates", {
    autoescape: true,
    express: app
  });
}