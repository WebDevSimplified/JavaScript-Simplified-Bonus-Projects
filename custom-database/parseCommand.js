const InvalidCommandError = require("./errors/InvalidCommandError")
const parseDeleteCommand = require("./parsers/delete")
const parseInsertCommand = require("./parsers/insert")
const parseSelectCommand = require("./parsers/select")
const parseUpdateCommand = require("./parsers/update")
const parseWhereCommand = require("./parsers/where")

const parsers = [
  parseInsertCommand,
  parseSelectCommand,
  parseUpdateCommand,
  parseDeleteCommand,
]

module.exports = async function parseCommand(commandString) {
  const command = parsers
    .map(parser => parser(commandString))
    .find(command => command != null)

  if (command == null) throw new InvalidCommandError(commandString)

  const whereCommand = parseWhereCommand(commandString)
  return await command.perform(whereCommand)
}
