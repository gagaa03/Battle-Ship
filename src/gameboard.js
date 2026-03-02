import { Ship } from './ship.js'

export class Gameboard {
    constructor() {
        this.ships = [];  // 每個元素: { ship, coordinates: [coord1, coord2, ...] }
        this.missedAttacks = [];
    }

    placeShip(ship, coordinates) {
        ship.coordinates = coordinates; // 儲存格子
        this.ships.push(ship);
    }

    receiveAttack(coordinate) {
        const target = this.ships.find(s => s.coordinates.includes(coordinate));
        if (target) {
            target.hit(coordinate); // 只記錄這個格子
            return true; // 有命中
        } else {
            this.missedAttacks.push(coordinate);
            return false; // 沒命中
        }
    }

    allShipsSunk() {
        return this.ships.every(s => s.isSunk());
    }
}