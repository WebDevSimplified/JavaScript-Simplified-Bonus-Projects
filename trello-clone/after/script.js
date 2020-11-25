import setupDragAndDrop from "./dragAndDrop.js"
import addGlobalEventListener from "./utils/addGlobalEventListener.js"
import { v4 as uuidV4 } from "uuid"

const STORAGE_PREFIX = "TRELLO_CLONE"
const LANES_STORAGE_KEY = `${STORAGE_PREFIX}-lanes`
const DEFAULT_LANES = {
  backlog: [{ id: uuidV4(), text: "Create your first task" }],
  doing: [],
  done: []
}
const lanes = loadLanes()
renderTasks()
setupDragAndDrop(onDragComplete)
addGlobalEventListener("submit", "[data-task-form]", e => {
  e.preventDefault()

  const taskInput = e.target.querySelector("[data-task-input]")
  const taskText = taskInput.value
  if (taskText === "") return

  const laneElement = e.target.closest(".lane").querySelector("[data-lane-id]")
  const task = { id: uuidV4(), text: taskText }
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

function renderTasks() {
  Object.entries(lanes).forEach(object => {
    const lane = document.querySelector(`[data-lane-id="${object[0]}"]`)
    const tasks = object[1]
    tasks.forEach(task => {
      const taskElement = createTaskElement(task)
      lane.append(taskElement)
    })
  })
}

function loadLanes() {
  const lanesJson = localStorage.getItem(LANES_STORAGE_KEY)
  return JSON.parse(lanesJson) || DEFAULT_LANES
}

function saveLanes() {
  localStorage.setItem(LANES_STORAGE_KEY, JSON.stringify(lanes))
}

function createTaskElement(task) {
  const taskElement = document.createElement("div")
  taskElement.id = task.id
  taskElement.dataset.draggable = true
  taskElement.classList.add("task")
  taskElement.innerText = task.text
  return taskElement
}
