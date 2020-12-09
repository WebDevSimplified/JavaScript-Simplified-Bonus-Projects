let prevPosition

export function setup(canvas, onDraw) {
  const mousemoveHandler = e => mousemove(e, canvas, onDraw)
  canvas.addEventListener("mousemove", mousemoveHandler)
  canvas.addEventListener("mouseleave", resetPrevPosition)

  return () => {
    canvas.removeEventListener("mousemove", mousemoveHandler)
    canvas.removeEventListener("mouseleave", resetPrevPosition)
  }
}

function resetPrevPosition() {
  prevPosition = null
}

function mousemove(e, canvas, onDraw) {
  if (e.buttons !== 1) {
    prevPosition = null
    return
  }

  const newPosition = { x: e.layerX, y: e.layerY }
  if (prevPosition != null) {
    drawLine(canvas, prevPosition, newPosition)
    onDraw(prevPosition, newPosition)
  }

  prevPosition = newPosition
}

export function drawLine(canvas, prevPosition, currentPosition) {
  const ctx = canvas.getContext("2d")
  ctx.beginPath()
  ctx.moveTo(prevPosition.x, prevPosition.y)
  ctx.lineTo(currentPosition.x, currentPosition.y)
  ctx.stroke()
}

export function clearCanvas(canvas) {
  const ctx = canvas.getContext("2d")
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

export function toCanvasSpace(canvas, coords) {
  return {
    x: coords.x * canvas.width,
    y: coords.y * canvas.height
  }
}

export function normalizeCoords(canvas, coords) {
  return {
    x: coords.x / canvas.width,
    y: coords.y / canvas.height
  }
}
