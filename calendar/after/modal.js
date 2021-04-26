import { format } from "date-fns"
import { v4 as uuidV4 } from "uuid"

const overlay = document.querySelector("[data-overlay]")
overlay.addEventListener("click", closeModal)
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal()
})

export function openAddEventModal(date, callback) {
  openModal(getEventFormModalBody({ date }, callback))
}

export function openEditEventModal(event, saveCallback, deleteCallback) {
  openModal(getEventFormModalBody(event, saveCallback, deleteCallback))
}

const eventModalTemplate = document.getElementById("event-form-template")
function getEventFormModalBody(event, saveCallback, deleteCallback) {
  const formModalBody = eventModalTemplate.content.cloneNode(true)
  const isNewEvent = event.id == null
  formModalBody.querySelector("[data-title]").textContent = isNewEvent
    ? "Add Event"
    : "Edit Event"
  formModalBody.querySelector("[data-date]").textContent = format(
    event.date,
    "M/d/yyyy"
  )

  const form = formModalBody.querySelector("[data-form]")
  form.querySelector("[data-save-btn]").textContent = isNewEvent
    ? "Add"
    : "Update"
  const deleteButton = form.querySelector("[data-delete-btn]")
  if (event.id != null && deleteCallback) {
    deleteButton.addEventListener("click", () => {
      deleteCallback(event)
      closeModal()
    })
  } else {
    deleteButton.remove()
  }

  const nameInput = form.querySelector("[data-name]")
  nameInput.value = event.name || ""

  const startTimeInput = form.querySelector("[data-start-time]")
  const endTimeInput = form.querySelector("[data-end-time]")
  startTimeInput.value = event.startTime
  endTimeInput.value = event.endTime

  const colorRadio = form.querySelector(`[data-color][value="${event.color}"`)
  if (colorRadio) colorRadio.checked = true

  const allDayCheckbox = form.querySelector("[data-all-day]")
  allDayCheckbox.checked = event.isAllDay
  startTimeInput.disabled = allDayCheckbox.checked
  endTimeInput.disabled = allDayCheckbox.checked
  allDayCheckbox.addEventListener("change", e => {
    startTimeInput.disabled = e.target.checked
    endTimeInput.disabled = e.target.checked
  })
  startTimeInput.addEventListener("change", () => {
    endTimeInput.min = startTimeInput.value
  })

  form.addEventListener("submit", e => {
    e.preventDefault()

    const isAllDay = allDayCheckbox.checked
    saveCallback({
      id: event.id || uuidV4(),
      name: nameInput.value,
      date: event.date,
      isAllDay,
      startTime: isAllDay ? undefined : startTimeInput.value,
      endTime: isAllDay ? undefined : endTimeInput.value,
      color: form.querySelector("[data-color]:checked").value,
    })
    closeModal()
  })

  return formModalBody
}

const modal = document.querySelector("[data-modal]")
const modalBody = document.querySelector("[data-modal-body]")
function openModal(content) {
  modalBody.innerHTML = ""
  modalBody.append(content)
  modal.classList.add("show")
}

function closeModal() {
  modal.classList.remove("show")
}
