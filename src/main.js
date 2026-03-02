import './style.css';
import { Ship } from './ship.js';
import { Player } from './player.js';
import { renderBoard, showMessage } from './dom.js';
import { Gameboard } from './gameboard.js';

// 初始化遊戲模式
const player = new Player();
const player1 = new Player();
const player2 = new Player();
const computer = new Player(true);

const modeSelectScreen = document.getElementById('mode-select-screen');
const singlePlayerBtn = document.getElementById('single-player-btn');
const twoPlayerBtn = document.getElementById('two-player-btn');
const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const startGameBtn = document.getElementById('start-game');
const rotateBtn = document.getElementById('rotate-ship');
const shipyard = document.getElementById('shipyard');
const changeModeBtn = document.getElementById('change-mode');

const restartBtn = document.getElementById('restart-game');
const passScreen = document.getElementById('pass-screen');
const passText = document.getElementById('pass-message');
const passContinueBtn = document.getElementById('pass-continue');


const playerBoardEl = document.getElementById('player-board'); // 單人模式棋盤
const player1SetupBoardEl = document.getElementById('player1-setup-board'); // 雙人 setup
const player2SetupBoardEl = document.getElementById('player2-setup-board'); // 雙人 setup
const player1BoardEl = document.getElementById('player1-board-game'); // 雙人對戰
const player2BoardEl = document.getElementById('player2-board-game'); // 雙人對戰


let gameMode = null;
let isHorizontal = true;
let draggedShip = null;
let draggedLength = 0;
let currentSetupPlayer = 1; // 雙人模式擺船玩家
let currentPlayer = 1;      // 雙人模式回合玩家


// 預設船的長度
const shipToPlace = [4, 3, 2];


// 初始化空棋盤
function renderEmptyBoard(element) {
  element.innerHTML = '';
  for (let i = 0; i < 100; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    element.appendChild(cell);
  }
}

renderEmptyBoard(playerBoardEl);
renderEmptyBoard(player1SetupBoardEl);
renderEmptyBoard(player2SetupBoardEl);
renderEmptyBoard(player1BoardEl);
renderEmptyBoard(player2BoardEl);



// Pass Device 畫面
function showPassScreen(nextPlayer) {
    passText.textContent = `Pass the device to Player ${nextPlayer}`;
    passScreen.style.display = 'flex';
}

passContinueBtn.addEventListener('click', () => {
    passScreen.style.display = 'none';
});


// 選擇模式
singlePlayerBtn.addEventListener('click', () => {
    gameMode = 'single';
    modeSelectScreen.style.display = 'none';
    setupScreen.style.display = 'flex';
    document.getElementById('single-setup-board').style.display = 'flex';
    document.getElementById('two-setup-boards').style.display = 'none';
});


twoPlayerBtn.addEventListener('click', () => {
    gameMode = 'two';
    modeSelectScreen.style.display = 'none';
    setupScreen.style.display = 'flex';
    document.getElementById('single-setup-board').style.display = 'none';
    document.getElementById('two-setup-boards').style.display = 'grid';
    player1SetupBoardEl.style.display = 'grid';
    player2SetupBoardEl.style.display = 'none';
    showMessage('Player 1, place your ships!');
    });



// 旋轉船
rotateBtn.addEventListener('click', () => {
    isHorizontal = !isHorizontal;
    showMessage(`Ship rotation: ${isHorizontal ? 'Horizontal' : 'Vertical'}`);
});


// 初始化shipyard
function initShipyard() {
    shipyard.innerHTML = '';
    shipToPlace.forEach(length => {
        const shipEl = document.createElement('div');
        shipEl.classList.add('draggable-ship');
        shipEl.draggable = true;
        shipEl.dataset.length = length;
        shipEl.textContent = `🚢(${length})`;
        shipyard.appendChild(shipEl);

        shipEl.addEventListener('dragstart', e => {
            draggedShip = e.target;
            draggedLength = Number(e.target.dataset.length);
        });
    });
}

