const picker = require('./picker')

describe('#pick', () => {
  const defaultIncTree = {
    foo: {
      bar: {}
    }
  }

  test('should return all object if trees are empty', () => {
    const val = {
      foo: {
        bar: 3
      },
      other: {
        foo: 'bar'
      }
    }

    expect(picker().pick(val)).toEqual(val)
    expect(picker({}, {}).pick(val)).toEqual(val)
  })

  test('should filter simple objects', () => {
    const val = {
      foo: {
        baz: 2,
        bar: 3,
        test: {
          val: 'test'
        }
      },
      other: {
        foo: 'bar'
      }
    }

    const expected = {
      foo: {
        bar: 3
      }
    }

    expect(picker(defaultIncTree).pick(val)).toEqual(expected)
  })

  test('should filter arrays', () => {
    const val = {
      foo: [
        {bar: 1, baz: 2},
        {bar: 3, baz: 4},
        {bar: 5, baz: 6},
      ]
    }

    const expected = {
      foo: [
        {bar: 1},
        {bar: 3},
        {bar: 5},
      ]
    }

    expect(picker(defaultIncTree).pick(val)).toEqual(expected)
  })

  test('should call functions with expected context', () => {
    const val = {
      foo: function (picker) {
        return picker.pick({
          bar: 1,
          baz: 2
        })
      },
      other: 'test'
    }

    const expected = {
      foo: {
        bar: 1
      }
    }

    expect(picker(defaultIncTree).pick(val)).toEqual(expected)
  })

  test('should not return items in exclude tree', () => {
    const val = {
      foo: {
        baz: 2,
        bar: 3,
        test: {
          val: 'test'
        }
      },
      other: {
        foo: 'bar'
      }
    }

    const expected = {
      foo: {
        baz: 2,
        bar: 3,
        test: {
          val: 'test'
        }
      },
      other: {}
    }

    const excTree = {
      other: {
        foo: {}
      }
    }

    expect(picker({}, excTree).pick(val)).toEqual(expected)
  })

  test('should return keys mixed between include and exclude', () => {
    const val = {
      foo: {
        baz: 2,
        bar: 3,
        test: {
          val: 'test'
        }
      },
      other: {
        foo: 'bar',
        test: 'foo'
      }
    }

    const incTree = {
      foo: {
        bar: {}
      },
      other: {}
    }

    const excTree = {
      other: {
        foo: {}
      }
    }

    const expected = {
      foo: {
        bar: 3
      },
      other: {
        test: 'foo'
      }
    }

    expect(picker(incTree, excTree).pick(val)).toEqual(expected)
  })

  test('should resolve a complex object', () => {
    const val = {
      foo: 'bar',
      aNumber: 1,
      test: {
        foo: 'baz'
      },
      other: function (picker) {
        return picker.pick({
          foo: function (picker) {
            return picker.pick({
              test: 'foo',
              toExclude: 'bar'
            })
          }
        })
      },
      aSimpleArray: [1, 2, 3, 4],
      anArrayWithObject: [
        {bar: 'baz', foo: 'bar'},
        {bar: 'baz', foo: 'bar'},
        {bar: 'baz', foo: 'bar'},
      ],
    }

    const incTree = {
      foo: {},
      aNumber: {},
      test: {},
      other: {},
      aSimpleArray: {},
      anArrayWithObject: {},
    }

    const excTree = {
      other: {
        foo: {
          toExclude: {}
        }
      }
    }

    const expected = {
      foo: 'bar',
      aNumber: 1,
      test: {
        foo: 'baz'
      },
      other: {
        foo: {
          test: 'foo'
        }
      },
      aSimpleArray: [1, 2, 3, 4],
      anArrayWithObject: [
        {bar: 'baz', foo: 'bar'},
        {bar: 'baz', foo: 'bar'},
        {bar: 'baz', foo: 'bar'},
      ],
    }

    expect(picker(incTree, excTree).pick(val)).toEqual(expected)
  })
})

describe('#pickPromise', () => {
  test('should resolve a simple object with promise', () => {
    const val = {
      foo: 'bar',
      myPromise: Promise.resolve('solved')
    }

    const incTree = {
      foo: {},
      myPromise: {}
    }

    const expected = {
      foo: 'bar',
      myPromise: 'solved'
    }

    return picker(incTree).pickPromise(val).then(result => {
      return expect(result).toEqual(expected)
    })
  })

  test('should solve multiple promises', () => {
    const val = {
      foo: 'bar',
      myPromise: Promise.resolve('solved'),
      myOtherLazyFunc: Promise.resolve('solved again')
    }

    const incTree = {
      foo: {},
      myPromise: {},
      myOtherLazyFunc: {}
    }

    const expected = {
      foo: 'bar',
      myPromise: 'solved',
      myOtherLazyFunc: 'solved again'
    }

    return picker(incTree).pickPromise(val).then(result => {
      return expect(result).toEqual(expected)
    })
  })

  test('should resolve a promise inside a function', () => {
    const val = {
      foo: 'bar',
      myPromise: function() {
        return Promise.resolve('solved')
      }
    }

    const incTree = {
      foo: {},
      myPromise: {}
    }

    const expected = {
      foo: 'bar',
      myPromise: 'solved'
    }

    return picker(incTree).pickPromise(val).then(result => {
      return expect(result).toEqual(expected)
    })
  })
})

describe('#include', () => {
  test('should return true if key is included', () => {
    const incTree = {
      foo: {},
      myPromise: {}
    }

    expect(picker(incTree).include('foo')).toBe(true)
  })

  test('should return false if key is in exclude', () => {
    const incTree = {
      foo: {},
      myPromise: {}
    }

    const excTree = {
      foo: {}
    }

    expect(picker(incTree, excTree).include('foo')).toBe(false)
  })

  test('should return true if both inc and exc tree is undefined', () => {
    expect(picker().include('foo')).toBe(true)
  })

  test('should return true if both inc and exc is empty', () => {
    expect(picker({}, {}).include('foo')).toBe(true)
  })
})
