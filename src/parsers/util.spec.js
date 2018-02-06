const util = require('./util')

describe('#performMerge', () => {
  test('should merge simple objects', () => {
    const a = {
      foo: {},
      bar: {}
    }

    const b = {
      other: {},
      testing: {}
    }

    util.performMerge(a, b)

    const expected = {
      foo: {},
      bar: {},
      other: {},
      testing: {}
    }

    expect(a).toEqual(expected)
  })

  test('should merge deeply objects', () => {
    const a = {
      foo: {
        bar: {
          baz: {}
        }
      },
      bar: {}
    }

    const b = {
      foo: {
        other: {
          value: {}
        }
      }
    }

    util.performMerge(a, b)

    const expected = {
      foo: {
        bar: {
          baz: {}
        },
        other: {
          value: {}
        }
      },
      bar: {}
    }

    expect(a).toEqual(expected)
  })

  test('should "update" key with * key if its exists in the first', () => {
    const a = {
      foo: {
        bar: {}
      },
      '*': {
        testing: {}
      }
    }

    const b = {
      foo: {
        other: {}
      }
    }

    util.performMerge(a, b)

    const expected = {
      foo: {
        bar: {},
        other: {},
        testing: {}
      },
      '*': {
        testing: {}
      }
    }

    expect(a).toEqual(expected)
  })

  test('should "update" key with * key if its exists in the second', () => {
    const a = {
      foo: {
        bar: {}
      }
    }

    const b = {
      foo: {
        other: {}
      },
      '*': {
        testing: {}
      }
    }

    util.performMerge(a, b)

    const expected = {
      foo: {
        bar: {},
        other: {},
        testing: {}
      },
      '*': {
        testing: {}
      }
    }

    expect(a).toEqual(expected)
  })
})
