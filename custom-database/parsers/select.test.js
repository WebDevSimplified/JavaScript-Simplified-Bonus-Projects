const parseSelectCommand = require("./select")

describe("With all columns", () => {
  const command = "SELECT * FROM table"

  test("It returns correct SelectCommand", () => {
    const selectCommand = parseSelectCommand(command)
    expect(selectCommand.allColumns).toBeTruthy()
    expect(selectCommand.table.tableName).toBe("table")
  })
})

describe("With specific columns", () => {
  const command = "SELECT a, b FROM table"

  test("It returns correct SelectCommand", () => {
    const selectCommand = parseSelectCommand(command)
    expect(selectCommand.columns).toIncludeSameMembers(["a", "b"])
    expect(selectCommand.allColumns).toBeFalsy()
    expect(selectCommand.table.tableName).toBe("table")
  })
})

describe("With no columns", () => {
  const command = "SELECT FROM table"

  test("It returns undefined", () => {
    expect(parseSelectCommand(command)).toBeUndefined()
  })
})

describe("With malformed columns", () => {
  const command = "SELECT , FROM table"

  test("It returns undefined", () => {
    expect(parseSelectCommand(command)).toBeUndefined()
  })
})

describe("With no SELECT clause", () => {
  const command = "* FROM table"

  test("It returns undefined", () => {
    expect(parseSelectCommand(command)).toBeUndefined()
  })
})

describe("With no FROM clause", () => {
  const command = "SELECT * table"

  test("It returns undefined", () => {
    expect(parseSelectCommand(command)).toBeUndefined()
  })
})

describe("With no table name", () => {
  const command = "SELECT * FROM"

  test("It returns undefined", () => {
    expect(parseSelectCommand(command)).toBeUndefined()
  })
})
