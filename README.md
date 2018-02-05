[![CircleCI](https://circleci.com/gh/alissonperez/deepicker.svg?style=svg)](https://circleci.com/gh/alissonperez/deepicker)

Deepicker
=============

A deep picker to resolve JS complex Objects (with mixed functions, promises, arrays, etc..).

### Usage

#### Simple example:

```javascript
const deepicker = require('deepicker')

const myObject = {
  foo: 'bar',
  bar: {
    baz: 'test',
    foo: {
      other: 'value',
      otherInt: 10
    }
  }
}

// Include/exclude string
const include = 'foo,bar'
const exclude = 'bar.foo.other,bar.baz'

const picker = deepicker.simplePicker(include, exclude)

console.log(picker.pick(myObject))

// out:

// {
//   foo: 'bar',
//   bar: {
//     foo: {
//       otherInt: 10
//     }
//   }
// }
```

### A more complex example

Here we'll resolve a function in our object and items of an array.

```javascript
const deepicker = require('deepicker')

const myObject = {
  // Function receive a picker with a proper context
  withFunc: function (picker) {
    return picker.pick({
      myValue: 'foo',
      otherValue: 'bar'
    })
  },
  bar: {
    baz: 'test',
    // It resolves array itens too
    fooArray: [
      {
        other: 'value 0',
        otherInt: 10
      },
      {
        other: 'value 1',
        otherInt: 10
      },
    ]
  }
}

// Include/exclude string
const include = 'withFunc.myValue,bar'
const exclude = 'bar.fooArray.other'

const picker = deepicker.simplePicker(include, exclude)

console.log(picker.pick(myObject))

// out:

// {
//     withFunc: {
//         myValue: "foo"
//     },
//     bar: {
//         baz: "test",
//         fooArray: [
//             {
//                 otherInt: 10
//             },
//             {
//                 otherInt: 10
//             }
//         ]
//     }
// }

```
