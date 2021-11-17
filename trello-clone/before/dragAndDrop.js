import { globalEventListener } from "./utils";

export default function setup(onDragComplete) {
  globalEventListener("mousedown", "[data-draggable]", (e) => {
    const selectedItem = e.target;
    const itemClone = selectedItem.cloneNode(true);
    const ghost = selectedItem.cloneNode();
    const offset = setupDragItems(selectedItem, itemClone, ghost, e);
    positionClone(itemClone, e, offset);
    setupDragEvents(itemClone, selectedItem, ghost, offset, onDragComplete);
  });
}

function setupDragItems(selectedItem, itemClone, ghost, e, onDragComplete) {
  const originalRect = selectedItem.getBoundingClientRect();
  const offset = {
    x: e.clientX - originalRect.left,
    y: e.clientY - originalRect.top,
  };
  selectedItem.classList.add("hide");
  itemClone.style.width = `${originalRect.width}px`;
  itemClone.classList.add("dragging");
  document.body.append(itemClone);

  ghost.classList.add("ghost");
  ghost.innerHTML = "";
  ghost.style.height = `${originalRect.height}px`;
  selectedItem.parentElement.insertBefore(ghost, selectedItem);
  return offset;
}

function setupDragEvents(
  itemClone,
  selectedItem,
  ghost,
  offset,
  onDragComplete
) {
  const mouseMovedFunction = (e) => {
    const dropZone = getDropZone(e.target);
    positionClone(itemClone, e, offset);
    if (dropZone == null) return;

    const closestChild = Array.from(dropZone.children).find((child) => {
      const rect = child.getBoundingClientRect();
      return e.clientY < rect.top + rect.height / 2; //if the mouse's vertical pos is higher than the middle of the task
    });

    if (closestChild != null) {
      dropZone.insertBefore(ghost, closestChild); //inserts ghost before the closest child
    } else {
      dropZone.append(ghost);
    }
  };
  document.addEventListener("mousemove", mouseMovedFunction);
  document.addEventListener(
    "mouseup",
    () => {
      document.removeEventListener("mousemove", mouseMovedFunction);
      const dropZone = getDropZone(ghost);

      if (dropZone) {
        onDragComplete({
          startZone: getDropZone(selectedItem),
          endZone: dropZone,
          dragElement: selectedItem,
          index: Array.from(dropZone.children).indexOf(ghost),
        });
        dropZone.insertBefore(selectedItem, ghost);
      }

      stopDrag(itemClone, selectedItem, ghost);
    },
    { once: true }
  );
}

function stopDrag(itemClone, selectedItem, ghost) {
  itemClone.remove();
  selectedItem.classList.remove("hide");
  ghost.remove();
}

function positionClone(itemClone, mousePosition, offset) {
  itemClone.style.top = `${mousePosition.clientY - offset.y}px`;
  itemClone.style.left = `${mousePosition.clientX - offset.x}px`;
}

function getDropZone(element) {
  if (element.matches("[data-drop-zone]")) {
    return element;
  } else {
    return element.closest("[data-drop-zone]");
  }
}

//The dropzone of the the selected element only changes when you move it to a new drop zone
//while you are moving an element around with your mouse the dropzone still remains the same until you
//release the mouse because it has not been moved from its original position in the html until the
//dropZone.insertBefore(selectedItem, ghost); function runs
