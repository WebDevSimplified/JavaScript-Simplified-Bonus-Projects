const InvalidCommandError = require("./errors/InvalidCommandError")
const parseSelectCommand = require("./parsers/select")
const parseInsertCommand = require("./parsers/insert")
const parseDeleteCommand = require("./parsers/delete")
const parseUpdateCommand = require("./parsers/update")
const parseWhereCommand = require("./parsers/where")

const parsers = [
  parseSelectCommand,
  parseInsertCommand,
  parseDeleteCommand,
  parseUpdateCommand,
]

module.exports = async function parseCommand(commandString) {
  const command = parsers
    .map(parser => parser(commandString))
    .find(command => command != null)

  if (command == null) throw new InvalidCommandError(commandString)

  const whereCommand = parseWhereCommand(commandString)
  return await command.perform(whereCommand)
}
