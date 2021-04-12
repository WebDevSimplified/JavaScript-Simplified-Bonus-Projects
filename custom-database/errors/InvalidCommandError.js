module.exports = class InvalidCommandError extends Error {
  constructor(commandString) {
    super(commandString)

    this.name = "InvalidCommandError"
  }
}
