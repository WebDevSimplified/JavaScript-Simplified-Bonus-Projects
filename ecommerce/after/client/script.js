import { getItems, purchaseItem, downloadItem, downloadAll } from "./api"

const itemTemplate = document.getElementById("item-template")
const itemList = document.querySelector("[data-item-list]")
const emailForm = document.querySelector("[data-email-form]")
const emailInput = document.querySelector("[data-email-input]")

emailForm.addEventListener("submit", async e => {
  e.preventDefault()
  await downloadAll(emailInput.value)
  window.location = window.location
})

async function loadItems() {
  const items = await getItems()

  itemList.innerHTML = ""
  items.forEach(item => {
    const itemElement = itemTemplate.content.cloneNode(true)
    itemElement.querySelector("[data-item-name]").textContent = item.name
    const priceElement = itemElement.querySelector("[data-item-price]")
    priceElement.textContent = `$${item.price}`

    const button = itemElement.querySelector("[data-item-btn]")
    if (item.purchased) {
      button.classList.add("download-btn")
      button.textContent = "Download"
      button.addEventListener("click", () => {
        downloadItem(item.id)
      })
    } else {
      button.classList.add("purchase-btn")
      button.textContent = "Purchase"
      button.addEventListener("click", () => {
        purchaseItem(item.id)
      })
    }

    itemList.append(itemElement)
  })
}

loadItems()
