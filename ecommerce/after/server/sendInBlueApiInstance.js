const axios = require("axios")

module.exports = axios.create({
  baseURL: "https://api.sendinblue.com/v3",
  headers: { "api-key": process.env.SEND_IN_BLUE_API_KEY },
})
