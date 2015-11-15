import {keys, values} from "ramda";
import Tc from "tcomb";
import Express from "express";
import {filterByAll, sortByAll} from "shared/helpers/common";
import middlewares from "backend/middlewares";
import DB from "backend/dbs/alert";

let router = Express.Router();

router.get("/",
  middlewares.createParseQuery(Tc.Any),
  function handler(req, res, cb) {
    let filters = req.query.filters;
    let sorts = req.query.sorts;
    let offset = req.query.offset || 0;
    let limit = req.query.limit || 20;

    let items = values(DB);
    if (filters) {
      items = filterByAll(filters, items);
    }
    if (sorts) {
      items = sortByAll(sorts, items);
    }
    let total = items.length;
    items = items.slice(offset, offset + limit);

    let payload = {
      data: items,
      meta: {
        page: {offset, limit, total}
      }
    };
    return res.status(200).send(payload); // Status: ok
  }
);

export default router;
