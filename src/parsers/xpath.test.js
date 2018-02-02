const xPathParser = require('./xpath')

test('simple parsing "a/b/c"', () => {
  const expected = {
    'a': {
      'b': {
        'c': {}
      }
    }
  }

  const val = 'a/b/c'
  expect(xPathParser(val)).toEqual(expected)
})

test('parsing complex "a,b(c/d,e/f)', () => {
  const expected = {
    'a': {},
    'b': {
      'c': {
        'd': {}
      },
      'e': {
        'f': {}
      }
    }
  }

  const val = 'a,b(c/d,e/f)'
  expect(xPathParser(val)).toEqual(expected)
})

test('parsing val that needs a deep merge', () => {
  const expected = {
    'a': {
      'b': {},
      'c': {},
      'd': {},
      'f': {},
    }
  }

  const val = 'a(b,c),a(d,f)'
  expect(xPathParser(val)).toEqual(expected)
})
