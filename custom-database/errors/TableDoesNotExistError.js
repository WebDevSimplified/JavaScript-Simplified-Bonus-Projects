module.exports = class TableDoesNotExistError extends Error {
  constructor(tableName) {
    super(tableName)

    this.name = "TableDoesNotExistError"
  }
}
