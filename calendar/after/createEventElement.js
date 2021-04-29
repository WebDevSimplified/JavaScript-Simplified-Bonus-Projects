import { format, parse } from "date-fns"
import { openEditEventModal } from "./modal"
import renderMonth from "./renderMonth"
import { removeEvent, updateEvent } from "./events"

export default function createEventElement(event) {
  const element = event.isAllDay
    ? createAllDayEventElement(event)
    : createTimedEventElement(event)

  element.addEventListener("click", () => {
    openEditEventModal(
      event,
      updatedEvent => {
        updateEvent(updatedEvent)
        renderMonth(updatedEvent.date)
      },
      deletedEvent => {
        removeEvent(deletedEvent)
        renderMonth(deletedEvent.date)
      }
    )
  })

  return element
}

const allDayEventTemplate = document.getElementById("all-day-event-template")
function createAllDayEventElement(event) {
  const element = allDayEventTemplate.content
    .cloneNode(true)
    .querySelector("[data-event]")

  element.classList.add(event.color)
  element.querySelector("[data-name]").textContent = event.name
  return element
}

const timedEventTemplate = document.getElementById("timed-event-template")
function createTimedEventElement(event) {
  const element = timedEventTemplate.content
    .cloneNode(true)
    .querySelector("[data-event]")
  element.querySelector("[data-name]").textContent = event.name
  element.querySelector("[data-color]").classList.add(event.color)
  element.querySelector("[data-time]").textContent = format(
    parse(event.startTime, "HH:mm", event.date),
    "h:mmaaa"
  )
  return element
}
