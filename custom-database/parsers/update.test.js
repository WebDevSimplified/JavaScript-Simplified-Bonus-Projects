const parseUpdateCommand = require("./update")

describe("With valid command", () => {
  const command = 'UPDATE { "a": 1, "b": 2 } IN table'

  test("It returns the correct UpdateCommand", () => {
    const updateCommand = parseUpdateCommand(command)
    expect(updateCommand.properties).toEqual({ a: 1, b: 2 })
    expect(updateCommand.table.tableName).toBe("table")
  })
})

describe("With invalid properties", () => {
  const command = "UPDATE { asdfasdf } IN table"

  test("It returns undefined", () => {
    expect(parseUpdateCommand(command)).toBeUndefined()
  })
})

describe("With no table name", () => {
  const command = 'UPDATE { "a": 1, "b": 2 } IN'

  test("It returns undefined", () => {
    expect(parseUpdateCommand(command)).toBeUndefined()
  })
})

describe("With no UPDATE clause", () => {
  const command = '{ "a": 1, "b": 2 } IN table'

  test("It returns undefined", () => {
    expect(parseUpdateCommand(command)).toBeUndefined()
  })
})

describe("With no IN clause", () => {
  const command = 'UPDATE { "a": 1, "b": 2 } table'

  test("It returns undefined", () => {
    expect(parseUpdateCommand(command)).toBeUndefined()
  })
})

describe("With no properties", () => {
  const command = "UPDATE IN table"

  test("It returns undefined", () => {
    expect(parseUpdateCommand(command)).toBeUndefined()
  })
})
