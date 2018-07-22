[![CircleCI](https://circleci.com/gh/alissonperez/deepicker.svg?style=svg)](https://circleci.com/gh/alissonperez/deepicker)

Deepicker
=============

A tiny library inspired in GraphQL but much **more simple without buracratic things and large libraries** for clients and servers!

Features:

- Simple implementation.
- Increases performance processing only what client asks for.
- Non-blocking processing, it handles promisses in parallel very well.
- Simple usage by clients. Just receive an `include` and `exclude` querystring and send them to Deepicker.
- No worries about dependencies, Deepicker is pure JS implementation.

### Installation

```bash
$ npm i --save deepicker
```

or, if you prefer `yarn`:

```bash
$ yarn add deepicker
```

### Usage

#### Quickstart example

Let's see a very simple example to warmup:

```javascript
const deepicker = require('deepicker')

// My object with a simple structure (for now!)
const myObject = {
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    episodeNumber: '5',
    releaseYear: 1980,
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


#### Using nested functions

But we know, unfortunatelly, real life "usually" is not so simple. Thinking about it, Deepicker is able to handle a lot of data types inside our objects, like arrays, promises, functions... etc. And with this last data type is where Deepicker really shines and show its power! =)

Let's see a more complex example using functions:

```javascript
const deepicker = require('deepicker')

const myObject = {
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    description: 'Fleeing the evil Galactic Empire, the Rebels abandon...',
    releaseYear: 1980,

    // Here, using a function to computate our 'nextMovie' key content (pay attention to "picker" arg)
    nextMovie: function(picker) {
        const movie = {
            title: 'Star Wars: Episode IV - A New Hope)',
            description: 'The galaxy is in the midst of a civil war. Spies for the Rebel Alliance have stolen plans...',
            releaseYear: 1977
        }

        // Pay attention here, picker instance is with 'nextMovie' context,
        // so, when we call "pick" method it knows exactly what needs to cut out
        // or not.
        return picker.pick(movie)
    },

    previousMovie: function(picker) {
        const movie = {
            title: 'Star Wars: Episode VI - Return of the Jedi',
            description: 'The Galactic Empire, under the direction of the ruthless Emperor...',
            releaseYear: 1983
        }

        return picker.pick(movie)
    }
}

// Now, we add "nextMovie" in our include fields and exclude "releaseYear" from "nextMovie".
const include = 'title,description,nextMovie'
const exclude = 'nextMovie.releaseYear'

// Create our picker object
const picker = deepicker.simplePicker(include, exclude)

// Let's pick!
console.log(picker.pick(myObject))
```

And we have the following as result:

```json
{
    "title":"Star Wars: Episode V - The Empire Strikes Back",
    "description":"Fleeing the evil Galactic Empire, the Rebels abandon...",
    "nextMovie":{
        "title":"Star Wars: Episode IV - A New Hope)",
        "description":"The galaxy is in the midst of a civil war. Spies for the Rebel Alliance have stolen plans..."
    }
}
```

Ok, what happened?!

First of all, we didn't ask for "previousMovie", so deepicker don't evaluate this function. In this example this don't affect performance, but thinking about an operation like access to a database to get something or call some API this can increase performance significantly. The main gain here is **we process only what client asks for**.

Other thing, pay attention to `picker` arg received in our functions. This picker instance is with correct context, in this example, with `releaseYear` in exclude option. This is very important to pick content inside these functions and, as you can imagine, we can the same `pick` operation nested:


```javascript
nextMovie: function(picker) {
    const movie = {
        title: 'Star Wars: Episode IV - A New Hope)',
        description: 'The galaxy is in the midst of a civil war. Spies for the Rebel Alliance have stolen plans...',
        releaseYear: 1977,

        // Using a function to compute otherInfo about Episode IV
        otherInfo: function(picker) {
            // Perform somethig here to get movie info and return then

            return picker.pick({
                directedBy: "George Lucas",
                producedBy: "Gary Kurtz",
                writtenBy: "George Lucas"
            })
        }
    }

    return picker.pick(movie)
},
```

In this example, we can use `nextMovie.otherInfo.directedBy` in our `include` option to get only "George Lucas" name and exclude the other info. Or, `otherInfo` function even is called with `include` only with `nextMovie.releaseYear`.

#### Using promises

All we know that using JS is use asyncronous code, a library in node with no support for that is useless. So, Deepicker has a very good support to use Promises, lets take a look in an example:

```javascript
const deepicker = require('deepicker')

const myObject = {
    // First, we can have promises direct associated with our keys
    // Deepicker will "resolve" it for us
    title: Promise.resolve('Star Wars: Episode V - The Empire Strikes Back'),

    description: 'Fleeing the evil Galactic Empire, the Rebels abandon...',
    releaseYear: 1980,

    // Our function to calculate next movie
    nextMovie: function(picker) {
        // Let's think we need to get next movie from an API, so we'll need an asyncronous request
        return new Promise((resolve, reject) => {
            // ... calling some API here

            const movie = {
                title: 'Star Wars: Episode IV - A New Hope)',
                description: 'The galaxy is in the midst of a civil war. Spies for the Rebel Alliance have stolen plans...',
                releaseYear: 1977
            }

            resolve(picker.pick(movie))
        })
    },

    // Our function to calculate previous movie
    previousMovie: function(picker) {
        // Let's think we need to get next movie from an API, so we'll need an asyncronous request
        return new Promise((resolve, reject) => {
            // ... calling some API here

            const movie = {
                title: 'Star Wars: Episode VI - Return of the Jedi',
                description: 'The Galactic Empire, under the direction of the ruthless Emperor...',
                releaseYear: 1983
            }

            resolve(picker.pick(movie))
        })
    }
}

// Our include / exclude as usually
const include = 'title,description,nextMovie'
const exclude = 'nextMovie.releaseYear'

const picker = deepicker.simplePicker(include, exclude)

// To handle with promises in our object, we need to use 'pickPromise' method
picker.pickPromise(myObject).then(result => {
    console.log(result)
})
```

As result:

```
{
    "title":"Star Wars: Episode V - The Empire Strikes Back",
    "description":"Fleeing the evil Galactic Empire, the Rebels abandon...",
    "nextMovie":{
        "title":"Star Wars: Episode IV - A New Hope)",
        "description":"The galaxy is in the midst of a civil war. Spies for the Rebel Alliance have stolen plans..."
    }
}
```
