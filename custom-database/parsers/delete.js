const DeleteCommand = require("../commands/DeleteCommand")

const DELETE_COMMAND = "DELETE"
const BEFORE_TABLE_COMMAND = "FROM"
const REGEX = new RegExp(
  `${DELETE_COMMAND}\\s+${BEFORE_TABLE_COMMAND}\\s+(?<tableName>\\S+)`
)

function parseDeleteCommand(commandString) {
  const regexMatch = commandString.match(REGEX)
  if (regexMatch == null) return

  const tableName = regexMatch.groups.tableName

  return new DeleteCommand({
    tableName,
  })
}

module.exports = parseDeleteCommand
