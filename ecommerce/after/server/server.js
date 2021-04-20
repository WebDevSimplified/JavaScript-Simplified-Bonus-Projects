require("dotenv").config()
const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const { v4: uuidV4 } = require("uuid")

const items = require("./items.json")
const { sendDownloadLink, sendAllDownloadLinks } = require("./mailer")
const { getContactPurchasedItems, linkContactAndItem } = require("./contacts")
const app = express()
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

const downloadLinkMap = new Map()
const DOWNLOAD_LINK_EXPIRATION = 10 * 60 * 1000 // 10 Minutes
const COOKIE_EXPIRATION = 30 * 24 * 60 * 60 * 1000 // 30 Days

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
)

app.get("/items", async (req, res) => {
  const email = req.cookies.email
  const purchasedItemIds = (await getContactPurchasedItems(email)).map(
    item => item.id
  )

  return res.json(
    items.map(item => {
      return {
        id: item.id,
        name: item.name,
        price: item.priceCents / 100,
        purchased: purchasedItemIds.includes(item.id),
      }
    })
  )
})

app.get("/download/:code", (req, res) => {
  const productId = downloadLinkMap.get(req.params.code)
  if (productId == null) {
    return res.send("This link has either expired or is invalid")
  }

  const product = items.find(item => item.id === productId)
  if (product == null) {
    return res.send("This product could not be found")
  }

  res.download(`downloads/${product.file}`)
})

app.post("/download-email", (req, res) => {
  const email = req.cookies.email
  const itemId = req.body.itemId
  const code = createDownloadCode(itemId)
  sendDownloadLink(
    email,
    code,
    items.find(item => item.id === itemId)
  )
    .then(() => res.json({ message: "Check your email for a download link" }))
    .catch(() => res.status(500).json({ message: "Error: Please try again." }))
})

app.post("/download-all", async (req, res) => {
  const email = req.body.email
  const items = await getContactPurchasedItems(email)
  sendAllDownloadLinks(
    email,
    items.map(item => {
      return { item, code: createDownloadCode(item.id) }
    })
  )
  return res.json({ message: "Check your email for a download link" })
})

app.post("/create-checkout-session", async (req, res) => {
  const item = items.find(i => i.id === parseInt(req.body.itemId))
  if (item == null) {
    return res.status(400).json({ message: "invalid item" })
  }
  const session = await createCheckoutSession(item)

  res.json({ id: session.id })
})

function createCheckoutSession(item) {
  return stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: item.priceCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.SERVER_URL}/purchase-success?sessionId={CHECKOUT_SESSION_ID}&itemId=${item.id}`,
    cancel_url: process.env.CLIENT_URL,
  })
}

app.get("/purchase-success", async (req, res) => {
  const item = items.find(i => i.id === parseInt(req.query.itemId))
  const {
    customer_details: { email },
  } = await stripe.checkout.sessions.retrieve(req.query.sessionId)

  res.cookie("email", email, {
    httpOnly: true,
    secure: true,
    maxAge: COOKIE_EXPIRATION,
  })
  linkContactAndItem(email, item)
  const downloadLinkCode = createDownloadCode(item.id)
  sendDownloadLink(email, downloadLinkCode, item)
  res.redirect(`${process.env.CLIENT_URL}/download-links.html`)
})

function createDownloadCode(itemId) {
  const downloadUuid = uuidV4()
  downloadLinkMap.set(downloadUuid, itemId)
  setTimeout(() => {
    downloadLinkMap.delete(downloadUuid)
  }, DOWNLOAD_LINK_EXPIRATION)
  return downloadUuid
}

app.listen(3000)
