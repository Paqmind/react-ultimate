import Path from "path";
import Nunjucks from "nunjucks";

// CONSTANTS =======================================================================================
const TEMPLATE_DIR = Path.join(__dirname, "/templates");

// TEMPLATER =======================================================================================
export default function (app) {
  app.set("views", TEMPLATE_DIR);
  app.set("view engine", "html");

  return Nunjucks.configure(TEMPLATE_DIR, { // TODO why duplication ?!
    autoescape: true,
    express: app
  });
}
