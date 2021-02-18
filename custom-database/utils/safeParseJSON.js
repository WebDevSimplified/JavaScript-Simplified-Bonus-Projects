module.exports = function safeParseJSON(string) {
  try {
    return JSON.parse(string)
  } catch (e) {
    return
  }
}
