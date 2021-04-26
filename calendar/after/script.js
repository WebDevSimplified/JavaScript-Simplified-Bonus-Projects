import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  parse,
} from "date-fns"
import { addEvent, getEventsForDay, removeEvent, updateEvent } from "./events"
import { openAddEventModal, openEditEventModal } from "./modal"

const daysContainer = document.querySelector("[data-calendar-days]")

function renderMonth(monthDate) {
  document.querySelector("[data-month-title]").textContent = format(
    monthDate,
    "MMMM yyyy"
  )
  daysContainer.innerHTML = ""
  getCalendarDates(monthDate)
    .map((date, index) => {
      return dateToElement(date, {
        showWeekName: index < 7,
        isCurrentMonth: isSameMonth(monthDate, date),
        isCurrentDay: isSameDay(Date.now(), date),
      })
    })
    .forEach(element => daysContainer.append(element))
}

const dayTemplate = document.getElementById("day-template")
function dateToElement(
  date,
  { showWeekName = false, isCurrentMonth = false, isCurrentDay = false } = {}
) {
  const element = dayTemplate.content.cloneNode(true)
  if (showWeekName) {
    element.querySelector("[data-week-name]").textContent = format(date, "E")
  }
  if (!isCurrentMonth) {
    element.querySelector("[data-wrapper]").classList.add("non-month-day")
  }
  const dayNumberElement = element.querySelector("[data-day-number]")
  if (isCurrentDay) {
    dayNumberElement.classList.add("active")
  }
  dayNumberElement.textContent = date.getDate()
  const eventContainer = element.querySelector("[data-event-container]")
  renderEventElements(eventContainer, date)
  element.querySelector("[data-add-event-btn]").addEventListener("click", () =>
    openAddEventModal(date, event => {
      addEvent(event)
      renderEventElements(eventContainer, date)
    })
  )
  return element
}

function renderEventElements(eventContainer, date) {
  eventContainer.innerHTML = ""
  getEventsForDay(date).forEach(event => {
    const element = eventToElement(event)
    element.querySelector("[data-event]").addEventListener("click", () => {
      openEditEventModal(
        event,
        updatedEvent => {
          updateEvent(updatedEvent)
          renderEventElements(eventContainer, date)
        },
        deletedEvent => {
          removeEvent(deletedEvent)
          renderEventElements(eventContainer, date)
        }
      )
    })
    eventContainer.append(element)
  })
}

function eventToElement(event) {
  return event.isAllDay
    ? allDayEventToElement(event)
    : timeEventToElement(event)
}

const allDayEventTemplate = document.getElementById("all-day-event-template")
function allDayEventToElement(event) {
  const element = allDayEventTemplate.content.cloneNode(true)
  element.querySelector("[data-event]").classList.add(event.color)
  element.querySelector("[data-name]").textContent = event.name
  return element
}

const timeEventTemplate = document.getElementById("time-event-template")
function timeEventToElement(event) {
  const element = timeEventTemplate.content.cloneNode(true)
  element.querySelector("[data-name]").textContent = event.name
  element.querySelector("[data-color]").classList.add(event.color)
  element.querySelector("[data-time]").textContent = format(
    parse(event.startTime, "HH:mm", event.date),
    "h:mma"
  )
  return element
}

function getCalendarDates(date) {
  const firstWeekStart = startOfWeek(startOfMonth(date), { weekStartsOn: 1 })
  const lastWeekEnd = endOfWeek(endOfMonth(date), { weekStartsOn: 1 })

  const dates = eachDayOfInterval({ start: firstWeekStart, end: lastWeekEnd })
  return dates
}

function setup() {
  let selectedMonth = Date.now()
  document
    .querySelector("[data-next-month-btn")
    .addEventListener("click", () => {
      selectedMonth = addMonths(selectedMonth, 1)
      renderMonth(selectedMonth)
    })

  document
    .querySelector("[data-prev-month-btn")
    .addEventListener("click", () => {
      selectedMonth = addMonths(selectedMonth, -1)
      renderMonth(selectedMonth)
    })

  document.querySelector("[data-today-btn]").addEventListener("click", () => {
    selectedMonth = Date.now()
    renderMonth(selectedMonth)
  })

  renderMonth(selectedMonth)
}

setup()
