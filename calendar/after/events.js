import { isSameDay, parseISO } from "date-fns"

const EVENTS_KEY = "CALENDAR.events"

let events = (JSON.parse(localStorage.getItem(EVENTS_KEY)) || []).map(event => {
  return { ...event, date: parseISO(event.date) }
})

export function addEvent(event) {
  events.push(event)
  save()
}

export function updateEvent(event) {
  events = events.map(e => {
    if (e.id === event.id) return event
    return e
  })
  save()
}

export function removeEvent(event) {
  events = events.filter(e => e.id !== event.id)
  save()
}

export function getEventsForDay(date) {
  return events.filter(event => isSameDay(event.date, date)).sort(compareEvents)
}

function compareEvents(eventA, eventB) {
  if (eventA.isAllDay && eventB.isAllDay) {
    return 0
  } else if (eventA.isAllDay) {
    return -1
  } else if (eventB.isAllDay) {
    return 1
  } else {
    return (
      eventTimeToNumber(eventA.startTime) - eventTimeToNumber(eventB.startTime)
    )
  }
}

function eventTimeToNumber(time) {
  return parseFloat(time.replace(":", "."))
}

function save() {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
}
