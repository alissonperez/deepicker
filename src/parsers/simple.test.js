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
