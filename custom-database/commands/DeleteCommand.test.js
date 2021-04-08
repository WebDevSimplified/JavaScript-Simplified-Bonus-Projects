const DeleteCommand = require("./DeleteCommand")

describe("With a valid command", () => {
  const deleteCommand = new DeleteCommand({})
  const data = [
    { _id: 1, a: 3 },
    { _id: 2, a: 4 },
  ]

  test("It deletes all records", async () => {
    const readSpy = jest
      .spyOn(deleteCommand.table, "readData")
      .mockResolvedValue(data)
    const writeSpy = jest
      .spyOn(deleteCommand.table, "overwriteTable")
      .mockResolvedValue()

    expect(await deleteCommand.perform()).toIncludeSameMembers([1, 2])
    expect(writeSpy).toHaveBeenCalledWith([])
    expect(readSpy).toHaveBeenCalled()

    writeSpy.mockRestore()
    readSpy.mockRestore()
  })
})

describe("With a where command", () => {
  const deleteCommand = new DeleteCommand({})
  const whereCommand = { perform: data => [data[0]] }
  const data = [
    { _id: 1, a: 3 },
    { _id: 2, a: 4 },
  ]

  test("It deletes all matching records", async () => {
    const readSpy = jest
      .spyOn(deleteCommand.table, "readData")
      .mockResolvedValue(data)
    const writeSpy = jest
      .spyOn(deleteCommand.table, "overwriteTable")
      .mockResolvedValue()

    expect(await deleteCommand.perform(whereCommand)).toIncludeSameMembers([1])
    expect(writeSpy).toHaveBeenCalledWith([{ _id: 2, a: 4 }])
    expect(readSpy).toHaveBeenCalled()

    writeSpy.mockRestore()
    readSpy.mockRestore()
  })
})
