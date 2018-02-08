
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

  toContext: function() {
    let incTree = this.incTree || {}
    let excTree = this.excTree || {}

    Array.from(arguments).forEach(item => {
      incTree = incTree[item] || incTree['*'] || {}
      excTree = excTree[item] || excTree['*'] || {}
    })

    return newPicker(incTree, excTree)
  },

  include: function (key, incTree, excTree) {
    incTree = incTree || this.incTree || {}
    excTree = excTree || this.excTree || {}

    // It is in include keys, must be included
    if (incTree.hasOwnProperty(key)) {
      return true
    }

    // Key isn't in include keys but its filled,
    // it can't be included
    if (Object.keys(incTree).length > 0
        && !incTree.hasOwnProperty('*')) {
      return false
    }

    // It is explicity in exclude keys and exclude keys is empty (is a leaf),
    // must not be included
    if (excTree.hasOwnProperty(key)
        && Object.keys(excTree[key]).length === 0) {
      return false
    }

    // Handle "*" wildcard in include
    if (incTree.hasOwnProperty('*')) {
      return true
    }

    // Handle "*" wildcard in exclude
    if (excTree.hasOwnProperty('*')
        && Object.keys(excTree['*']).length === 0) {
      return false
    }

    return true
  },

  pickStatic: function (val) {
    return this._pickStatic(val, this.incTree, this.excTree)
  },

  _pickStatic: function (val, incTree, excTree) {
    // Leafs (if we reach there)
    if (typeof val !== 'object') {
      return val
    }

    incTree = incTree || {}
    excTree = excTree || {}

    let keys = Object.keys(incTree)
    if (keys.length === 0 && Object.keys(excTree).length === 0) {
      // Nothing to do, a fast return with all value left
      return val
    }

    // Handle arrays
    if (val instanceof Array) {
      return val.map(item => this._pickStatic(item, incTree, excTree))
    }

    if (keys.length === 0 || keys.indexOf('*') > -1) {
      keys = Object.keys(val)
    }

    // Result object
    const result = {}

    keys.forEach(key => {
      if (!val.hasOwnProperty(key)) {
        return
      }

      // Exclude
      if (excTree[key] && Object.keys(excTree[key]).length === 0) {
        return
      }

      // Exclude with *
      if (excTree['*'] && Object.keys(excTree['*']).length === 0) {
        return
      }

      result[key] = this._pickStatic(
        val[key],
        incTree[key] || incTree['*'],
        excTree[key] || excTree['*']
      )
    })

    return result
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
    if (keys.length === 0 || keys.indexOf('*') > -1) {
      keys = Object.keys(val)
    }

    let key
    for (let i in keys) {
      key = keys[i]
      if (!val.hasOwnProperty(key)) continue

      // Exclude
      if (excTree[key] && Object.keys(excTree[key]).length === 0) continue

      // Exclude with *
      if (excTree['*'] && Object.keys(excTree['*']).length === 0) continue

      // Solve key
      result[key] = this._pick(
        val[key],
        incTree[key] || incTree['*'],
        excTree[key] || excTree['*'],
        promise
      )

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