initShipyard()


// 清理 highlight
function clearHighlights() {
  document.querySelectorAll(".cell.drag-over, .cell.drag-invalid")
    .forEach(cell => cell.classList.remove("drag-over", "drag-invalid"));
}


// 取得當前擺船玩家
function getActiveSetupPlayer() {
    if (gameMode === 'single') return player;      // 單人模式
    return currentSetupPlayer === 1 ? player1 : player2;
}
function getActiveSetupBoard() {
    if (gameMode === 'single') return playerBoardEl;
    return currentSetupPlayer === 1 ? player1SetupBoardEl : player2SetupBoardEl;
}



// 允許放置的位置
function setupDropHandler(boardEl) {
    boardEl.addEventListener("dragover", e => {
        e.preventDefault(); // 允許放置

        const cell = e.target.closest('.cell');
        if (!cell || !draggedShip) return; // 非 cell 不處理

        clearHighlights();

        const idx = Number(cell.dataset.index);
        const coords = [];
        for (let i = 0; i < draggedLength; i++) {
            let coord = isHorizontal ? idx + i : idx + i *10;
            coords.push(coord);
        }

        const activePlayer = getActiveSetupPlayer();
        if (!activePlayer || !activePlayer.gameboard) return;

        const valid = coords.length === draggedLength &&
                coords.every(c => c < 100 && 
                    (!isHorizontal || Math.floor(c/10) === Math.floor(idx/10)));
        const overlap = coords.some(c => activePlayer.gameboard.ships.some(s => s.coordinates.includes(c)));

        coords.forEach(c => {
            const cell = boardEl.querySelector(`.cell[data-index="${c}"]`);
            if(!cell) return;
            cell.classList.add(valid && !overlap ? 'drag-over' : 'drag-invalid');
        });
    });


    // 放下船
    boardEl.addEventListener("drop", e => {
        e.preventDefault(); // 允許放置

        const cell = e.target.closest('.cell');
        if (!cell || !draggedShip) return;

        clearHighlights();

        const idx = Number(cell.dataset.index);
        const coords = [];
        for (let i = 0; i < draggedLength; i++) {
            let coord = isHorizontal ? idx + i : idx + i * 10;
            coords.push(coord);
        }

        const activePlayer = getActiveSetupPlayer();
        if (!activePlayer || !activePlayer.gameboard) return;

        // 檢查合規性
        const valid = coords.length === draggedLength &&
                coords.every(c => c < 100 && 
                    (!isHorizontal || Math.floor(c/10) === Math.floor(idx/10)));
        const overlap = coords.some(c => activePlayer.gameboard.ships.some(s => s.coordinates.includes(c)));
        if (!valid || overlap) return showMessage('Cannot place ship here!');



        // 如果從棋盤拖曳 → 先移除舊船
        if (draggedShip.classList.contains("placed-ship")) {
            const oldCoords = draggedShip.dataset.coords.split(',').map(Number);
            activePlayer.gameboard.ships = activePlayer.gameboard.ships.filter(
                s => !s.coordinates.every(c => oldCoords.includes(c))
            );
            oldCoords.forEach(c=>{
                const cell = boardEl.querySelector(`.cell[data-index="${c}"]`);
                if(cell) cell.classList.remove('ship');
            });
        } else if (draggedShip.classList.contains("draggable-ship")) {
            draggedShip.remove(); // 如果是從shipyard拖曳的，從shipyard移除
        }
        
        // 成功放置
        activePlayer.gameboard.placeShip(new Ship(draggedLength), coords);

        // 更新格子樣式
        coords.forEach(c => {
            const cell = boardEl.querySelector(`.cell[data-index="${c}"]`);
            if(cell) cell.classList.add('ship');
        });

        // 將船元素放到reset區塊
        draggedShip.dataset.coords = coords.join(',');
        draggedShip.classList.add('placed-ship');
        draggedShip.draggable = true;
        
        // append 回 .boats 而不是棋盤
        document.getElementById("reset-ships").appendChild(draggedShip);

        // 綁定可再次拖曳
        draggedShip.addEventListener('dragstart', e => {
            draggedShip = e.target;
            draggedLength = Number(e.target.dataset.length);
        });

        draggedShip = null;

        if (activePlayer.gameboard.ships.length === shipToPlace.length) {
            showMessage('All ships places! Start game.');
            startGameBtn.disabled = false;
        }
    });
}

