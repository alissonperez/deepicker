const deepMerge = require('deepmerge')

const tokens = {
  ',': 'COMMA',
  '/': 'SLASH',
  '(': 'POPEN',
  ')': 'PCLOSE',
  // We have a FIELD token, but we can't represent it here
}

// A very simple tokenizer, if grammar increase it's complexity
// it's better to improve it or rewrite.
function tokenizer(text) {
  let v, result = [], i = 0, field, startField

  while (i < text.length) {
    v = text[i]

    if (v === ' ') {
      i++
      continue
    }

    // Main tokens
    if (tokens.hasOwnProperty(v)) {
      result.push({k: tokens[v], v: v, startIndex: i})
      i++
      continue
    }

    // If it's not a know token, it only can be a FIELD
    field = ''
    startField = i
    do {
      field += v
      // Move to next char
      v = text[++i]
    } while (i < text.length && !tokens.hasOwnProperty(v))

    result.push({k: 'FIELD', v:field, startIndex: startField})
  }

  return result
}

// GRAMMAR:

// FILTERS := FILTER "," FILTERS | FILTER
// FILTER := OBJECT | FIELDPATH
// OBJECT := FIELDPATH "(" FILTERS ")"
// FIELDPATH := FIELD "/" FIELDPATH | FIELD
const parser = {
  // This will be overrided for each new object
  pos: 0, // Current token position
  tokens: [], // Tokens list

  // Return current token
  current: function () {
    return this.tokens[this.pos] || {}
  },

  // Move to next token
  next: function () {
    this.pos++
  },

  currentPos: function () {
    return this.pos
  },

  backTrack: function (pos) {
    this.pos = pos
  },

  isLastPos: function () {
    return this.pos >= (this.tokens.length - 1)
  },

  parse: function () {
    const result = this.parseFilters()
    //console.log('RESULT', result)
    if (!this.isLastPos()) {
      this.raiseError()
    }

    return result
  },

  parseFilters: function () {
    //console.log('CURRENT, parseFilterS', this.current())
    const result = this.parseFilter()

    //console.log('filters result: ', result)

    if (this.current().k === 'COMMA') {
      this.next()
      const filtersResult = this.parseFilters()
      return deepMerge(result, filtersResult)
    }

    return result
  },

  parseFilter: function () {
    //console.log('CURRENT, parseFilter', this.current())
    // Store here to do a backtracking in case of error
    const current = this.currentPos()

    try {
      return this.parseObject()
    } catch (e) {
      this.backTrack(current)
      return this.parseFieldPath()
    }
  },

  parseObject: function () {
    //console.log('CURRENT, parseObject', this.current())
    const result = this.parseFieldPath()

    if (this.current().k === 'POPEN') {
      this.next()
      const filtersResult = this.parseFilters()

      // We need to set it to last position of our tree
      const addToResult = (resultItem) => {
        const key = Object.keys(resultItem)[0]
        if (Object.keys(resultItem[key]).length === 0) {
          resultItem[key] = filtersResult
          return
        }

        addToResult(resultItem[key])
      }

      addToResult(result)

      if (this.current().k === 'PCLOSE') {
        this.next()
        return result
      }

      this.raiseError()
    }

    this.raiseError()
  },

  parseFieldPath: function () {
    //console.log('CURRENT, parseFieldPath', this.current())
    if (this.current().k === 'FIELD') {
      const key = this.current().v
      const result = {
        [key]: {}
      }

      this.next()

      if (this.current().k === 'SLASH') {
        this.next()

        result[key] = this.parseFieldPath()
      }

      return result
    }

    this.raiseError()
  },

  raiseError: function () {
    throw Error('Unexpected token ' + this.current().k + ' with value "' + this.current().v  + '" at position ' + this.current().startIndex)
  }
}

function parse (val) {
  const p = Object.create(parser)
  p.tokens = tokenizer(val)
  return p.parse()
}

module.exports = parse
