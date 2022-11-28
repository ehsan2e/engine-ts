import AgentLevel from './agent-level';
import {LevelFactoryInterface} from '../../app/interfaces';
import Camera from '../../app/tools/camera';
import DisplayCompositor from '../../app/tools/display-compositor';
import EntityManager from '../../app/tools/entity-manager';
import GameStateMachine from '../../app/tools/game-state-machine';
import Scheduler from '../../app/tools/scheduler';
import {GameContext, Level} from '../../app/types';
import {AgentLevelConfig, Entity} from './type';

export default class AgentLevelFactory implements LevelFactoryInterface {
    async load(name: string, context: GameContext, stateMachine: GameStateMachine): Promise<Level> {
        const camera = new Camera(context.display, context.mouse);
        const compositor = new DisplayCompositor();
        const entityManager = new EntityManager<Entity>();
        const scheduler = new Scheduler();
        const config: AgentLevelConfig<Entity> = {
            camera,
            compositor,
            context,
            entityManager,
            name,
            scheduler,
            stateMachine
        };
        const level = new AgentLevel(config);
        await level.load();
        return level;
    }
}