// dom.js
export function renderBoard(gameboard, element, revealShips = false) {
    element.innerHTML = '';

    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;

        // 顯示命中 or miss
        if (gameboard.missedAttacks.includes(i)) {
            cell.classList.add('miss');
        }
        if (gameboard.ships.some(s => s.isHitAt(i))) {
            cell.classList.add('hit');
        }

        if (revealShips) {
            const ship = gameboard.ships.find(s => s.coordinates.includes(i));
            if (ship) {
                cell.classList.add('ship'); // 只用樣式標記船格
            }
        }

        // if (previewCells.includes(i)) {
        //     cell.classList.add('preview'); // highlight 預覽格
        // }

        element.appendChild(cell);
    }
}

export function showMessage(msg) {
    document.getElementById("message").textContent = msg;
}