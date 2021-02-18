const parseDeleteCommand = require("./delete")

describe("With valid command", () => {
  const command = `DELETE FROM table`

  test("It returns correct DeleteCommand", () => {
    const deleteCommand = parseDeleteCommand(command)
    expect(deleteCommand.table.tableName).toBe("table")
  })
})

describe("With no table name", () => {
  const command = `DELETE FROM`

  test("It returns undefined", () => {
    expect(parseDeleteCommand(command)).toBeUndefined()
  })
})

describe("With no DELETE clause", () => {
  const command = `FROM table`

  test("It returns undefined", () => {
    expect(parseDeleteCommand(command)).toBeUndefined()
  })
})

describe("With no FROM clause", () => {
  const command = `DELETE table`

  test("It returns undefined", () => {
    expect(parseDeleteCommand(command)).toBeUndefined()
  })
})

describe("With no table name", () => {
  const command = `DELETE FROM`

  test("It returns undefined", () => {
    expect(parseDeleteCommand(command)).toBeUndefined()
  })
})
