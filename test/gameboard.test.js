import { Ship } from '../src/ship.js';
import { Gameboard } from '../src/gameboard.js';

test('Gameboard places ship and records attacks', () => {
  const board = new Gameboard();
  const ship = new Ship(2);
  board.placeShip(ship, [1, 2]);

  expect(board.receiveAttack(1)).toBe(true); // 命中
  expect(ship.hits).toBe(1);
  expect(board.receiveAttack(3)).toBe(false); // 未命中
  expect(board.missedAttacks).toContain(3);

  board.receiveAttack(2);
  expect(ship.isSunk()).toBe(true);
  expect(board.allShipsSunk()).toBe(true);
});