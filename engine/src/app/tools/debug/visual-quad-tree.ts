import QuadTree from "../quad-tree";

export default class VisualQuadTree{
    private readonly divided: boolean
    private nw: VisualQuadTree = undefined;
    private ne: VisualQuadTree = undefined;
    private readonly quadtree: QuadTree;
    private se: VisualQuadTree = undefined;
    private sw: VisualQuadTree = undefined;
    constructor(quadtree: QuadTree) {
        this.quadtree= quadtree;
        this.divided = quadtree.isDivided();
        if(this.divided){
            this.nw = new VisualQuadTree(quadtree.getNW());
            this.ne = new VisualQuadTree(quadtree.getNE());
            this.sw = new VisualQuadTree(quadtree.getSW());
            this.se = new VisualQuadTree(quadtree.getSE());
        }
    }

    draw(ctx: CanvasRenderingContext2D, color: string) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.rect(this.quadtree.region.position.x, this.quadtree.region.position.y, this.quadtree.region.width, this.quadtree.region.height);
        ctx.stroke();
        if (this.divided) {
            this.nw.draw(ctx, color);
            this.ne.draw(ctx, color);
            this.sw.draw(ctx, color);
            this.se.draw(ctx, color);
        }
    }
}