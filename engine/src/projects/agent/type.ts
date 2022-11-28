import Camera from '../../app/tools/camera';
import DisplayCompositor from '../../app/tools/display-compositor';
import EntityManager from '../../app/tools/entity-manager';
import GameStateMachine from '../../app/tools/game-state-machine';
import Scheduler from '../../app/tools/scheduler';
import {GameContext} from '../../app/types';

export type AgentLevelConfig<T> = {
    camera: Camera
    compositor: DisplayCompositor,
    context: GameContext,
    entityManager: EntityManager<T>,
    name: string,
    scheduler: Scheduler,
    stateMachine: GameStateMachine
}

export type Entity = object;
