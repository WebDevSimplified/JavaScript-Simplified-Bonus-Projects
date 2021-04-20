import { downloadAll, downloadItem, getItems, purchaseItem } from "./api"

const itemTemplate = document.getElementById("item-template")
const itemList = document.querySelector("[data-item-list]")
const emailForm = document.querySelector("[data-email-form]")
const emailInput = document.querySelector("[data-email-input]")

emailForm.addEventListener("submit", e => {
  e.preventDefault()
  downloadAll(emailInput.value)
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
      button.textContent = "Download"
      button.classList.add("download-btn")
      button.addEventListener("click", async () => {
        await downloadItem(item.id)
      })
    } else {
      button.textContent = "Purchase"
      button.classList.add("purchase-btn")
      button.addEventListener("click", async () => {
        await purchaseItem(item.id)
      })
    }
    itemList.append(itemElement)
  })
}

loadItems()
