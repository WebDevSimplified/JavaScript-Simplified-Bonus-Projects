const InsertCommand = require("./InsertCommand")

describe("With a record", () => {
  const insertCommand = new InsertCommand({ record: { a: 1, b: 2 } })

  test("It inserts the record", async () => {
    const spy = jest
      .spyOn(insertCommand.table, "insertRecord")
      .mockResolvedValue()

    await insertCommand.perform()
    expect(spy).toHaveBeenCalledWith(insertCommand.record)

    spy.mockRestore()
  })
})
