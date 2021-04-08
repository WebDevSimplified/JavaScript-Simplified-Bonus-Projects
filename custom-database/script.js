const readline = require("readline")
const parseCommand = require("./parseCommand")
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function start() {
  while (true) {
    try {
      const commandString = await waitForCommand()
      printFormattedJSON(await parseCommand(commandString))
    } catch (e) {
      console.error(`${e.name}: ${e.message}`)
    }
  }
}
start()

function waitForCommand() {
  return new Promise(resolve => {
    rl.question("> ", resolve)
  })
}

function printFormattedJSON(string) {
  console.log(JSON.stringify(string, null, 2))
}
