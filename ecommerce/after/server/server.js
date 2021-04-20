require("dotenv").config()
const express = require("express")
const cookieParser = require("cookie-parser")
const app = express()
const cors = require("cors")
const items = require("./items.json")
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const { v4: uuidV4 } = require("uuid")
const { sendDownloadLink, sendAllDownloadLinks } = require("./mailer")
const { linkContactAndItem, getContactPurchasedItems } = require("./contacts")

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
  res.json(
    items.map(item => {
      return {
        id: item.id,
        name: item.name,
        price: item.priceInCents / 100,
        purchased: purchasedItemIds.includes(item.id),
      }
    })
  )
})

app.post("/download-email", (req, res) => {
  const email = req.cookies.email
  const itemId = req.body.itemId
  const code = createDownloadCode(itemId)
  sendDownloadLink(
    email,
    code,
    items.find(i => i.id === parseInt(itemId))
  )
    .then(() => {
      res.json({ message: "Check your email" })
    })
    .catch(() => {
      res.status(500).json({ message: "Error: Please try again" })
    })
})

app.post("/download-all", async (req, res) => {
  const email = req.body.email
  const items = await getContactPurchasedItems(email)
  setEmailCookie(res, email)
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
    return res.status(400).json({ message: "Invalid Item" })
  }
  const session = await createCheckoutSession(item)
  res.json({ id: session.id })
})

app.get("/download/:code", (req, res) => {
  const itemId = downloadLinkMap.get(req.params.code)
  if (itemId == null) {
    return res.send("This link has either expired or is invalid")
  }

  const item = items.find(i => i.id === itemId)
  if (item == null) {
    return res.send("This item could not be found")
  }

  downloadLinkMap.delete(req.params.code)
  res.download(`downloads/${item.file}`)
})

app.get("/purchase-success", async (req, res) => {
  const item = items.find(i => i.id === parseInt(req.query.itemId))
  const {
    customer_details: { email },
  } = await stripe.checkout.sessions.retrieve(req.query.sessionId)

  setEmailCookie(res, email)
  linkContactAndItem(email, item)
  const downloadLinkCode = createDownloadCode(item.id)
  sendDownloadLink(email, downloadLinkCode, item)
  res.redirect(`${process.env.CLIENT_URL}/download-links.html`)
})

function setEmailCookie(res, email) {
  res.cookie("email", email, {
    httpOnly: true,
    secure: true,
    maxAge: COOKIE_EXPIRATION,
    sameSite: "None",
  })
}

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
          unit_amount: item.priceInCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.SERVER_URL}/purchase-success?itemId=${item.id}&sessionId={CHECKOUT_SESSION_ID}`,
    cancel_url: process.env.CLIENT_URL,
  })
}

function createDownloadCode(itemId) {
  const downloadUuid = uuidV4()
  downloadLinkMap.set(downloadUuid, itemId)
  setTimeout(() => {
    downloadLinkMap.delete(downloadUuid)
  }, DOWNLOAD_LINK_EXPIRATION)
  return downloadUuid
}

app.listen(3000)
