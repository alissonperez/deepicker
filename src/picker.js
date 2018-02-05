
// Utility to test if a givem param is a function
function isFunction(functionToCheck) {
  var getType = {}
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]'
}

function newPicker (incTree, excTree) {
  const localPicker = Object.create(picker)

  localPicker.incTree = incTree || {}
  localPicker.excTree = excTree || {}

  return localPicker
}

const picker = {
  // Include and exclude trees
  incTree: {},
  excTree: {},

  include: function (key) {
    if (this.excTree && this.excTree.hasOwnProperty(key)) {
      return false
    }

    if (!this.incTree || Object.keys(this.incTree).length === 0) {
      return true
    }

    return this.incTree && this.incTree.hasOwnProperty(key)
  },

  pickPromise: function (val) {
    return this._pick(val, this.incTree, this.excTree, true)
  },

  pick: function (val) {
    return this._pick(val, this.incTree, this.excTree, false)
  },

  _pick: function (val, incTree, excTree, promise) {
    // Simple values
    if (typeof val === 'number' ||
        typeof val === 'string' ||
        val === null ||
        val === undefined) {
      return val
    }

    incTree = incTree || {}
    excTree = excTree || {}

    // Promises (if we handle it)
    if (promise && val && typeof val.then === 'function') {
      return val.then(promiseResult => {
        return this._pick(promiseResult, incTree, excTree, promise)
      })
    }

    // A function
    if (isFunction(val)) {
      return val(newPicker(incTree, excTree))
    }

    // An array TODO Check how handle promises here
    if (val instanceof Array) {
      if (promise) {
        return Promise.all(val.map(item => this._pick(item, incTree, excTree, promise)))
      }

      return val.map(item => this._pick(item, incTree, excTree, promise))
    }

    // Objects
    const result = {}
    const promises = []

    let keys = Object.keys(incTree)
    if (keys.length === 0) {
      keys = Object.keys(val)
    }

    let key
    for (let i in keys) {
      key = keys[i]
      if (!val.hasOwnProperty(key)) continue

      // Exclude
      if (excTree[key] && Object.keys(excTree[key]).length === 0) continue

      // Solve key
      result[key] = this._pick(val[key], incTree[key], excTree[key], promise)

      if (promise && result[key] && typeof result[key].then === 'function') {
        promises.push(key, result[key])
      }
    }

    // Wait promises if we handle it
    if (promise && promises.length > 0) {
      return Promise.all(promises).then(promisesResult => {
        // Iterating over pair of key and result
        for (let i=0; i < promisesResult.length; i += 2) {
          result[promisesResult[i]] = promisesResult[i+1]
        }

        return result
      })
    }

    return promise ? Promise.resolve(result) : result
  }
}

module.exports = newPicker
