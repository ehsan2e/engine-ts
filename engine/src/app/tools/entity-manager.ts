type EntityMap<T> = { [key: string]: T };

export default class EntityManager<T> {
    private entities: EntityMap<T> = {}
    private taggedEntities: { [key: string]: EntityMap<T> } = {};

    add(id: string, entity: T, tags: string[] = []): void {
        this.entities[id] = entity;
        for (const tag of tags) {
            if (!(tag in this.taggedEntities)) {
                this.taggedEntities[tag] = {};
            }
            this.taggedEntities[tag][id] = entity;
        }
    }

    *iterator(tag?: string): Generator<T, void, boolean> {
        if (tag === undefined) {
            for (const entity of Object.values(this.entities)) {
                yield entity;
            }
        } else if (tag in this.taggedEntities) {
            for (const entity of Object.values(this.taggedEntities[tag])) {
                yield entity;
            }
        }
    }

    remove(id: string): void {
        delete this.entities[id];
        for (const list of Object.values(this.taggedEntities)) {
            delete list[id];
        }
    }

    get(id: string): T {
        return (id in this.entities) ? this.entities[id] : undefined;
    }
}