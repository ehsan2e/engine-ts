import {GameContext} from '../types';
import Keyboard from './keyboard';
import Mouse from './mouse';
import Timer from './timer';

export default class SketchBook {
    private readonly context: GameContext;
    public readonly SCREEN_HEIGHT: number;
    public readonly SCREEN_HORIZONTAL_CENTER: number;
    public readonly SCREEN_VERTICAL_CENTER: number;
    public readonly SCREEN_WIDTH: number;
    public readonly keyboard: Keyboard;
    public readonly mouse: Mouse;
    public readonly screen: CanvasRenderingContext2D;
    public readonly timer: Timer;

    constructor(context: GameContext) {
        this.context = context;
        this.SCREEN_HEIGHT = context.display.height;
        this.SCREEN_HORIZONTAL_CENTER = context.display.width * 0.5;
        this.SCREEN_VERTICAL_CENTER = context.display.height * 0.5;
        this.SCREEN_WIDTH = context.display.width;
        this.keyboard = context.keyboard;
        this.mouse = context.mouse;
        this.screen = context.display.ctx;
        this.timer = context.timer;
    }

    clearScreen(color?: string): void {
        if (color === undefined) {
            this.screen.clearRect(0, 0, this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
        } else {
            this.screen.fillStyle = color;
            this.screen.fillRect(0, 0, this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
        }
    }

    createCheckbox(label: string, callback: (checked: boolean) => void, checked: boolean = true): boolean {
        const labelElement = document.createElement('label');
        const checkboxElement = document.createElement('input');
        checkboxElement.setAttribute('type', 'checkbox');
        checkboxElement.setAttribute('data-sketch-id', Date.now().toString());
        checkboxElement.checked = checked
        const textNode = document.createTextNode(label);
        labelElement.appendChild(checkboxElement);
        labelElement.appendChild(textNode);
        this.context.container.addEventListener('change', function (e: Event) {
            if (e.target === checkboxElement) {
                callback((e.target as HTMLInputElement).checked);
            }
        });
        this.context.container.appendChild(labelElement);
        return checkboxElement.checked;
    }

    createSelect(values: [string, string?][], callback: (value: string) => void, allowEmpty: boolean = false): string {
        const selectElement = document.createElement('select');
        if (allowEmpty) {
            const optionElement = document.createElement('option') as HTMLOptionElement;
            optionElement.innerText = '';
            optionElement.setAttribute('value', '');
            selectElement.appendChild(optionElement);
        }
        for (const [label, value] of values) {
            const optionElement = document.createElement('option') as HTMLOptionElement;
            optionElement.innerText = label;
            optionElement.setAttribute('value', value ?? label);
            selectElement.appendChild(optionElement);
        }
        this.context.container.addEventListener('change', function (e: Event) {
            if (e.target === selectElement) {
                callback((e.target as HTMLSelectElement).value);
            }
        });

        this.context.container.appendChild(selectElement);
        return allowEmpty ? undefined : (values.length === 0 ? undefined : values[0][0]);
    }
}