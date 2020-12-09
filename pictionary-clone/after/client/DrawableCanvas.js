export default function DrawableCanvas(canvas, socket) {
  this.canDraw = false
  this.clearCanvas = function() {
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  let prevPosition = null

  canvas.addEventListener("mousemove", e => {
    if (e.buttons !== 1 || !this.canDraw) {
      prevPosition = null
      return
    }

    const newPosition = { x: e.layerX, y: e.layerY }
    if (prevPosition != null) {
      drawLine(prevPosition, newPosition)
      socket.emit("draw", {
        prevPosition: normalizeCoords(prevPosition),
        currentPosition: normalizeCoords(newPosition)
      })
    }

    prevPosition = newPosition
  })
  canvas.addEventListener("mouseleave", () => (prevPosition = null))

  socket.on("draw-line", (start, end) => {
    drawLine(toCanvasSpace(start), toCanvasSpace(end))
  })

  function drawLine(start, end) {
    const ctx = canvas.getContext("2d")
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
  }

  function toCanvasSpace(coords) {
    return {
      x: coords.x * canvas.width,
      y: coords.y * canvas.height
    }
  }

  function normalizeCoords(coords) {
    return {
      x: coords.x / canvas.width,
      y: coords.y / canvas.height
    }
  }
}
