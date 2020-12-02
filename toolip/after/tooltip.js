import addGlobalEventListener from "./utils/addGlobalEventListener"

const DEFAULT_SPACING = 5
const TOOLTIP_MAX_WIDTH = 200
const POSITION_TO_FUNCTION_MAP = {
  top: positionTooltipTop,
  bottom: positionTooltipBottom,
  left: positionTooltipLeft,
  right: positionTooltipRight
}
const POSITION_ORDER = ["top", "bottom", "right", "left"]
const tooltipContainer = document.createElement("div")
tooltipContainer.classList.add("tooltip-container")
tooltipContainer.append(document.createElement("div"))
document.body.append(tooltipContainer)

addGlobalEventListener("mouseover", "[data-tooltip]", e => {
  const tooltip = displayTooltip(e.target)

  e.target.addEventListener(
    "mouseleave",
    () => {
      tooltip.remove()
    },
    { once: true }
  )
})

function displayTooltip(element) {
  const tooltip = createTooltipElement(element.dataset.tooltip)
  tooltipContainer.append(tooltip)
  positionTooltip(tooltip, element)

  return tooltip
}

function createTooltipElement(text) {
  const tooltip = document.createElement("div")
  tooltip.classList.add("tooltip")
  tooltip.style.maxWidth = `${TOOLTIP_MAX_WIDTH}px`
  tooltip.innerText = text
  return tooltip
}

function positionTooltip(tooltip, element) {
  const preferredPositions = (element.dataset.positions || "").split("|")
  const rect = element.getBoundingClientRect()
  const positions = preferredPositions.concat(POSITION_ORDER)
  const spacing = parseInt(element.dataset.spacing) || DEFAULT_SPACING

  for (let i = 0; i < positions.length; i++) {
    const func = POSITION_TO_FUNCTION_MAP[positions[i]]
    if (func && func(tooltip, rect, spacing)) return
  }
}

function positionTooltipTop(tooltip, elementRect, spacing) {
  const tooltipRect = tooltip.getBoundingClientRect()
  const elementCenter = elementRect.left + elementRect.width / 2

  tooltip.style.top = `${elementRect.top - tooltipRect.height - spacing}px`
  tooltip.style.left = `${elementCenter - tooltipRect.width / 2}px`

  const bounds = outOfTooltipContainer(tooltip, spacing)
  if (bounds.top) {
    resetTooltipPosition(tooltip)
    return false
  }
  if (bounds.right) {
    tooltip.style.right = `${spacing}px`
    tooltip.style.left = "initial"
  }
  if (bounds.left) tooltip.style.left = `${spacing}px`
  return true
}

function positionTooltipBottom(tooltip, elementRect, spacing) {
  const tooltipRect = tooltip.getBoundingClientRect()
  const elementCenter = elementRect.left + elementRect.width / 2

  tooltip.style.top = `${elementRect.bottom + spacing}px`
  tooltip.style.left = `${elementCenter - tooltipRect.width / 2}px`

  const bounds = outOfTooltipContainer(tooltip, spacing)
  if (bounds.bottom) {
    resetTooltipPosition(tooltip)
    return false
  }
  if (bounds.right) {
    tooltip.style.right = `${spacing}px`
    tooltip.style.left = "initial"
  }
  if (bounds.left) tooltip.style.left = `${spacing}px`
  return true
}

function positionTooltipLeft(tooltip, elementRect, spacing) {
  const tooltipRect = tooltip.getBoundingClientRect()
  const elementCenter = elementRect.top + elementRect.height / 2

  tooltip.style.top = `${elementCenter - tooltipRect.height / 2}px`
  tooltip.style.left = `${elementRect.left - tooltipRect.width - spacing}px`

  const bounds = outOfTooltipContainer(tooltip, spacing)
  if (bounds.left) {
    resetTooltipPosition(tooltip)
    return false
  }
  if (bounds.bottom) {
    tooltip.style.bottom = `${spacing}px`
    tooltip.style.top = "initial"
  }
  if (bounds.top) tooltip.style.top = `${spacing}px`
  return true
}

function positionTooltipRight(tooltip, elementRect, spacing) {
  const tooltipRect = tooltip.getBoundingClientRect()
  const elementCenter = elementRect.top + elementRect.height / 2

  tooltip.style.top = `${elementCenter - tooltipRect.height / 2}px`
  tooltip.style.left = `${elementRect.right + spacing}px`

  const bounds = outOfTooltipContainer(tooltip, spacing)
  if (bounds.right) {
    resetTooltipPosition(tooltip)
    return false
  }
  if (bounds.bottom) {
    tooltip.style.bottom = `${spacing}px`
    tooltip.style.top = "initial"
  }
  if (bounds.top) tooltip.style.top = `${spacing}px`
  return true
}

function outOfTooltipContainer(element, spacing) {
  const rect = element.getBoundingClientRect()
  const containerRect = tooltipContainer.getBoundingClientRect()
  const widthRestricted = TOOLTIP_MAX_WIDTH > containerRect.width - spacing * 2

  return {
    left: rect.left < containerRect.left + spacing || widthRestricted,
    right: rect.right > containerRect.right - spacing || widthRestricted,
    top: rect.top < containerRect.top + spacing,
    bottom: rect.bottom > containerRect.bottom - spacing
  }
}

function resetTooltipPosition(tooltip) {
  tooltip.style.left = "initial"
  tooltip.style.right = "initial"
  tooltip.style.top = "initial"
  tooltip.style.bottom = "initial"
}
