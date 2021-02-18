const safeParseJSON = require("./safeParseJSON")

describe("With valid JSON string", () => {
  const jsonString = `{ "a": 1, "b": 2 }`

  test("It returns the JSON object", () => {
    expect(safeParseJSON(jsonString)).toEqual({ a: 1, b: 2 })
  })
})

describe("With invalid JSON string", () => {
  const jsonString = `{ asdfasdfasdf }`

  test("It returns undefined", () => {
    expect(safeParseJSON(jsonString)).toBeUndefined()
  })
})
