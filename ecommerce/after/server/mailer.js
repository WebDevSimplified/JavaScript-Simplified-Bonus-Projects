const apiInstance = require("./sendInBlueApiInstance")

function sendAllDownloadLinks(email, downloadableItems) {
  if (downloadableItems.length === 0) return

  return sendEmail({
    email,
    subject: `Download Your Files`,
    htmlContent: downloadableItems
      .map(({ item, code }) => {
        return `<a href="${process.env.SERVER_URL}/download/${code}">Download ${item.name}</a>`
      })
      .join("<br>"),
    textContent: downloadableItems
      .map(({ item, code }) => {
        return `Download ${item.name} ${process.env.SERVER_URL}/download/${code}`
      })
      .join("\n"),
  })
}

function sendDownloadLink(email, downloadLinkCode, item) {
  return sendEmail({
    email,
    subject: `Download ${item.name}`,
    htmlContent: `
    <h1>Thank you for purchasing ${item.name}</h1>

    <a href="${process.env.SERVER_URL}/download/${downloadLinkCode}">Download it now</a>
  `,
    textContent: `Thank you for purchasing ${item.name}
  Download it now. ${process.env.SERVER_URL}`,
  })
}

function sendEmail({ email, ...options }) {
  const sender = {
    name: "Kyle From Web Dev Simplified",
    email: "kyle@webdevsimplified.com",
  }
  return apiInstance.post("smtp/email", {
    sender,
    replyTo: sender,
    to: [{ email }],
    ...options,
  })
}

module.exports = { sendDownloadLink, sendAllDownloadLinks }
