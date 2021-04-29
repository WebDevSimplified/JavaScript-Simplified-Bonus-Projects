import { format } from "date-fns"
import createEventElement from "./createEventElement"
import { addEvent, getEventsForDay } from "./events"
import { openAddEventModal, openViewAllModal } from "./modal"
import renderMonth from "./renderMonth"

const dayTemplate = document.getElementById("day-template")
export default function createDayElement(date, options = {}) {
  const {
    showWeekName = false,
    isCurrentMonth = true,
    isCurrentDay = false,
  } = options

  const dayElement = dayTemplate.content
    .cloneNode(true)
    .querySelector("[data-date-wrapper]")
  if (showWeekName) {
    dayElement.querySelector("[data-week-name]").textContent = format(date, "E")
  }
  if (!isCurrentMonth) {
    dayElement.classList.add("non-month-day")
  }
  const dayNumberElement = dayElement.querySelector("[data-day-number]")
  if (isCurrentDay) {
    dayNumberElement.classList.add("active")
  }
  dayNumberElement.textContent = date.getDate()
  const eventContainer = dayElement.querySelector("[data-event-container]")
  dayElement
    .querySelector("[data-view-more-btn]")
    .addEventListener("click", () =>
      openViewAllModal(date, getEventsForDay(date).map(createEventElement))
    )
  eventContainer.innerHTML = ""
  getEventsForDay(date).forEach(event => {
    const element = createEventElement(event)
    eventContainer.append(element)
  })
  dayElement
    .querySelector("[data-add-event-btn]")
    .addEventListener("click", () =>
      openAddEventModal(date, event => {
        addEvent(event)
        renderMonth(date)
      })
    )
  return dayElement
}
