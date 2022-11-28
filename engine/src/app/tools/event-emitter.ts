import {EVENT_ANY} from '../constants';

export default class EventEmitter {
    private readonly listeners: { [key: string]: { (payload?: object): void; }[] } = {};

    constructor() {
        this.listeners[EVENT_ANY] = [];
    }

    off(name: string) {
        this.listeners[name] = [];
        if (name === EVENT_ANY) {
            for (const key of Object.keys(this.listeners)) {
                this.listeners[key] = [];
            }
        }
    }

    on(name: string, callback: (payload?: object) => void): void {
        if (!(name in this.listeners)) {
            this.listeners[name] = [];
        }
        this.listeners[name].push(callback);
    }

    emit(name: string, payload?: object): void {
        if (name in this.listeners) {
            for (const cb of this.listeners[name]) {
                cb(payload);
            }
        }

        for (const cb of this.listeners[EVENT_ANY]) {
            cb(payload);
        }
    }
}