const util = require('./util')

function handleWildcard (object) {
  if (object['*']) {
    Object.keys(object).filter(i => i !== '*').forEach(key => {
      util.performMerge(object[key], object['*'])
    })
  }

  Object.keys(object).forEach(key => {
    handleWildcard(object[key])
  })
}

function parseFields (fields) {
  let result = {}

  function fill(items, object, pos) {
    let item = items[pos]
    if (!item) {
      return
    }

    if (!object.hasOwnProperty(item)) {
      object[item] = {}
    }

    fill(items, object[item], ++pos) // Go to next
  }

  for (let option of fields) {
    fill(option.trim().split('.'), result, 0)
  }

  handleWildcard(result)

  return result
}

module.exports = (val) => {
  return parseFields(val.split(','))
}
