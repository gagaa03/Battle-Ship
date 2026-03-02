// tests/ship.test.js
import { Ship } from '../src/ship.js';

test('Ship records hits and can be sunk', () => {
  const ship = new Ship(2);
  expect(ship.isSunk()).toBe(false);
  ship.hit(0);
  expect(ship.isSunk()).toBe(false);
  ship.hit(1);
  expect(ship.isSunk()).toBe(true);
});