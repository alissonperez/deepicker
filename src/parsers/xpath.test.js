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

test('parsing val with * must merge its subtree in other trees', () => {
  // This is an optimization one of keys in the same level is * we can merge it all
  // in the sub tree of *

  const expected = {
    a: {
      '*': {
        x: {},
      },
      b: {
        x: {},  // this must come from '*' neighbor
        c: {}
      },
      d: {
        x: {},  // this must come from '*' neighbor
        f: {
          g: {}
        }
      },
    }
  }

  const val = 'a/*/x,a/b/c,a/d/f/g'

  expect(xPathParser(val)).toEqual(expected)
})
