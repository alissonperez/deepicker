const deepicker = require('./index')

const testVal = {
  foo: 'bar',
  bar: {
    baz: 'test',
    foo: {
      other: 'value',
      otherInt: 10
    }
  }
}

describe('#picker', () => {
  test('should return raw picker', () => {
    const incTree = {
      bar: {}
    }

    const excTree = {
      bar: {
        foo: {}
      }
    }

    const expected = {
      bar: {
        baz: 'test'
      }
    }

    expect(deepicker.picker(incTree, excTree).pick(testVal)).toEqual(expected)
  })
})

describe('#xpathPicker', () => {
  test('should use an xpath inc and exc string', () => {
    const include = 'bar/foo(other,otherInt),foo', exclude = 'bar/foo/otherInt'
    const expected = {
      foo: 'bar',
      bar: {
        foo: {
          other: 'value'
        }
      }
    }

    expect(deepicker.xpathPicker(include, exclude).pick(testVal)).toEqual(expected)
  })
})

describe('#simplePicker', () => {
  test('should use a simple inc and exc string', () => {
    const include = 'bar,foo', exclude = 'bar.foo.otherInt,bar.baz'
    const expected = {
      foo: 'bar',
      bar: {
        foo: {
          other: 'value'
        }
      }
    }

    expect(deepicker.simplePicker(include, exclude).pick(testVal)).toEqual(expected)
  })
})
