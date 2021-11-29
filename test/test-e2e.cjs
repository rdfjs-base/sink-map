const assert = require('assert')
const { describe, it, before } = require('mocha')
const stringToStream = require('string-to-stream')
const Parser = require('@rdfjs/parser-n3')
const Serializer = require('@rdfjs/serializer-ntriples')

describe('sink-map', () => {
  let SinkMap

  before(async () => {
    SinkMap = (await import('../index.js')).SinkMap
  })

  it('successfully round-trips dataset with lazy sinks', async () => {
    // given
    const input = '<http://example.com/foo> <http://example.com/bar> <http://example.com/baz> .\n'
    const parsers = new SinkMap()
    parsers.set('text/turtle', () => new Parser())
    const serializers = new SinkMap()
    serializers.set('application/n-triples', new Serializer())

    // when
    const importStream = parsers.import('text/turtle', stringToStream(input))
    const outputStream = serializers.import('application/n-triples', importStream)
    let output = ''

    // then
    await new Promise((resolve, reject) => {
      outputStream.on('data', chunk => output += chunk)
      outputStream.on('end', resolve)
      outputStream.on('error', reject)
    })
    assert.strictEqual(output, input)
  })

  it('does not swallow parsing errors', async () => {
    // given
    let errorCaught = false
    const input = '<http://example.com/foo> <http://example.com/bar> <http://example.com/baz>'
    const parsers = new SinkMap()
    parsers.set('text/turtle', () => new Parser())

    // when
    const importStream = parsers.import('text/turtle', stringToStream(input))

    // then
    await new Promise((resolve, reject) => {
      importStream.on('data', () => {})
      importStream.on('end', () => resolve())
      importStream.on('error', () => {
        errorCaught = true
        resolve()
      })
    })
    assert(errorCaught)
  })

  it('forwards prefix events', (done) => {
    // given
    let errorCaught = false
    const input = '@prefix ex: <http://example.com/> . ex:foo ex:bar ex:baz .'
    const parsers = new SinkMap()
    parsers.set('text/turtle', () => new Parser())

    // when
    const importStream = parsers.import('text/turtle', stringToStream(input))

    // then
    importStream.on('prefix', (prefix, ns) => {
      assert.strictEqual(prefix, 'ex')
      assert.strictEqual(ns.value, 'http://example.com/')
      done()
    })
  })
})
