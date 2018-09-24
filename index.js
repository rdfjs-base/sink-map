class SinkMap extends Map {
  constructor (map = {}) {
    super()

    if (typeof map.forEach === 'function') {
      map.forEach((value, key) => {
        this.set(key, value)
      })
    }

    Object.keys(map).forEach(key => {
      this.set(key, map[key])
    })
  }

  import (key, input, options) {
    const parser = this.get(key)

    if (!parser) {
      return null
    }

    return parser.import(input, options)
  }
}

module.exports = SinkMap
