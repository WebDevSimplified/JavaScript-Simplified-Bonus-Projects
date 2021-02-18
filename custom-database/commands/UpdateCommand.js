const Table = require("../Table")

module.exports = class UpdateCommand {
  constructor({ tableName, properties }) {
    this.table = new Table(tableName)
    this.properties = properties
  }

  async perform(whereCommand) {
    const originalData = await this.table.readData()
    let dataToUpdate = originalData
    if (whereCommand) dataToUpdate = whereCommand.perform(dataToUpdate)
    const updatedRecords = []
    const newData = originalData.map(record => {
      if (dataToUpdate.includes(record)) {
        const newRecord = { ...record, ...this.properties }
        updatedRecords.push(newRecord)
        return newRecord
      }

      return record
    })

    await this.table.overwriteTable(newData)
    return updatedRecords
  }
}
