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

  test('should filter arrays with exclude', () => {
    const val = {
      foo: {
        myArray: [
          {bar: 1, baz: 2},
          {bar: 3, baz: 4},
          {bar: 5, baz: 6},
        ]
      }
    }

    const excTree = {
      foo: {
        myArray: {
          baz: {}
        }
      }
    }

    const expected = {
      foo: {
        myArray: [
          {bar: 1},
          {bar: 3},
          {bar: 5},
        ]
      }
    }

    expect(picker({}, excTree).pick(val)).toEqual(expected)
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

  test('picker with * field in include fields', () => {
    const val = {
      foo: {
        test1: {
          val: 'test',
          val2: 'test2'
        },
        test2: {
          val: 'test',
          val2: 'test2'
        }
      }
    }

    const expected = {
      foo: {
        test1: {
          val2: 'test2'
        },
        test2: {
          val2: 'test2'
        }
      }
    }

    const incTree = {
      foo: {
        '*': {
          'val2': {}
        }
      }
    }

    expect(picker(incTree).pick(val)).toEqual(expected)
  })

  test('picker with * field in exclude fields', () => {
    const val = {
      foo: {
        test1: {
          val: 'test',
          val2: 'test2'
        },
        test2: {
          val: 'test',
          val2: 'test2'
        }
      }
    }

    const expected = {
      foo: {
        test1: {
          val2: 'test2'
        },
        test2: {
          val2: 'test2'
        }
      }
    }

    const excTree = {
      foo: {
        '*': {
          'val': {}
        }
      }
    }

    expect(picker({}, excTree).pick(val)).toEqual(expected)
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

  test('should resolve a function pick method', () => {
    const val = {
      foo: function (picker) {
        return picker.pick({
          bar: 'baz',
          other: 'value'
        })
      }
    }

    const incTree = {
      foo: {
        bar: {}
      }
    }

    const expected = {
      foo: {
        bar: 'baz'
      }
    }

    return picker(incTree).pickPromise(val).then(result => {
      return expect(result).toEqual(expected)
    })
  })

  test('should resolve an array of promises', () => {
    const val = {
      foo: [
        Promise.resolve({
          bar: 'baz',
          other: 'value'
        }),
        Promise.resolve({
          bar: 'other baz',
          other: 'value'
        })
      ]
    }

    const incTree = {
      foo: {
        bar: {}
      }
    }

    const expected = {
      foo: [
        {bar: 'baz'},
        {bar: 'other baz'},
      ]
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

  test('should return true if include has "*" wildcard', () => {
    const incTree = {
      foo: {},
      '*': {}
    }

    expect(picker(incTree).include('other')).toBe(true)
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

  test('should return false if exclude has "*" wildcard', () => {
    const incTree = {
      foo: {}
    }

    const excTree = {
      '*': {}
    }

    expect(picker(incTree, excTree).include('other')).toBe(false)
  })

  test('should return true if include has exact key and exclude has "*" wildcard', () => {
    const incTree = {
      foo: {}
    }

    const excTree = {
      '*': {}
    }

    expect(picker(incTree, excTree).include('foo')).toBe(true)
  })

  test('should return true if both inc and exc tree is undefined', () => {
    expect(picker().include('foo')).toBe(true)
  })

  test('should return true if both inc and exc is empty', () => {
    expect(picker({}, {}).include('foo')).toBe(true)
  })
})

describe('#pickStatic', () => {
  test('should return same json', () => {
    const val = {
      foo: {
        bar: 3
      },
      other: {
        foo: 'bar'
      }
    }

    expect(picker().pickStatic(val)).toEqual(val)
  })

  test('should return json filtered', () => {
    const val = {
      foo: {
        bar: 3
      },
      other: {
        foo: 'bar'
      }
    }

    const incTree = {
      foo: {},
    }

    const expected = {
      foo: {
        bar: 3
      }
    }

    expect(picker(incTree).pickStatic(val)).toEqual(expected)
  })

  test('should handle arrays', () => {
    const val = {
      foo: [
        {bar: 'baz', other: 'value'},
        {bar: 'baz', other: 'value'},
        {bar: 'baz', other: 'value'}
      ],
      other: {
        foo: 'bar'
      }
    }

    const incTree = {
      foo: {
        bar: {}
      }
    }

    const expected = {
      foo: [
        {bar: 'baz'},
        {bar: 'baz'},
        {bar: 'baz'}
      ]
    }

    expect(picker(incTree).pickStatic(val)).toEqual(expected)
  })

  test('should exclude some fields', () => {
    const val = {
      foo: {
        bar: 3,
        other: 'value'
      },
      other: {
        foo: 'bar'
      }
    }

    const incTree = {
      foo: {},
      other: {}
    }

    const excTree = {
      foo: {
        other: {}
      }
    }

    const expected = {
      foo: {
        bar: 3,
      },
      other: {
        foo: 'bar'
      }
    }

    expect(picker(incTree, excTree).pickStatic(val)).toEqual(expected)
  })

  test('should handle "*" wild card in include tree', () => {
    const val = {
      foo: {
        bar: {
          baz: 'foo 1',
          toBeRemoved: 'a value'
        },
        other: {
          baz: 'foo 2',
          otherKey: 'with value'
        }
      },
      other: {
        myKey: 'foo'
      }
    }

    const incTree = {
      foo: {
        '*': {
          baz: {}
        }
      }
    }

    const expected = {
      foo: {
        bar: {
          baz: 'foo 1'
        },
        other: {
          baz: 'foo 2'
        }
      }
    }

    expect(picker(incTree).pickStatic(val)).toEqual(expected)
  })

  test('should handle "*" wild card in exclude tree', () => {
    const val = {
      foo: {
        bar: {
          baz: 'foo 1',
          toBeRemoved: 'a value'
        },
        other: {
          baz: 'foo 2',
          otherKey: 'with value'
        }
      },
      other: {
        myKey: 'foo'
      }
    }

    const excTree = {
      foo: {
        '*': {
          baz: {}
        }
      }
    }

    const expected = {
      foo: {
        bar: {
          toBeRemoved: 'a value'
        },
        other: {
          otherKey: 'with value'
        }
      },
      other: {
        myKey: 'foo'
      }
    }

    expect(picker({}, excTree).pickStatic(val)).toEqual(expected)
  })
})

describe('#toContext', () => {
  test('move to context tree', () => {
    const incTree = {
      foo: {
        bar: {
          baz: {},
          other: {
            key: {}
          }
        }
      }
    }

    const excTree = {
      foo: {
        bar: {
          other: {
            key: {}
          }
        }
      }
    }

    const localPicker = picker(incTree, excTree).toContext('foo', 'bar')

    expect(localPicker.incTree).toEqual(incTree.foo.bar)
    expect(localPicker.excTree).toEqual(excTree.foo.bar)
  })

  test('move to context should handle empty trees', () => {
    const localPicker = picker().toContext('foo', 'bar')

    expect(localPicker.incTree).toEqual({})
    expect(localPicker.excTree).toEqual({})
  })

  test('move context should move through "*" wildcard', () => {
    const incTree = {
      foo: {
        '*': {
          baz: {},
          other: {
            key: {}
          }
        },
        other: {
          foo: {}
        }
      }
    }

    const excTree = {
      foo: {
        '*': {
          other: {
            key: {}
          }
        }
      }
    }

    const localPicker = picker(incTree, excTree).toContext('foo', 'bar')

    expect(localPicker.incTree).toEqual(incTree.foo['*'])
    expect(localPicker.excTree).toEqual(excTree.foo['*'])
  })
})
