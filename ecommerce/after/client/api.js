import axios from "axios"

const stripe = Stripe(process.env.STRIPE_PUBLIC_KEY)
const apiInstance = axios.create({
  baseURL: process.env.SERVER_URL,
  withCredentials: true,
})

export async function getItems() {
  const res = await apiInstance.get("/items")
  return res.data
}

export function purchaseItem(itemId) {
  return apiInstance
    .post("/create-checkout-session", {
      itemId: itemId,
    })
    .then(res => stripe.redirectToCheckout({ sessionId: res.data.id }))
    .then(res => {
      if (res.error) alert(res.error.message)
    })
    .catch(res => {
      console.error(res)
      alert(res)
    })
}

export function downloadItem(itemId) {
  apiInstance
    .post("/download-email", { itemId: itemId })
    .then(res => alert(res.data.message))
    .catch(res => alert(res.data.message))
}

export function downloadAll(email) {
  apiInstance
    .post("/download-all", { email })
    .then(res => alert(res.data.message))
    .catch(res => alert(res.data.message))
}
