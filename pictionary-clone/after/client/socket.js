import { io } from "socket.io-client"

const socket = io(process.env.SERVER_URL)

export function joinRoom(roomId, name) {
  socket.emit("join-room", { name: name, roomId: roomId })
}

export function readyUp() {
  socket.emit("ready")
}

export function makeGuess(guess) {
  socket.emit("make-guess", { guess: guess })
}

export function draw(prevPosition, currentPosition) {
  socket.emit("draw", {
    prevPosition: prevPosition,
    currentPosition: currentPosition
  })
}

export function onStartGuesser(callback) {
  socket.on("start-guesser", callback)
}

export function onGuess(callback) {
  socket.on("guess", callback)
}

export function onStartDrawer(callback) {
  socket.on("start-drawer", callback)
}

export function onDraw(callback) {
  socket.on("draw-line", callback)
}

export function onWinner(callback) {
  socket.on("winner", callback)
}
