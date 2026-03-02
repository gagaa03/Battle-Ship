import { Player } from '../src/player.js';
import { Ship } from '../src/ship.js';
import { Gameboard } from '../src/gameboard.js';

test('Player can attack opponent', () => {
  const player = new Player();
  const opponent = new Player();
  const ship = new Ship(2);
  opponent.Gameboard.placeShip(ship, [5,6]);

  expect(player.attack(opponent, 5)).toBe(true); // 命中
  expect(ship.hits).toBe(1);
  expect(opponent.Gameboard.missedAttacks).toHaveLength(0);

  expect(player.attack(opponent, 10)).toBe(false); // 未命中
  expect(opponent.Gameboard.missedAttacks).toContain(10);
});

test('Computer player can perform random attack', () => {
  const computer = new Player(true);
  const opponent = new Player();
  const ship = new Ship(1);
  opponent.Gameboard.placeShip(ship, [42]);

  const result = computer.randomAttack(opponent);
  expect(typeof result).toBe('boolean'); // 隨機攻擊會回傳 true/false
});
