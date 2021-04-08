module.exports = class InvalidCommandError extends Error {
  constructor(tableName) {
    super(tableName)

    this.name = "InvalidCommandError"
  }
}
