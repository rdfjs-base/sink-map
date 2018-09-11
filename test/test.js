/* global describe, it */

const assert = require('assert')
const SinkMap = require('..')

describe('sink-map', () => {
  describe('constructor', () => {
    it('should create a empty map', () => {
      const map = new SinkMap()

      assert.deepStrictEqual(Object.keys(map).filter(key => map.hasOwnProperty(key)), [])
    })

    it('should import the key/value pairs from a plain object', () => {
      const jsonld = {}
      const turtle = {}

      const other = {
        'application/ld+json': jsonld,
        'text/turtle': turtle
      }

      const map = new SinkMap(other)

      assert.strictEqual(map['application/ld+json'], jsonld)
      assert.strictEqual(map['text/turtle'], turtle)
    })

    it('should import the key/value pairs from another SinkMap', () => {
      const jsonld = {}
      const turtle = {}

      const other = new SinkMap()

      other['application/ld+json'] = jsonld
      other['text/turtle'] = turtle

      const map = new SinkMap(other)

      assert.strictEqual(map['application/ld+json'], jsonld)
      assert.strictEqual(map['text/turtle'], turtle)
    })
  })

  describe('.find', () => {
    it('should be a method', () => {
      const map = new SinkMap()

      assert.strictEqual(typeof map.find, 'function')
    })

    it('should return undefined if no matching sink was found', () => {
      const map = new SinkMap()

      assert.strictEqual(map.find('image/jpeg'), undefined)
    })

    it('should return undefined if a class method name is given', () => {
      const map = new SinkMap()

      assert.strictEqual(map.find('find'), undefined)
    })

    it('should return the sink for the given key', () => {
      const jsonld = {}
      const turtle = {}

      const map = new SinkMap({
        'application/ld+json': jsonld,
        'text/turtle': turtle
      })

      assert.strictEqual(map.find('text/turtle'), turtle)
    })
  })

  describe('.import', () => {
    it('should be a method', () => {
      const map = new SinkMap()

      assert.strictEqual(typeof map.import, 'function')
    })

    it('should return null if no matching sink was found', () => {
      const map = new SinkMap()

      assert.strictEqual(map.import('image/jpeg'), null)
    })

    it('should call the import method of the sink', () => {
      let touched = false

      const jsonld = {}
      const turtle = {
        import: () => {
          touched = true
        }
      }

      const map = new SinkMap({
        'application/ld+json': jsonld,
        'text/turtle': turtle
      })

      map.import('text/turtle')

      assert(touched)
    })

    it('should forward the input parameter', () => {
      let actualInput

      const jsonld = {}
      const turtle = {
        import: (input) => {
          actualInput = input
        }
      }

      const map = new SinkMap({
        'application/ld+json': jsonld,
        'text/turtle': turtle
      })

      map.import('text/turtle', 'test')

      assert.strictEqual(actualInput, 'test')
    })

    it('should forward the input parameter', () => {
      let actualOptions

      const jsonld = {}
      const turtle = {
        import: (input, options) => {
          actualOptions = options
        }
      }

      const map = new SinkMap({
        'application/ld+json': jsonld,
        'text/turtle': turtle
      })

      map.import('text/turtle', null, 'test')

      assert.strictEqual(actualOptions, 'test')
    })

    it('should return the result of the sink import method call', () => {
      const jsonld = {}
      const turtle = {
        import: () => {
          return 'test'
        }
      }

      const map = new SinkMap({
        'application/ld+json': jsonld,
        'text/turtle': turtle
      })

      assert.strictEqual(map.import('text/turtle'), 'test')
    })
  })

  describe('.list', () => {
    it('should be a method', () => {
      const map = new SinkMap()

      assert.strictEqual(typeof map.list, 'function')
    })

    it('should return an array', () => {
      const map = new SinkMap()

      assert(Array.isArray(map.list()))
    })

    it('should return the keys of the sinks', () => {
      const map = new SinkMap({
        'application/ld+json': {},
        'text/turtle': {}
      })

      assert.deepStrictEqual(map.list(), ['application/ld+json', 'text/turtle'])
    })
  })
})
