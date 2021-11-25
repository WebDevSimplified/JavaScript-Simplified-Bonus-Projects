import setupDragAndDrop from "./dragAndDrop";
import { v4 as uuidV4 } from "uuid";
import { globalEventListener } from "./utils.js";

//Setting up the drag and drop
setupDragAndDrop(onDragComplete);

globalEventListener("submit", "[data-task-form]", (e) => {
  e.preventDefault();
  const taskInput = e.target.querySelector("[data-task-input]");
  const taskText = taskInput.value;
  if (taskText === "") return;

  const task = { id: uuidV4(), text: taskText };
  const laneElement = e.target.closest(".lane").querySelector("[data-lane-id]");
  lanes[laneElement.dataset.laneId].push(task);
  const taskElement = createTaskElement(task);
  laneElement.append(taskElement);
  taskInput.value = "";
  saveLanes(lanes);
});

function onDragComplete(e) {
  const startLaneId = e.startZone.dataset.laneId;
  const endLaneId = e.endZone.dataset.laneId;
  const startLaneTasks = lanes[startLaneId]; //returns [{id: xx, text: xx}]
  const endLaneTasks = lanes[endLaneId];
  const task = startLaneTasks.find((t) => t.id === e.dragElement.id); //returns the task itself {id: xx, text: xx}
  startLaneTasks.splice(startLaneTasks.indexOf(task), 1);
  endLaneTasks.splice(e.index, 0, task);
  saveLanes(lanes);
}
//setting up lanes and saving the tasks
const storagePrefix = "TRELLO_CLONE";
const LANES_STORAGE_KEY = `${storagePrefix}-lanes`;

const DEFAULT_LANES = {
  backlog: [],
  doing: [{ id: uuidV4(), text: "Create your first task" }],
  done: [],
};

const lanes = loadLanes();
renderTasks(lanes);

function loadLanes() {
  const lanesJson = localStorage.getItem(LANES_STORAGE_KEY);
  return JSON.parse(lanesJson) || DEFAULT_LANES;
}

function saveLanes() {
  localStorage.setItem(LANES_STORAGE_KEY, JSON.stringify(lanes));
}

function renderTasks() {
  Object.entries(lanes).forEach((obj) => {
    const laneId = obj[0];
    const tasks = obj[1];
    const lane = document.querySelector(`[data-lane-id="${laneId}"]`);
    tasks.forEach((task) => {
      const taskElement = createTaskElement(task);

      lane.append(taskElement);
    });
  });
}

function createTaskElement(task) {
  const element = document.createElement("div");
  element.id = task.id;
  element.innerText = task.text;
  element.classList.add("task");
  element.dataset.draggable = true;

  return element;
}

const deleteTask = (e) => {
  trash.classList.add("onhover");
  trash.addEventListener(
    "mouseleave",
    () => {
      trash.classList.remove("onhover");
    },
    { once: true }
  );
  saveLanes(lanes);
};

globalEventListener("mousedown", "[data-draggable]", (e) => {
  console.log(e.target);
});

//add an event listener to the trash can. on mouse over
//if th event listener is triggered and the coordinates of the bin overlap with those of a
//task then add the onhover class to the bin

// 1. add a button that allows a user to download or upload their tasks
//2. add a button to upload the user's tasks
//3. add a button that allows a user to create new lanes and drag the tasks between each laanes
//4. button to remove tasks
