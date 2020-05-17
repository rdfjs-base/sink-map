import stream from 'readable-stream'

class SinkMap extends Map {
  import (key, input, options) {
    const sink = this.get(key)

    if (!sink) {
      return null
    }

    if (typeof sink === 'function') {
      const passThrough = new stream.PassThrough({ objectMode: true })
      Promise.resolve().then(async () => {
        const sinkInstance = await sink()
        this.set(key, sinkInstance)

        const origStream = sinkInstance.import(input, options)
        origStream.on('error', err => {
          passThrough.emit('error', err)
          passThrough.emit('end')
        })

        origStream.pipe(passThrough)
      })

      return passThrough
    }

    return sink.import(input, options)
  }
}

export { SinkMap }
