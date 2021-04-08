const UpdateCommand = require("../commands/UpdateCommand")
const safeParseJSON = require("../utils/safeParseJSON")

const UPDATE_COMMAND = "UPDATE"
const BEFORE_TABLE_COMMAND = "IN"
const REGEX = new RegExp(
  `${UPDATE_COMMAND}\\s+(?<properties>{.*})\\s+${BEFORE_TABLE_COMMAND}\\s+(?<tableName>\\S+)`
)

function parseUpdateCommand(commandString) {
  const regexMatch = commandString.match(REGEX)
  if (regexMatch == null) return

  const properties = safeParseJSON(regexMatch.groups.properties)
  if (properties == null) return

  const tableName = regexMatch.groups.tableName

  return new UpdateCommand({
    tableName,
    properties,
  })
}

module.exports = parseUpdateCommand
