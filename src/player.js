import { Gameboard } from "./gameboard.js";

export class Player {
    constructor(isComputer = false) {
        this.gameboard = new Gameboard();
        this.isComputer = isComputer;
        this.availableMoves = Array.from({ length: 100}, (_, i) => i); // 0~99座標
    }

    attack(opponent, coordinate) {
        return opponent.gameboard.receiveAttack(coordinate);
    }

    randomAttack(opponent) {
        if (!this.isComputer || this.availableMoves.length === 0) return null;
        const idx = Math.floor(Math.random() * this.availableMoves.length);
        const coord = this.availableMoves.splice(idx, 1)[0];
        return this.attack(opponent, coord);
    }
}
