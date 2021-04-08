const WhereCommand = require("./WhereCommand")

describe("With one condition", () => {
  const whereCommand = new WhereCommand({ a: 1 })
  const data = [
    { a: 1, b: 2 },
    { a: 3, b: 4 },
  ]

  test("It returns the data that matches", () => {
    expect(whereCommand.perform(data)).toIncludeSameMembers([{ a: 1, b: 2 }])
  })
})

describe("With two condition", () => {
  const whereCommand = new WhereCommand({ a: 1, b: 2 })
  const data = [
    { a: 1, b: 2 },
    { a: 1, b: 5 },
    { a: 3, b: 4 },
  ]

  test("It returns the data that matches", () => {
    expect(whereCommand.perform(data)).toIncludeSameMembers([{ a: 1, b: 2 }])
  })
})

describe("With no conditions", () => {
  const whereCommand = new WhereCommand()
  const data = [
    { a: 1, b: 2 },
    { a: 1, b: 5 },
    { a: 3, b: 4 },
  ]

  test("It returns the data as is", () => {
    expect(whereCommand.perform(data)).toIncludeSameMembers(data)
  })
})
