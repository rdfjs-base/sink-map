import stream from 'readable-stream'

class SinkMap extends Map {
  import (key, input, options) {
    const sink = this.get(key)

    if (!sink) {
      return null
    }

    if (typeof sink === 'function') {
      const passThrough = new stream.PassThrough()
      Promise.resolve().then(async () => {
        const sinkInstance = await sink()
        this.set(key, sinkInstance)

        sinkInstance.import(input, options).pipe(passThrough)
      })

      return passThrough
    }

    return sink.import(input, options)
  }
}

export { SinkMap }
