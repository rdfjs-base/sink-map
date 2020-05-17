# @rdf-esm/sink-map

![](https://github.com/rdf-esm/sink-map/workflows/Test/badge.svg)

[![npm version](https://img.shields.io/npm/v/@rdf-esm/sink-map.svg)](https://www.npmjs.com/package/@rdf-esm/sink-map)

Map for [RDFJS Sinks](http://rdf.js.org/#sink-interface) including shortcut methods.

## Fork alert :exclamation:

This package is an ES Modules fork of [@rdfjs/sink-map](https://npm.im/@rdfjs/sink-map)

It also adds the ability to register lazy sinks, which are created on first request. For example to have the respecitve modules imported dynamically. Check the example below.

## Usage

The package provides Map from a string key to a Sink with a shortcut for `.import`.
Typical it's used to store parsers or serializers for specific media types.
As SinkMap extends from the [ECMAScript 2015 Map](https://www.ecma-international.org/ecma-262/6.0/#sec-map-objects) and doesn't overload any standard methods, methods like `set`, `get`, `has` or `delete` can be used as defined in the specification.

### Create a SinkMap
The constructor accepts arrays with key/sink pairs to fill the map:

```javascript
const map = new SinkMap([
  ['text/turtle', new ParserN3()]
])
```

It's also possible to create an empty map and add or extend it later using the `.set()` method:

```javascript
const map = new SinkMap()

map.set('text/turtle') = new ParserN3()
```

### Add a lazy-loaded sink

Sinks can also be added as an async function, for example to dynamically import the module.

Here's an example from [@rdf-esm/formats-common](https://github.com/rdf-esm/formats-common/blob/master/parsers.js):

```javascript
const map = new SinkMap()

map.set('text/turtle', async () => {
  const ParserN3 = (await import('@rdfjs/parser-n3')).default
  return new ParserN3()
})
```

### Find a Sink

The `.get` method searches for the matching Sink and returns it:

```javascript
const map = new SinkMap([...])

const sink = map.get('text/turtle')

if (sink) {
  // found
} else {
  // not found
}
```

### Import shortcut

Usually you want to call the `.import` method of the matching Sink.
The map provides a shortcut for this.
It also has a `.import` method, but requires additionally the key as the first argument.
It returns `null` if no matching sink was found:

```javascript
const map = new SinkMap([...])

const input = fs.createReadStream('..')
const output = map.import('text/turtle', input)

if (output) {
  // found
} else {
  // not found
}
```

### Example

Here is a complete example where the map is used to store parsers and the `.import` shortcut is used to parse a string input:

```javascript
import { SinkMap } from '@rdfjs/sink-map'
import ParserN3 from '@rdfjs/parser-n3'
import stream from 'stream'

const map = new SinkMap([
  ['text/turtle', new ParserN3()]
])

const input = new stream.Readable({
  read: () => {
    input.push(`
      PREFIX s: <http://schema.org/>

      [] a s:Person ;
        s:jobTitle "Professor" ;
        s:name "Jane Doe" ;
        s:telephone "(425) 123-4567" ;
        s:url <http://www.janedoe.com> .
    `)
    input.push(null)
  }
})

const output = map.import('text/turtle', input)

output.on('data', quad => {
  console.log(`${quad.subject.value} - ${quad.predicate.value} - ${quad.object.value}`)
})
```
