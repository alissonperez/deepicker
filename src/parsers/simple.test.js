const simpleParser = require('./simple')

test('simple parsing "a.b.c"', () => {
  const expected = {
    'a': {
      'b': {
        'c': {}
      }
    }
  }

  const val = 'a.b.c'
  expect(simpleParser(val)).toEqual(expected)
})

test('simple parsing with "a.b.c,a.f,d.e.f"', () => {
  const expected = {
    'a': {
      'b': {
        'c': {}
      },
      'f': {}
    },
    'd': {
      'e': {
        'f': {}
      }
    }
  }

  const val = 'a.b.c,a.f,d.e.f'
  expect(simpleParser(val)).toEqual(expected)
})

test('parsing with *', () => {
  const expected = {
    'a': {
      '*': {
        'c': {}
      }
    }
  }

  const val = 'a.*.c'
  expect(simpleParser(val)).toEqual(expected)
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

  const val = 'a.*.x,a.b.c,a.d.f.g'

  expect(simpleParser(val)).toEqual(expected)
})
