class SinkMap {
  constructor (map) {
    if (map) {
      Object.keys(map).forEach(key => {
        this[key] = map[key]
      })
    }
  }

  find (key) {
    if (!this.hasOwnProperty(key)) {
      return undefined
    }

    return this[key]
  }

  import (key, input, options) {
    const parser = this.find(key)

    if (!parser) {
      return null
    }

    return parser.import(input, options)
  }

  list () {
    return Object.keys(this).filter(key => this.hasOwnProperty(key))
  }
}

module.exports = SinkMap
