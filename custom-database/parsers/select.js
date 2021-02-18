const SelectCommand = require("../commands/SelectCommand")

const SELECT_COMMAND = "SELECT"
const BEFORE_TABLE_COMMAND = "FROM"
const EVERYTHING_SELECTOR = "*"
const REGEX = new RegExp(
  `${SELECT_COMMAND}\\s+(?<columns>.*)\\s+${BEFORE_TABLE_COMMAND}\\s+(?<tableName>\\S+)`
)

function parseSelectCommand(commandString) {
  const regexMatch = commandString.match(REGEX)
  if (regexMatch == null) return

  const columns = regexMatch.groups.columns
    .replace(/\s/, "")
    .split(",")
    .filter(column => column !== "")
  if (columns.length === 0) return

  // Remove part way through tutorial since this is not possible to actually hit
  const tableName = regexMatch.groups.tableName
  if (tableName === "") return

  return new SelectCommand({
    tableName,
    columns,
    allColumns: columns.includes(EVERYTHING_SELECTOR),
  })
}

module.exports = parseSelectCommand
