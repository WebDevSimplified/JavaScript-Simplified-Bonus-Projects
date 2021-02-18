const WhereCommand = require("../commands/WhereCommand")
const safeParseJSON = require("../utils/safeParseJSON")

const WHERE_COMMAND = "WHERE"
const REGEX = new RegExp(`${WHERE_COMMAND}\\s+(?<conditions>{.*})`)

function parseWhereCommand(commandString) {
  const regexMatch = commandString.match(REGEX)
  if (regexMatch == null) return

  const conditions = safeParseJSON(regexMatch.groups.conditions)
  if (conditions == null) return

  return new WhereCommand(conditions)
}

module.exports = parseWhereCommand