// 綁定 drop handler
setupDropHandler(playerBoardEl);  // 單人模式
setupDropHandler(player1SetupBoardEl); // 雙人模式 P1
setupDropHandler(player2SetupBoardEl); // 雙人模式 P2


// 切換擺船玩家
function switchSetupPlayer() {
    currentSetupPlayer = 2;
    player1SetupBoardEl.style.display = 'none';
    player2SetupBoardEl.style.display = 'grid';

    // 清空 reset 區塊，避免殘留 Player1 的船
    const resetArea = document.getElementById("reset-ships");
    resetArea.innerHTML = "<h4>Reset Ships</h4>";

    initShipyard();   // 重新生成可拖曳船
    showMessage('Player 2, place your ships!');
}


// 開始遊戲
startGameBtn.addEventListener('click', () => {
    if (gameMode === 'single') {
        if(player.gameboard.ships.length !== shipToPlace.length){
            showMessage('Place all ships first!');
            return;
        }
        setupScreen.style.display = 'none';
        document.getElementById("single-player-board").style.display = 'grid';
        gameScreen.style.display = 'flex';
        initSinglePlayerGame();
    } else if (gameMode === 'two') {
        if (currentSetupPlayer === 1) {
            // Player1 階段
            if (player1.gameboard.ships.length !== shipToPlace.length) {
                showMessage('Player 1: Place all ships first!');
                return;
            }
            switchSetupPlayer(); // 切換到 Player2
        } else if (currentSetupPlayer === 2) {
            // Player2 階段
            if (player2.gameboard.ships.length !== shipToPlace.length) {
                showMessage('Player 2: Place all ships first!');
                return;
            }
            setupScreen.style.display = 'none';
            document.getElementById("two-player-boards").style.display = 'grid';
            gameScreen.style.display = 'flex';
            initTwoPlayerGame();
        }
    }
});


// 更改模式
changeModeBtn.addEventListener('click', () => {
    modeSelectScreen.style.display = 'flex';
    setupScreen.style.display = 'none';
    restartBtn.style.display = 'none';
    gameScreen.style.display = 'none';
    changeModeBtn.style.display = 'none';
    restartBtn.style.display = 'none';
    changeModeBtn.style.display = 'none';
    document.getElementById('single-player-board').style.display = 'none';
    document.getElementById('two-player-boards').style.display = 'none';

    // 重置遊戲
    player.gameboard = new Gameboard();
    player1.gameboard = new Gameboard();
    player2.gameboard = new Gameboard();
    computer.gameboard = new Gameboard();

    // 清空所有棋盤格子
    renderEmptyBoard(playerBoardEl);
    renderEmptyBoard(player1SetupBoardEl);
    renderEmptyBoard(player2SetupBoardEl);
    renderEmptyBoard(player1BoardEl);
    renderEmptyBoard(player2BoardEl);

    // 清空 reset 區塊，避免殘留 Player1 的船
    const resetArea = document.getElementById("reset-ships");
    resetArea.innerHTML = "<h4>Reset Ships</h4>";
    // 重新生成可拖曳船
    initShipyard();

    // 雙人模式特有
    currentSetupPlayer = 1;
    currentPlayer = 1;
    player1SetupBoardEl.style.display = 'grid';
    player2SetupBoardEl.style.display = 'none';

    showMessage('Select game mode.');
});


