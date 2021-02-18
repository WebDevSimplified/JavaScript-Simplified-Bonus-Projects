const isMatch = require("lodash/isMatch")

module.exports = class WhereCommand {
  constructor(conditions) {
    this.conditions = conditions
  }

  perform(objects) {
    return objects.filter(object => {
      return isMatch(object, this.conditions)
    })
  }
}
