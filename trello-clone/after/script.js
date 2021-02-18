import addGlobalEventListener from "./utils/addGlobalEventListener.js"
import setupDragAndDrop from "./dragAndDrop.js"
import { v4 as uuidV4 } from "uuid"

const STORAGE_PREFIX = "TRELLO_CLONE"
const LANES_STORAGE_KEY = `${STORAGE_PREFIX}-lanes`
const DEFAULT_LANES = {
  backlog: [{ id: uuidV4(), text: "Create your first task" }],
  doing: [],
  done: [],
}
const lanes = loadLanes()
renderTasks()

setupDragAndDrop(onDragComplete)

addGlobalEventListener("submit", "[data-task-form]", e => {
  e.preventDefault()

  const taskInput = e.target.querySelector("[data-task-input]")
  const taskText = taskInput.value
  if (taskText === "") return

  const task = { id: uuidV4(), text: taskText }
  const laneElement = e.target.closest(".lane").querySelector("[data-lane-id]")
  lanes[laneElement.dataset.laneId].push(task)

  const taskElement = createTaskElement(task)
  laneElement.append(taskElement)
  taskInput.value = ""

  saveLanes()
})

function onDragComplete(e) {
  const startLaneId = e.startZone.dataset.laneId
  const endLaneId = e.endZone.dataset.laneId
  const startLaneTasks = lanes[startLaneId]
  const endLaneTasks = lanes[endLaneId]

  const task = startLaneTasks.find(t => t.id === e.dragElement.id)
  startLaneTasks.splice(startLaneTasks.indexOf(task), 1)
  endLaneTasks.splice(e.index, 0, task)

  saveLanes()
}

function loadLanes() {
  const lanesJson = localStorage.getItem(LANES_STORAGE_KEY)
  return JSON.parse(lanesJson) || DEFAULT_LANES
}

function saveLanes() {
  localStorage.setItem(LANES_STORAGE_KEY, JSON.stringify(lanes))
}

function renderTasks() {
  Object.entries(lanes).forEach(obj => {
    const laneId = obj[0]
    const tasks = obj[1]
    const lane = document.querySelector(`[data-lane-id="${laneId}"]`)
    tasks.forEach(task => {
      const taskElement = createTaskElement(task)
      lane.append(taskElement)
    })
  })
}

function createTaskElement(task) {
  const element = document.createElement("div")
  element.id = task.id
  element.innerText = task.text
  element.classList.add("task")
  element.dataset.draggable = true
  return element
}
