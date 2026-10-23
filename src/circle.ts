const CIRCLE_LIFETIME = 1000;
const MAX_SIZE = 25;

export class Circle {
    x: number;
    y: number;
    created: DOMHighResTimeStamp;
    opacity: number = 1;
    size: number;

    constructor(x:number, y:number, created:DOMHighResTimeStamp) {
        this.x = x;
        this.y = y;
        this.created = created;
        this.size = 1;
    }

    update(currentTime: DOMHighResTimeStamp) {
        const elapsed = currentTime - this.created;
        const progress = elapsed / CIRCLE_LIFETIME;

        this.opacity = 1 - progress;
        this.size = MAX_SIZE * progress;
    }

    isAlive(currentTime: DOMHighResTimeStamp) {
        return currentTime - this.created < CIRCLE_LIFETIME;
    }
}
