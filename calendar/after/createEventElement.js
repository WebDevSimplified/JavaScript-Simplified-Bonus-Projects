import { removeEvent, updateEvent } from "./events"
import { openEditEventModal } from "./modal"
import { format, parse } from "date-fns"
import renderMonth from "./renderMonth"

export default function createEventElement(event) {
  const element = event.isAllDay
    ? allDayEventToElement(event)
    : timeEventToElement(event)

  element.addEventListener("click", () => {
    openEditEventModal(
      event,
      updatedEvent => {
        updateEvent(updatedEvent)
        renderMonth(event.date)
      },
      deletedEvent => {
        removeEvent(deletedEvent)
        renderMonth(event.date)
      }
    )
  })

  return element
}

const allDayEventTemplate = document.getElementById("all-day-event-template")
function allDayEventToElement(event) {
  const element = allDayEventTemplate.content
    .cloneNode(true)
    .querySelector("[data-event]")
  element.classList.add(event.color)
  element.querySelector("[data-name]").textContent = event.name
  return element
}

const timeEventTemplate = document.getElementById("time-event-template")
function timeEventToElement(event) {
  const element = timeEventTemplate.content
    .cloneNode(true)
    .querySelector("[data-event]")
  element.querySelector("[data-name]").textContent = event.name
  element.querySelector("[data-color]").classList.add(event.color)
  element.querySelector("[data-time]").textContent = format(
    parse(event.startTime, "HH:mm", event.date),
    "h:mma"
  )
  return element
}
