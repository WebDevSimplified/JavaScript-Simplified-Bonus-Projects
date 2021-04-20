import axios from "axios"

const apiInstance = axios.create({
  baseURL: process.env.SERVER_URL,
  withCredentials: true,
})
const stripe = Stripe(process.env.STRIPE_PUBLIC_KEY)

export async function downloadAll(email) {
  return apiInstance
    .post("/download-all", { email })
    .then(res => alert(res.data.message))
    .catch(res => alert(res.data.message))
}

export async function getItems() {
  const res = await apiInstance.get("/items")
  return res.data
}

export function downloadItem(itemId) {
  return apiInstance
    .post("/download-email", { itemId })
    .then(res => alert(res.data.message))
    .catch(res => alert(res.data.message))
}

export function purchaseItem(itemId) {
  return apiInstance
    .post("/create-checkout-session", {
      itemId,
    })
    .then(res => {
      return stripe.redirectToCheckout({ sessionId: res.data.id })
    })
    .then(function (result) {
      if (result.error) {
        alert(result.error.message)
      }
    })
    .catch(function (error) {
      console.error("Error:", error)
      alert(error)
    })
}
