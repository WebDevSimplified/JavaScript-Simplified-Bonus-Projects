class TableDoesNotExistError extends Error {
  constructor(tableName) {
    super(tableName)

    this.name = "TableDoesNotExistError"
  }
}

module.exports = TableDoesNotExistError
