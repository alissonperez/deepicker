[![CircleCI](https://circleci.com/gh/alissonperez/deepicker.svg?style=svg)](https://circleci.com/gh/alissonperez/deepicker)

Deepicker
=============

A tiny library inspired in GraphQL but much **more simple without buracratic things and large libraries** for clients and servers!

Features:

- Simple implementation.
- Non-blocking processing.
- Simple usage by clients. Just receive an `include` and `exclude` querystring bypass it to library.

### Installation

```bash
$ npm i --save deepicker
```

or, if you prefer `yarn`:

```bash
$ yarn add deepicker
```

### Usage

Let's see a very simple example to warmup:

```javascript
const deepicker = require('deepicker')

// My object with a simple structure (for now!)
const myObject = {
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    episodeNumber: '5',
    releaseYear: 1983,
    characters: [
        { name: 'Luke Skywalker', actor: 'Mark Hamill' },
        { name: 'Han Solo', actor: 'Harrison Ford' },
        { name: 'Princess Leia Organa', actor: 'Carrie Fischer' },
        { name: 'Darth Vader', actor: 'James Earl Jones' },
        // ...
    ],
    description: 'Fleeing the evil Galactic Empire, the Rebels abandon...',
}

// Include/exclude string, you can receive then in a request querystring, for example
const include = 'title,description,characters'
const exclude = 'characters.actor'

// Create our picker object
const picker = deepicker.simplePicker(include, exclude)

// Let's process our object, picker will pick only especified fields deeply.
console.log(picker.pick(myObject))
```

As a result:

```json
{
    "title":"Star Wars: Episode V - The Empire Strikes Back",
    "description":"Fleeing the evil Galactic Empire, the Rebels abandon...",
    "characters":[
        { "name":"Luke Skywalker" },
        { "name":"Han Solo" },
        { "name":"Princess Leia Organa" },
        { "name":"Darth Vader" }
    ]
}
```

Deepicker handle a lot of data types inside your objects, like functions, arrays, promises, etc..).
