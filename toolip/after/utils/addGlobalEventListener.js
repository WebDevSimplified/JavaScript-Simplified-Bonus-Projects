export default function addGlobalEventListener(type, selector, callback) {
  document.addEventListener(type, e => {
    if (e.target.matches && e.target.matches(selector)) {
      callback(e)
    }
  })
}
