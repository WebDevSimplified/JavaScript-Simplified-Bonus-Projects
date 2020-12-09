import DrawableCanvas from "./DrawableCanvas.js"
import { io } from "socket.io-client"

const urlParams = new URLSearchParams(window.location.search)
const name = urlParams.get("name")
const roomId = urlParams.get("room-id")

if (!name || !roomId) window.location = "/index.html"

const socket = io(process.env.SERVER_URL)
const guessForm = document.querySelector("[data-guess-form]")
const guessInput = document.querySelector("[data-guess-input]")
const wordElement = document.querySelector("[data-word]")
const messagesElement = document.querySelector("[data-messages]")
const readyButton = document.querySelector("[data-ready-btn]")
const guessTemplate = document.querySelector("[data-guess-template]")
const canvas = document.querySelector("[data-canvas]")

const drawableCanvas = new DrawableCanvas(canvas, socket)

socket.emit("join-room", { name: name, roomId: roomId })
socket.on("start-guesser", startRoundGuesser)
socket.on("start-drawer", startRoundDrawer)
socket.on("guess", displayGuess)
socket.on("winner", endRound)
endRound()
resizeCanvas()
setupButtonEvents()

function setupButtonEvents() {
  readyButton.addEventListener("click", () => {
    hide(readyButton)
    socket.emit("ready")
  })

  guessForm.addEventListener("submit", e => {
    e.preventDefault()

    if (guessInput.value === "") return

    socket.emit("make-guess", { guess: guessInput.value })
    displayGuess(name, guessInput.value)

    guessInput.value = ""
  })

  window.addEventListener("resize", resizeCanvas)
}

function resizeCanvas() {
  canvas.width = null
  canvas.height = null
  const clientDimensions = canvas.getBoundingClientRect()
  canvas.width = clientDimensions.width
  canvas.height = clientDimensions.height
}

function startRoundDrawer(word) {
  drawableCanvas.canDraw = true
  show(messagesElement)
  drawableCanvas.clearCanvas(canvas)

  wordElement.innerText = word
  messagesElement.innerHTML = ""
}

function startRoundGuesser() {
  show(guessForm)
  show(guessInput)
  show(messagesElement)
  hide(wordElement)
  drawableCanvas.clearCanvas(canvas)

  wordElement.innerText = ""
  messagesElement.innerHTML = ""
}

function endRound(name, word) {
  if (word) {
    wordElement.innerText = word
    show(wordElement)
    displayGuess(null, `${name} is the winner`)
  }

  drawableCanvas.canDraw = false
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
