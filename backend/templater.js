import Path from "path";
import Nunjucks from "nunjucks";

const TEMPLATE_DIR = Path.join(__dirname, "/templates");

export default function (app) {
  app.set("views", TEMPLATE_DIR);
  app.set("view engine", "html");

  return Nunjucks.configure(TEMPLATE_DIR, {
    autoescape: true,
    express: app
  });
}
