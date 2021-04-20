const apiInstance = require("./sendInBlueApiInstance")
const items = require("./items.json")

async function linkContactAndItem(email, { listId }) {
  const contact = await getContact(email)
  if (contact == null) {
    return createContact(email, listId)
  } else {
    return updateContact(contact.id, listId)
  }
}

async function getContactPurchasedItems(email) {
  if (email == null) return []
  const contact = await getContact(email)
  if (contact == null) return []
  return items.filter(item => contact.listIds.includes(item.listId))
}

function createContact(email, listId) {
  return apiInstance.post("/contacts", {
    email,
    listIds: [listId],
  })
}

function updateContact(emailOrId, listId) {
  return apiInstance.put(`/contacts/${emailOrId}`, {
    listIds: [listId],
  })
}

function getContact(emailOrId) {
  return apiInstance
    .get(`/contacts/${emailOrId}`)
    .then(res => res.data)
    .catch(e => {
      if (e.response.status === 404) return null
      throw e
    })
}

module.exports = { linkContactAndItem, getContactPurchasedItems }
