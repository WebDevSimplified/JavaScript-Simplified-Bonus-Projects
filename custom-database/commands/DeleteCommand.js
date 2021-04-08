const Table = require("../Table")

module.exports = class DeleteCommand {
  constructor({ tableName }) {
    this.table = new Table(tableName)
  }

  async perform(whereCommand) {
    const originalData = await this.table.readData()
    let dataToDelete = originalData
    if (whereCommand) dataToDelete = whereCommand.perform(dataToDelete)
    const dataToKeep = originalData.filter(record => {
      return !dataToDelete.includes(record)
    })

    await this.table.overwriteTable(dataToKeep)
    return dataToDelete.map(record => record._id)
  }
}
