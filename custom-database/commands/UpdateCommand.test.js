const UpdateCommand = require("./UpdateCommand")

describe("With properties", () => {
  const updateCommand = new UpdateCommand({ properties: { c: 3 } })
  const data = [
    { a: 1, b: 2 },
    { a: 3, b: 4 },
  ]

  test("It updates all records", async () => {
    const readSpy = jest
      .spyOn(updateCommand.table, "readData")
      .mockResolvedValue(data)
    const writeSpy = jest
      .spyOn(updateCommand.table, "overwriteTable")
      .mockResolvedValue()

    const expectedData = [
      { a: 1, b: 2, c: 3 },
      { a: 3, b: 4, c: 3 },
    ]

    expect(await updateCommand.perform()).toIncludeSameMembers(expectedData)
    expect(writeSpy).toHaveBeenCalledWith(expectedData)
    expect(readSpy).toHaveBeenCalled()

    writeSpy.mockRestore()
    readSpy.mockRestore()
  })
})

describe("With a where command", () => {
  const updateCommand = new UpdateCommand({ properties: { c: 3 } })
  const whereCommand = { perform: data => [data[0]] }
  const data = [
    { a: 1, b: 2 },
    { a: 3, b: 4 },
  ]

  test("It updates all matching records", async () => {
    const readSpy = jest
      .spyOn(updateCommand.table, "readData")
      .mockResolvedValue(data)
    const writeSpy = jest
      .spyOn(updateCommand.table, "overwriteTable")
      .mockResolvedValue()

    const expectedData = [
      { a: 1, b: 2, c: 3 },
      { a: 3, b: 4 },
    ]

    expect(await updateCommand.perform(whereCommand)).toIncludeSameMembers([
      expectedData[0],
    ])
    expect(writeSpy).toHaveBeenCalledWith(expectedData)
    expect(readSpy).toHaveBeenCalled()

    writeSpy.mockRestore()
    readSpy.mockRestore()
  })
})
