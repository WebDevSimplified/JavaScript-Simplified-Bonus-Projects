const DeleteCommand = require("../commands/DeleteCommand")

const DELETE_COMMAND = "DELETE"
const BEFORE_TABLE_COMMAND = "FROM"
const REGEX = new RegExp(
  `${DELETE_COMMAND}\\s+${BEFORE_TABLE_COMMAND}\\s+(?<tableName>\\S+)`
)

function parseDeleteCommand(commandString) {
  const regexMatch = commandString.match(REGEX)
  if (regexMatch == null) return

  // Remove part way through tutorial since this is not possible to actually hit
  const tableName = regexMatch.groups.tableName
  if (tableName === "") return

  return new DeleteCommand({ tableName })
}

module.exports = parseDeleteCommand
