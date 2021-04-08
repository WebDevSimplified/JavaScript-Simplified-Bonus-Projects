const Table = require("../Table")
const pick = require("lodash/pick")

module.exports = class SelectCommand {
  constructor({ tableName, columns, allColumns }) {
    this.table = new Table(tableName)
    this.columns = columns
    this.allColumns = allColumns
  }

  async perform(whereCommand) {
    let data = await this.table.readData()
    if (whereCommand) data = whereCommand.perform(data)
    if (this.allColumns) return data

    return data.map(object => {
      return pick(object, this.columns)
    })
  }
}
