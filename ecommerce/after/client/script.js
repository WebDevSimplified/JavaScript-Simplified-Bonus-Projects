import axios from "axios"

const itemTemplate = document.getElementById("item-template")
const itemList = document.querySelector("[data-item-list]")
const serverUrl = process.env.SERVER_URL
const stripe = Stripe(process.env.STRIPE_PUBLIC_KEY)

function loadItems() {
  axios.get(`${serverUrl}/items`).then(res => {
    itemList.innerHTML = ""

    res.data.forEach(item => {
      const itemElement = itemTemplate.content.cloneNode(true)

      itemElement.querySelector("[data-item-name]").textContent = item.name

      const priceElement = itemElement.querySelector("[data-item-price]")
      priceElement.textContent = `$${item.price}`

      const button = itemElement.querySelector("[data-item-btn]")
      if (item.purchased) {
        button.textContent = "Download"
        button.classList.add("download-btn")
      } else {
        button.textContent = "Purchase"
        button.classList.add("purchase-btn")
        button.addEventListener("click", () => {
          axios
            .post(`${serverUrl}/create-checkout-session`, {
              itemId: item.id,
            })
            .then(res => stripe.redirectToCheckout({ sessionId: res.data.id }))
            .then(res => {
              if (res.error) alert(res.error.message)
            })
            .catch(res => {
              console.error(res)
              alert(res)
            })
        })
      }
      itemList.append(itemElement)
    })
  })
}

loadItems()
