export function maxId(models) {
  return Math.max.apply(Math, models.map(model => model.id));
}
