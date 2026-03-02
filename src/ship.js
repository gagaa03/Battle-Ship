export class Ship {
    constructor(length, coordinates) {
        this.length = length;
        this.coordinates = coordinates; // ship的格子座標
        this.hits = []; // 被命中的格子座標
    }

    hit(coord) {
        if (!this.hits.includes(coord)) this.hits.push(coord);
    }

    isSunk() {
        return this.hits.length >= this.length;
    }

    isHitAt(coord) {
        return this.hits.includes(coord);
    }
}