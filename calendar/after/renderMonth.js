import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import createDayElement from "./createDayElement"

const daysContainer = document.querySelector("[data-calendar-days]")
export default function renderMonth(monthDate) {
  document.querySelector("[data-month-title]").textContent = format(
    monthDate,
    "MMMM yyyy"
  )
  daysContainer.innerHTML = ""
  const dayElements = getCalendarDates(monthDate).map((date, index) => {
    return createDayElement(date, {
      showWeekName: index < 7,
      isCurrentMonth: isSameMonth(monthDate, date),
      isCurrentDay: isSameDay(Date.now(), date),
    })
  })
  dayElements.forEach(element => daysContainer.append(element))
  dayElements.forEach(fixEventOverflow)
}

export function fixEventOverflow(dateContainer) {
  const eventContainer = dateContainer.querySelector("[data-event-container]")
  const viewMoreButton = dateContainer.querySelector("[data-view-more-btn]")
  const events = eventContainer.querySelectorAll("[data-event]")
  viewMoreButton.classList.add("hide")
  events.forEach(event => event.classList.remove("hide"))
  let extraEvents = 0
  for (let i = events.length - 1; i >= 0; i--) {
    if (dateContainer.scrollHeight <= dateContainer.clientHeight) break
    events[i].classList.add("hide")
    extraEvents++
    viewMoreButton.classList.remove("hide")
    viewMoreButton.textContent = `+ ${extraEvents} More`
  }
}

function getCalendarDates(date) {
  const firstWeekStart = startOfWeek(startOfMonth(date), { weekStartsOn: 1 })
  const lastWeekEnd = endOfWeek(endOfMonth(date), { weekStartsOn: 1 })

  const dates = eachDayOfInterval({ start: firstWeekStart, end: lastWeekEnd })
  return dates
}
