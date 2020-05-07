
module.exports = (string) => {
  if (typeof string !== 'string') {
    return []
  }
  const words = string.match(/[a-zA-Z0-9а-яА-ЯёЁ]+/g)
  if (!words) {
    return []
  }

  return words
}