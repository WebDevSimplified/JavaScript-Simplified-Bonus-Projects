import {
  joinRoom,
  readyUp,
  onStartGuesser,
  onGuess,
  makeGuess,
  onStartDrawer,
  draw,
  onDraw,
  onWinner
} from "./socket"
import {
  setup as setupCanvas,
  drawLine,
  toCanvasSpace,
  normalizeCoords,
  clearCanvas
} from "./draw"

const urlParams = new URLSearchParams(window.location.search)
const name = urlParams.get("name")
const roomId = urlParams.get("room-id")

if (!name || !roomId) window.location = "/index.html"

const guessForm = document.querySelector("[data-guess-form]")
const guessInput = document.querySelector("[data-guess-input]")
const wordElement = document.querySelector("[data-word]")
const messagesElement = document.querySelector("[data-messages]")
const readyButton = document.querySelector("[data-ready-btn]")
const guessTemplate = document.querySelector("[data-guess-template]")
const canvas = document.querySelector("[data-canvas]")

joinRoom(roomId, name)
onStartGuesser(startRoundGuesser)
onStartDrawer(startRoundDrawer)
onGuess(displayGuess)
onDraw((prevPosition, currentPosition) => {
  console.log(prevPosition, currentPosition)
  drawLine(
    canvas,
    toCanvasSpace(canvas, prevPosition),
    toCanvasSpace(canvas, currentPosition)
  )
})
onWinner(endRound)
endRound()
resizeCanvas()

readyButton.addEventListener("click", () => {
  hide(readyButton)
  readyUp()
})

guessForm.addEventListener("submit", e => {
  e.preventDefault()

  if (guessInput.value === "") return

  makeGuess(guessInput.value)
  displayGuess(name, guessInput.value)

  guessInput.value = ""
})

window.addEventListener("resize", resizeCanvas)

function resizeCanvas() {
  canvas.width = null
  canvas.height = null
  const clientDimensions = canvas.getBoundingClientRect()
  canvas.width = clientDimensions.width
  canvas.height = clientDimensions.height
}

let teardownCanvas
function startRoundDrawer(word) {
  hide(readyButton)
  show(messagesElement)
  clearCanvas(canvas)
  teardownCanvas = setupCanvas(canvas, (prevPosition, currentPosition) => {
    draw(
      normalizeCoords(canvas, prevPosition),
      normalizeCoords(canvas, currentPosition)
    )
  })

  wordElement.innerText = word
  messagesElement.innerHTML = ""
}

function startRoundGuesser() {
  hide(readyButton)
  show(guessForm)
  show(guessInput)
  show(messagesElement)
  hide(wordElement)
  clearCanvas(canvas)
  if (teardownCanvas) teardownCanvas()

  wordElement.innerText = ""
  messagesElement.innerHTML = ""
}

function endRound(name, word) {
  if (word) {
    wordElement.innerText = word
    show(wordElement)
    displayGuess(null, `${name} is the winner`)
  }
  show(readyButton)
  hide(guessForm)
  hide(guessInput)
}

function displayGuess(guesserName, guess) {
  const guessElement = guessTemplate.content.cloneNode(true)
  const messageElement = guessElement.querySelector("[data-text]")
  const nameElement = guessElement.querySelector("[data-name]")
  nameElement.innerText = guesserName
  messageElement.innerText = guess
  messagesElement.append(guessElement)
}

function show(element) {
  element.classList.remove("hide")
}

function hide(element) {
  element.classList.add("hide")
}