// 重置
restartBtn.addEventListener('click', () => {
    // 重置遊戲
    player.gameboard = new Gameboard();
    player1.gameboard = new Gameboard();
    player2.gameboard = new Gameboard();
    computer.gameboard = new Gameboard();

    // 清空所有棋盤格子
    renderEmptyBoard(playerBoardEl);
    renderEmptyBoard(player1SetupBoardEl);
    renderEmptyBoard(player2SetupBoardEl);
    renderEmptyBoard(player1BoardEl);
    renderEmptyBoard(player2BoardEl);

    // 清空 reset 區塊，避免殘留 Player1 的船
    const resetArea = document.getElementById("reset-ships");
    resetArea.innerHTML = "<h4>Reset Ships</h4>";
    // 重新生成可拖曳船
    initShipyard();

    // 顯示初始訊息
    showMessage('Place your ships!');

    // 重置 UI
    setupScreen.style.display = 'flex';
    document.getElementById('single-player-board').style.display = 'none';
    document.getElementById('two-player-boards').style.display = 'none';
    restartBtn.style.display = 'none';
    changeModeBtn.style.display = 'none';
    startGameBtn.disabled = true;

    // 雙人模式特有
    currentSetupPlayer = 1;
    currentPlayer = 1;
    player1SetupBoardEl.style.display = 'grid';
    player2SetupBoardEl.style.display = 'none';
});



function initSinglePlayerGame(){
    // 電腦隨機擺船
    const shipLengths = [4, 3, 2];
    for (let length of shipLengths) {
        let placed = false;
        while (!placed) {
            const horiz = Math.random() < 0.5;
            const start = Math.floor(Math.random() * 100);
            const coords = [];
            for (let i =0; i < length; i++) {
                let c = horiz ? start + i : start + i * 10;
                if (c >= 100 || (horiz && Math.floor(c/10) !== Math.floor(start/10))) break;
                coords.push(c);
            }
            if (coords.length === length && !coords.some(c => computer.gameboard.ships.some(s => s.coordinates.includes(c)))) {
                computer.gameboard.placeShip(new Ship(length), coords);
                placed = true;
            }
        }
    }



    const playerBoardGameEl = document.getElementById("player-board-game");
    const opponentBoardGameEl = document.getElementById("opponent-board-game");

    let playerTurn = true;
    let potentialTargets = []; //智能攻擊


    function updateBoards() {
        // 玩家棋盤 → 永遠顯示船
        renderBoard(player.gameboard, playerBoardGameEl, true);
        // 電腦棋盤 → 只顯示攻擊結果
        renderBoard(computer.gameboard, opponentBoardGameEl, false);
    }

    function checkGameOver() {
        if (player.gameboard.allShipsSunk()) {
            showMessage('Computer Wins 🌟!');
            opponentBoardGameEl.removeEventListener('click', playerAttackHandler);
            restartBtn.style.display = 'flex'; // 顯示重完按鈕
            changeModeBtn.style.display = 'flex';
            return true;
        }
        if (computer.gameboard.allShipsSunk()) {
            showMessage('Player Wins 🌟!');
            opponentBoardGameEl.removeEventListener('click', playerAttackHandler);
            restartBtn.style.display = 'flex'; // 顯示重完按鈕
            changeModeBtn.style.display = 'flex';
            return true;
        }
        return false;
    }


    // 電腦攻擊
    function computerTurn() {
        if (checkGameOver()) return;

        const moves = player.availableMoves;
        if (potentialTargets.length === 0 && moves.length === 0) return;


        let target;
        if (potentialTargets.length > 0) {
            target = potentialTargets.shift(); // 優先攻擊附近的座標
        } else {
            const idx = Math.floor(Math.random() * moves.length);
            target = moves.splice(idx, 1)[0]; // 隨機選取一格
        }

        const hit = computer.attack(player, target);

        if (hit) {
            // 只有命中後才加入上下左右相鄰格子
            const neighbors = [target-1, target+1, target-10, target+10].filter(
                (n) => n >= 0 && n < 100 && 
                    !player.gameboard.missedAttacks.includes(n) &&
                    !player.gameboard.ships.some((s) => s.isHitAt(n))
            );
            potentialTargets.push(...neighbors);
            showMessage(`Computer hits the boat!`);
        } else {
            showMessage(`Computer misses.`)
        }

        updateBoards();
        
        if (hit) {
            // 命中後再攻擊一次，延遲 500ms
            setTimeout(computerTurn, 500);
        } else {
            // 換玩家回合
            playerTurn = true;
            setTimeout(() => showMessage('Your turn!'), 500);
        }
    }


    // 玩家攻擊
    function playerAttackHandler(e) {
        if (!playerTurn) return;
        if (!e.target.classList.contains('cell')) return;

        const idx = Number(e.target.dataset.index);
        if (isNaN(idx)) return;

        const alreadyAttacked = computer.gameboard.missedAttacks.includes(idx) ||
            computer.gameboard.ships.some(s => s.coordinates.includes(idx) && s.isHitAt(idx));
        if (alreadyAttacked) {
            showMessage('Already attacked here!');
            return;
        }

        const hit = player.attack(computer, idx);
        updateBoards();

        if (checkGameOver()) return;

        if (hit) {
            showMessage('You hit! Attack again.');
        } else {
            showMessage('You missed. Computer is attacking...');
            playerTurn = false;

            setTimeout(computerTurn, 500);
        }
    }

    opponentBoardGameEl.addEventListener('click', e => {
        if (!playerTurn) return;
        if (!e.target.classList.contains('cell')) return;

        playerAttackHandler(e);
    });

    updateBoards();
    showMessage('Your turn!');
}


