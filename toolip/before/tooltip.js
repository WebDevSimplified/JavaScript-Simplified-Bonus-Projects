//show tool tip on hover
//position the tooltip so it appears overhead by default
//hide the tooltip on mouseleave

import addGlobalEventListener from "./utils";

const toolTipContainer = document.createElement("div");
toolTipContainer.classList.add("tooltip-container");
document.body.append(toolTipContainer);

const DEFAULT_SPACING = 5;

addGlobalEventListener("mouseover", "[data-tooltip]", (e) => {
  const tooltipMessage = createTooltipMessage(e.target.dataset.tooltip);
  e.target.addEventListener(
    "mouseleave",
    () => {
      removeTooltip(tooltipMessage);
    },
    { once: true }
  );
  toolTipContainer.append(tooltipMessage);
  positionTooltip(tooltipMessage, e.target);
});

function createTooltipMessage(text) {
  const tooltipMessage = document.createElement("div");

  tooltipMessage.classList.add("tooltip");
  tooltipMessage.innerText = text;
  return tooltipMessage;
}

function removeTooltip(tooltipMessage) {
  tooltipMessage.remove();
}

function positionTooltip(tooltipMessage, element) {
  const tooltipMessageInfo = tooltipMessage.getBoundingClientRect();
  const elementInfo = element.getBoundingClientRect();
  const spacing = element.dataset.spacing || DEFAULT_SPACING;
  tooltipMessage.style.top = `${
    elementInfo.top - tooltipMessageInfo.height - spacing
  }px`;
  tooltipMessage.style.left = `${
    elementInfo.left + elementInfo.width / 2 - tooltipMessageInfo.width / 2
  }px`;
}
