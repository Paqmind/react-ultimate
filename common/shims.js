let {map} = require("ramda")

// How it's ever missed?!
RegExp.escape = function(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}

if (typeof process == "object") {
  process.on("unhandledRejection", (reason, promise) => {
    throw reason
  })
}
