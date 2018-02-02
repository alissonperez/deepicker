function parseFields(fields) {
  let result = {}

  function fill(items, object) {
	  let first = items.shift()
	  if (!(first in object)) {
	    object[first] = {}
	  }

	  if (items.length > 0) {
	    fill(items, object[first])
	  }
  }

  let splited
  for (let option of fields) {
	  splited = option.trim().split('.')
	  fill(splited, result)
  }

  return result
}

module.exports = (val) => {
  return parseFields(val.split(','))
}