//雙人模式
function initTwoPlayerGame() {
    const boardP1 = document.getElementById("player1-board-game");
    const boardP2 = document.getElementById("player2-board-game");

    function updateBoards() {
        if (currentPlayer === 1) {
            // P1 自己能看到自己的船
            renderBoard(player1.gameboard, boardP1, true);
            // P1 看到 P2 只能看到命中/未命中，不顯示船
            renderBoard(player2.gameboard, boardP2, false);
        } else {
            // P2 自己能看到自己的船
            renderBoard(player2.gameboard, boardP2, true);
            // P2 看到 P1 只能看到命中/未命中，不顯示船
            renderBoard(player1.gameboard, boardP1, false);
        }
    }

    function handleAttack(e) {
        if (!e.target.classList.contains('cell')) return;
        const idx = Number(e.target.dataset.index);

        let attacker, defender, defenderBoard;
        if (currentPlayer === 1) {
            attacker = player1;
            defender = player2;
            defenderBoard = boardP2;
        } else {
            attacker = player2;
            defender = player1;
            defenderBoard = boardP1;
        }

        const alreadyAttacked =
            defender.gameboard.missedAttacks.includes(idx) ||
            defender.gameboard.ships.some(s => s.coordinates.includes(idx) && s.isHitAt(idx));
        if (alreadyAttacked) {
            showMessage('Already attacked!');
            return;
        }

        const hit = attacker.attack(defender, idx);
        updateBoards();

        if (defender.gameboard.allShipsSunk()) {
            showMessage(`Player ${currentPlayer} wins!`);
            // 移除攻擊事件
            boardP1.removeEventListener('click', handleAttack);
            boardP2.removeEventListener('click', handleAttack);
            restartBtn.style.display = 'flex'; // 顯示重完按鈕
            changeModeBtn.style.display = 'flex';
            return;
        }

        if (hit) {
            showMessage(`Player ${currentPlayer} hit! Go again.`);
        } else {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            showMessage(`Player ${currentPlayer}'s turn!`);
            showPassScreen(currentPlayer);
            updateBoards();
        }
    }

    boardP1.addEventListener('click', e => {
        if (currentPlayer === 1) return; // P1不能攻擊自己的棋盤
        handleAttack(e);
    });

    boardP2.addEventListener('click', e => {
        if (currentPlayer === 2) return; // P2不能攻擊自己的棋盤
        handleAttack(e);
    });
    updateBoards();
    showMessage('Player 1 starts!');
}



