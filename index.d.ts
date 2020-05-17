import { Sink } from 'rdf-js';
import { EventEmitter } from 'events';

type SinkOrLazy<InputStream extends EventEmitter, OutputStream extends EventEmitter> =
    Sink<InputStream, OutputStream> |
    (() => Sink<InputStream, OutputStream>)

export interface SinkMap<InputStream extends EventEmitter, OutputStream extends EventEmitter> extends Map<string, SinkOrLazy<InputStream, OutputStream>> {
    import(mediaType: string, input: InputStream, options?: any): OutputStream | null;
}

export class SinkMap<InputStream extends EventEmitter, OutputStream extends EventEmitter> extends Map<string, SinkOrLazy<InputStream, OutputStream>> implements SinkMap<InputStream, OutputStream> {
}
