const fs = require("fs")

const proxy = new Proxy(fs, {
  get: function (obj, prop) {
    if (typeof obj[prop] !== "function") {
      return obj[prop]
    }
    return new Proxy(obj[prop], {
      apply: function (target, thisArg, argumentsList) {
        console.warn(
          `[WARN] ${prop} is used. (${argumentsList.join(
            ","
          )}) FS should not be used in SSR as it might not be there while building.`
        )
        const stackTrace = new Error("test").stack
          .split("\n")
          .filter(line => !line.includes("bluebird"))
          .join("\n")
        console.log(stackTrace)

        return target.apply(thisArg, argumentsList)
      },
      get: function (obj, prop) {
        return obj[prop]
      },
    })
  },
})

module.exports = proxy
