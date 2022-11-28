import {GAME_STATE_ANY, GAME_STATE_UNDEFINED} from "../constants";
import {GameContext, GameState, GameStateMachineConfig, GameStateMachineTransition, TimerEvent} from '../types';

export default class GameStateMachine {
    private readonly config: GameStateMachineConfig;
    private readonly context: GameContext;
    private currentState: GameState<object>;
    private debugState: GameState<object>;
    private state: string = GAME_STATE_UNDEFINED;
    private readonly validTransitions: { [key: string]: GameStateMachineTransition; } = {}

    constructor(context: GameContext, config: GameStateMachineConfig) {
        this.context = context;
        this.config = config
        for (const transition of config.transitions) {
            this.validTransitions[GameStateMachine.getTransitionIdentifier(transition.from, transition.to)] = transition;
        }
        this.context.timer.attach(this.run.bind(this));
    }

    private run(timerEvent: TimerEvent): void {
        if (this.currentState !== undefined && 'update' in this.currentState) {
            for (let i = timerEvent.intervals; i > 0; i--) {
                if (this.currentState === undefined) {
                    break;
                }
                this.currentState.update(timerEvent);
            }
        }

        if (this.currentState !== undefined && 'draw' in this.currentState) {
            this.currentState.draw(timerEvent.lag);
        }
        if (this.context.debug) {
            if (this.currentState === undefined && 'draw' in this.debugState) {
                this.debugState.draw(timerEvent.lag);
            }
            this.context.debugger.sample(timerEvent);
            this.context.debugger.draw(this.context.display.ctx, this.context.display.width);
        }
        this.context.mouse.flush();
        this.context.keyboard.flush();
    }

    private static getTransitionIdentifier(from: string, to: string): string {
        return `${from} -> ${to}`;
    }

    async switchState(state: string, payload: object): Promise<void> {
        this.context.timer.stop();
        this.context.container;
        const container = this.context.container.cloneNode(true) as HTMLDivElement;
        this.context.container.parentNode.replaceChild(container, this.context.container);
        container.innerHTML = '';
        this.context.container = container;
        if (this.currentState && 'leave' in this.currentState) {
            this.currentState.leave();
        }
        if (!(state in this.config.states)) {
            throw new Error(`Unknown state '${state}" is requested`);
        }
        const transitionIdentifier = GameStateMachine.getTransitionIdentifier(this.state, state);
        if (!(transitionIdentifier in this.validTransitions)) {
            const anyTransitionIdentifier = GameStateMachine.getTransitionIdentifier(this.state, GAME_STATE_ANY);
            if (!(anyTransitionIdentifier in this.validTransitions)) {
                throw new Error(`Cannot transition from ${this.state} to ${state}`);
            }
        }
        this.state = state;
        this.currentState = this.config.states[this.state]
        if (this.context.debug) {
            this.debugState = this.currentState;
        }
        let shouldStartTheTimer = await this.currentState.enter(this.context, this, payload);
        if (this.context.debug) {
            this.context.debugger.reset()
        }
        if (shouldStartTheTimer) {
            if ('shouldResetTimer' in this.currentState) {
                if (this.currentState.shouldResetTimer()) {
                    this.context.timer.start();
                } else {
                    this.context.timer.continue();
                }
            } else {
                this.context.timer.start();
            }
        }

        this.context.keyboard.flush();
        this.context.mouse.flush();
    }
}
