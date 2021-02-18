const Table = require("../Table")

module.exports = class InsertCommand {
  constructor({ tableName, record }) {
    this.table = new Table(tableName)
    this.record = record
  }

  async perform() {
    return await this.table.insertRecord(this.record)
  }
}
