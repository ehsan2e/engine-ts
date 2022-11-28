import {QuadTreeEntity, QuadTreeEntityCollection, ShapePoint, ShapeRectangle} from '../types';
import * as collider from './collider';
import * as shapes from './shape';

export default class QuadTree {
    private readonly capacity: number;
    private readonly collections: QuadTreeEntityCollection[];
    private divided: boolean = false;
    private nw: QuadTree = undefined;
    private ne: QuadTree = undefined;
    private se: QuadTree = undefined;
    private sw: QuadTree = undefined;

    private static serial = 0;

    public readonly path: string;
    public readonly region: ShapeRectangle;

    constructor(region: ShapeRectangle, capacity: number, path: string = 'm') {
        this.region = region;
        this.capacity = capacity;
        this.path = path;
        this.collections = [];
    }

    private createEntity(point: ShapePoint): QuadTreeEntity {
        return {
            id: QuadTree.serial++,
            path: this.path,
            point: point,
        };
    }

    private divide() {
        const halfWidth = this.region.width * 0.5;
        const halfHeight = this.region.height * 0.5;
        this.nw = new QuadTree(shapes.rectangle(shapes.point(this.region.position.x, this.region.position.y), halfWidth, halfHeight), this.capacity, this.path + '-nw');
        this.ne = new QuadTree(shapes.rectangle(shapes.point(this.region.position.x + halfWidth, this.region.position.y), halfWidth, halfHeight), this.capacity, this.path + '-ne');
        this.se = new QuadTree(shapes.rectangle(shapes.point(this.region.position.x + halfWidth, this.region.position.y + halfHeight), halfWidth, halfHeight), this.capacity, this.path + '-se');
        this.sw = new QuadTree(shapes.rectangle(shapes.point(this.region.position.x, this.region.position.y + halfHeight), halfWidth, halfHeight), this.capacity, this.path + '-sw');
        this.divided = true;
        for (const collection of this.collections) {
            this.insertCollection(collection);
        }
        this.collections.length = 0;
    }

    private insertCollection(collection: QuadTreeEntityCollection): boolean {
        if (!collider.rectangleAndPointColliding(this.region, collection.point)) {
            return false;
        }

        if (this.divided) {
            return this.nw.insertCollection(collection)
                || this.ne.insertCollection(collection)
                || this.se.insertCollection(collection)
                || this.sw.insertCollection(collection);
        }
        if (this.collections.length < this.capacity) {
            for (const entity of collection.entities) {
                entity.path = this.path;
            }
            this.collections.push(collection);
            return true;
        }

        this.divide();
        return this.insertCollection(collection);
    }

    getNE(): QuadTree {
        return this.ne;
    }

    getNW(): QuadTree {
        return this.nw;
    }

    getSE(): QuadTree {
        return this.se;
    }

    getSW(): QuadTree {
        return this.sw;
    }

    insert(point: ShapePoint): QuadTreeEntity {
        if (!collider.rectangleAndPointColliding(this.region, point)) {
            return undefined;
        }

        if (this.divided) {
            return this.nw.insert(point)
                || this.ne.insert(point)
                || this.se.insert(point)
                || this.sw.insert(point);
        }

        for (const collection of this.collections) {
            if (collection.point.x === point.x && collection.point.x === point.x) {
                const entity = this.createEntity(point);
                collection.entities.push(entity);
                return entity;
            }
        }

        if (this.collections.length < this.capacity) {
            const entity = this.createEntity(point);
            this.collections.push({entities: [entity], point});
            return entity;
        }

        this.divide();
        return this.insert(point);
    }

    isDivided(): boolean {
        return this.divided;
    }

    query(area: ShapeRectangle, matches: QuadTreeEntityCollection[]): void {
        if (collider.rectanglesColliding(this.region, area)) {
            if (this.divided) {
                this.nw.query(area, matches);
                this.ne.query(area, matches);
                this.sw.query(area, matches);
                this.se.query(area, matches);
            } else {
                for (const collection of this.collections) {
                    if (collider.rectangleAndPointColliding(area, collection.point)) {
                        matches.push(collection);
                    }
                }
            }
        }

    }
}