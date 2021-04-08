const { v4: uuidV4 } = require("uuid")
const fs = require("fs")
const TableDoesNotExistError = require("./errors/TableDoesNotExistError")
const { reject } = require("rsvp")

module.exports = class Table {
  constructor(tableName) {
    this.tableName = tableName
  }

  get filePath() {
    return `data/${this.tableName}.json`
  }

  overwriteTable(data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.filePath, JSON.stringify(data), error => {
        if (error) return reject(error)
        resolve()
      })
    })
  }

  insertRecord(record) {
    const recordWithId = { _id: uuidV4(), ...record }
    return new Promise((resolve, reject) => {
      this.readData()
        .catch(e => {
          if (e instanceof TableDoesNotExistError) {
            return []
          } else {
            reject(e)
          }
        })
        .then(data => {
          fs.writeFile(
            this.filePath,
            JSON.stringify([...data, recordWithId]),
            error => {
              if (error) return reject(error)
              resolve(recordWithId)
            }
          )
        })
    })
  }

  readData() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filePath, (error, data) => {
        if (error) return reject(new TableDoesNotExistError(this.tableName))

        resolve(JSON.parse(data))
      })
    })
  }
}
