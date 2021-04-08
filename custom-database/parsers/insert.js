const InsertCommand = require("../commands/InsertCommand")
const safeParseJSON = require("../utils/safeParseJSON")

const INSERT_COMMAND = "INSERT"
const BEFORE_TABLE_COMMAND = "INTO"
const REGEX = new RegExp(
  `${INSERT_COMMAND}\\s+(?<record>{.*})\\s+${BEFORE_TABLE_COMMAND}\\s+(?<tableName>\\S+)`
)

function parseInsertCommand(commandString) {
  const regexMatch = commandString.match(REGEX)
  if (regexMatch == null) return

  const record = safeParseJSON(regexMatch.groups.record)
  if (record == null) return

  const tableName = regexMatch.groups.tableName

  return new InsertCommand({
    tableName,
    record,
  })
}

module.exports = parseInsertCommand
