[繁體中文](./README.zh-TW.md) | English

# Battle-Ship

A browser-based implementation of the classic naval combat game **Battleship**, built with vanilla JavaScript and Webpack.

**Live Demo**: [https://gagaa03.github.io/Battle-Ship/](https://gagaa03.github.io/Battle-Ship/)

---

## Features

- **Single Player Mode** — Face off against a computer opponent
- **Two Player Mode** — Local multiplayer with a "pass the device" screen between turns
- **Drag-and-Drop Ship Placement** — Intuitively place ships on your board before the battle begins
- **Ship Rotation** — Toggle ships between horizontal and vertical orientations
- **Smart Random Attacks** — The computer attacks randomly, but prioritizes adjacent cells after a hit
- **Dark Theme UI** — Clean, polished interface with custom fonts and color-coded cell states

---

## Gameplay

### Ship Placement
1. Select a game mode (Single Player or Two Player)
2. Drag ships onto your 10x10 grid
3. Toggle rotation to change ship orientation
4. Reset the board if you want to reposition ships

### Battle
- Click cells on the opponent's board to attack
- **Red** = Hit, **Dark** = Miss, **Green** = Your ships
- A hit allows an extra turn
- The first player to sink all 3 enemy ships wins

### Ships
| Ship | Length |
|------|--------|
| Destroyer | 4 |
| Submarine | 3 |
| Patrol Boat | 2 |

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| JavaScript (ES6 Modules) | Core game logic |
| Webpack 5 | Module bundler |
| Babel | JS transpilation |
| CSS (custom properties) | Styling & dark theme |
| HTML5 Drag API | Ship placement interface |

---

## Getting Started

To play, simply visit the [Live Demo](https://gagaa03.github.io/Battle-Ship/) in your browser — no installation required.

For local development:

```bash
git clone https://github.com/gagaa03/Battle-Ship.git
cd Battle-Ship
npm install
npm start        # Dev server at http://localhost:8080
npm run build    # Build to dist/
npm run watch    # Auto-rebuild on changes
```

> Requires [Node.js](https://nodejs.org/) for local development only.

---

## Project Structure

```
Battle-Ship/
├── src/
│   ├── main.js          # Game controller — handles UI events and game flow
│   ├── ship.js          # Ship class — tracks length, coordinates, and damage
│   ├── gameboard.js     # Gameboard class — manages ship placement and attacks
│   ├── player.js        # Player class — human and computer player logic
│   ├── dom.js           # DOM rendering — board and message rendering
│   ├── index.html       # HTML template
│   └── style.css        # Dark theme styles
├── test/
│   ├── ship.test.js
│   ├── gameboard.test.js
│   └── player.test.js
├── dist/                # Compiled build output
├── webpack.config.js
└── package.json
```
