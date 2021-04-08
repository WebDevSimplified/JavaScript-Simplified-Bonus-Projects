require("dotenv").config()
const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const { v4: uuidV4 } = require("uuid")

const items = require("./items.json")
const app = express()
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const mailer = require("@sendgrid/mail")
mailer.setApiKey(process.env.SEND_GRID_API_KEY)

const downloadLinkMap = new Map()
const DOWNLOAD_LINK_EXPIRATION = 10 * 60 * 1000 // 10 Minutes
const COOKIE_EXPIRATION = 30 * 24 * 60 * 60 * 1000 // 30 Days

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.get("/items", (req, res) => {
  // Maybe don't bother hashing the email and just save it as is in the cookie since they will need to access their email to do the download anyway
  const email = req.cookies.email
  // if (email == null) return res.json([])

  return res.json(
    items.map(item => {
      return {
        id: item.id,
        name: item.name,
        price: item.priceCents / 100,
        // Set this based on the cookie email and SendGrid's list
        purchased: false,
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
  const productId = req.body.productId
  // If email is not part of product send back some form of error
  // Check if email is associated with productId an if so then generate download link
  const code = createDownloadCode(productId)
  // Send email with this code in it for download and success message
})

app.post("/create-checkout-session", async (req, res) => {
  const item = items.find(i => i.id === parseInt(req.body.itemId))
  sendEmail("webdevsimplified@gmail.com", "sdfsdf", item)
  if (item == null) {
    return res.status(400).json({ message: "invalid item" })
  }
  const session = await stripe.checkout.sessions.create({
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

  res.json({ id: session.id })
})

app.get("/purchase-success", async (req, res) => {
  const item = items.find(i => i.id === parseInt(req.query.itemId))
  const {
    customer_details: { email },
  } = await stripe.checkout.sessions.retrieve(req.query.sessionId)

  res.cookie("email", email, {
    httpOnly: true,
    secure: true,
  })
  // If the purchase was successful then create a download link map and delete it after 10 minutes
  const downloadLinkCode = createDownloadCode(item.id)
  sendEmail(email, downloadLinkCode, item)
  res.redirect(`${process.env.CLIENT_URL}/download-links.html`)
})

app.get("/", (req, res) => {
  res.cookie("Test", "Value", {
    maxAge: COOKIE_EXPIRATION,
    httpOnly: true,
    secure: true,
  })
})

function sendEmail(email, downloadLinkCode, item) {
  const msg = {
    to: email,
    from: "kyle@webdevsimplified.com",
    subject: `Download ${item.name}`,
    text: "Test",
    html: `
      <h1>Thank you for purchasing ${item.name}</h1>

      <a href="${process.env.SERVER_URL}/download/${downloadLinkCode}">Download it now</a>
    `,
  }
  console.log(msg)
  mailer
    .send(msg)
    .then(() => {
      console.log("Email sent")
    })
    .catch(error => {
      console.error(error)
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
