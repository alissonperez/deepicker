// Performs a merge from source into destination
// It's simillar to Object.assign, but merge deeply
// between objects
function performMerge (destination, source) {
  Object.keys(source).forEach(key_source => {
    if (key_source === '*') {
      Object.keys(destination).forEach(destination_key => {
        performMerge(destination[destination_key], source[key_source])
      })
    }

    // Adding all * content already set in destination
    // At our source before adding it into destination
    if (key_source !== '*' && Object.prototype.hasOwnProperty.call(destination, '*')) {
      performMerge(source[key_source], destination['*'])
    }

    if (!(destination[key_source])) {
      destination[key_source] = source[key_source]
      return
    }

    performMerge(destination[key_source], source[key_source])
  })
}

module.exports = {
  performMerge
}
