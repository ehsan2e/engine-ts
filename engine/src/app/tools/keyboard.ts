import {KeyState} from "../types";

export const META_KEY = 'Meta';

export default class Keyboard {
    public state: { [key: string]: KeyState; } = {};

    attach(): void {
        window.addEventListener('keydown', (event: KeyboardEvent) => {
            this.state[event.key] = KeyState.PRESSED;
        });
        window.addEventListener('keyup', (event: KeyboardEvent) => {
            this.state[event.key] = KeyState.RELEASED;
        });
    }

    flush(): void {
        for (const [key, value] of Object.entries(this.state)) {
            if (value === KeyState.RELEASED) {
                delete this.state[key];
            }
            if (key !== META_KEY && this.isPressed(META_KEY) && value === KeyState.PRESSED) {
                this.state[key] = KeyState.RELEASED;
            }
        }
    }

    isPressed(key: string): boolean {
        return (key in this.state) ? (this.state[key] === KeyState.PRESSED) : false;
    }

    isReleased(key: string): boolean {
        return (key in this.state) ? (this.state[key] === KeyState.RELEASED) : false;
    }

    read(): { [key: string]: KeyState; } {
        return this.state;
    }
}