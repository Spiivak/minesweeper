'use strict'

const BOMB = '☢️'
const FLAG = '🚩'
const LIVES = '❤️'
var gLives = 3

var gFirstCell
var gBoard = []
var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function onInit() {
    gBoard = buildBoard()
    gFirstCell = true
    displayBombs()
    console.log('gBoard', gBoard)
    gLives = 3
    renderLives()
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }

    renderBoard(gBoard)
}

function buildBoard() {
    const board = []
    // console.log(board)
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = {
                minesAroundCount: null,
                isShown: false,
                isMine: false,
                isMarked: false
            }

            board[i][j] = cell

        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr class="minesweeper-row">\n`
        for (var j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]
            const title = `Cell: ${i + 1}, ${j + 1}`
            var className = setCellClass(currCell, i, j)
            strHTML += `\t<td data-i="${i}" data-j="${j}" title="${title}" class="${className}" onclick="onCellClicked(this, ${i}, ${j}), expandShown(this, ${i}, ${j})" oncontextmenu="onCellMarked(this, event, ${i}, ${j}); return false;"></td>\n`

        }
        strHTML += `</tr>\n`
    }

    const elCells = document.querySelector('.board')
    elCells.innerHTML = strHTML
}


function displayBombs() {
    const elDisplay = document.querySelector('.display-bomb').innerText = gLevel.MINES

}

function setCellClass(currCell, i, j) {
    var className = 'cell';

    if (currCell.isMine) {
        className += ' is-mine';
    } else if (currCell.minesAroundCount !== null) {
        className += ` is-${currCell.minesAroundCount}`;
    }

    return className;
}

function newSize(elBtn) {
    if (elBtn.innerText === 'Beginner') {
        gLevel.SIZE = 4
        gLevel.MINES = 2
    } else if (elBtn.innerText === 'Medium') {
        gLevel.SIZE = 8
        gLevel.MINES = 14
    } else if (elBtn.innerText === 'Expert') {
        gLevel.SIZE = 12
        gLevel.MINES = 32
    } else {
        console.error('Invalid level')
    }
    onInit()
}

function renderLives() {
    var elLives = document.querySelector('.lives')
    var strHTML = ''
    for (var i = 0; i < gLives; i++) {
        strHTML += `<div class="life-${i}">${LIVES}</div>`
    }
    elLives.innerHTML = strHTML

}

function countBombAround(board, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMine) count++
        }
    }
    return count
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var currCell = board[i][j]
            if (!currCell.isMine) {
                currCell.minesAroundCount = countBombAround(board, i, j)
            }
        }
    }
}

function randomBomb() {
    var bombCount = 0

    while (bombCount < gLevel.MINES) {
        var i = getRandomInt(0, gLevel.SIZE - 1)
        var j = getRandomInt(0, gLevel.SIZE - 1)

        if (!gBoard[i][j].isMine) {

            gBoard[i][j].isMine = true
            bombCount++
        }
    }
    return bombCount
}

function onCellMarked(elCell, event, i, j) {
    var currCell = gBoard[i][j]
    event.preventDefault()
    if (!gGame.isOn) return
    if (currCell.isShown) return

    if (currCell.isMarked) {
        elCell.innerText = ''
        currCell.isMarked = false
        gGame.markedCount--
    } else {
        elCell.innerText = FLAG
        currCell.isMarked = true
        gGame.markedCount++
    }
}
function onCellClicked(elCell, i, j) {
    var currCell = gBoard[i][j]

    if (!gGame.isOn) return
    if (elCell.innerText === FLAG) return
    if (currCell.isShown) return
    if (currCell.isMarked) return
    if (gFirstCell) {
        gFirstCell = false;
        randomBomb()
        setMinesNegsCount(gBoard)
    }

    if (currCell.isMine) {
        gLives--
        renderLives()
        if (gLives <= 0) {
            checkGameOver()
        }

        elCell.innerText = BOMB
        currCell.isShown = true
        elCell.style.backgroundColor = 'red'

    } else {
        elCell.innerText = currCell.minesAroundCount
        gGame.shownCount++
        currCell.isShown = true
        elCell.classList.add(`is-${currCell.minesAroundCount}`)
        checkVictory()

    }

    console.log(gBoard)
}


function checkGameOver() {
    console.log('You Lost!')
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isMine) {
                currCell.isShown = true;
            }
        }
    }

    gGame.isOn = false;
}

function checkVictory() {
    var isVictory = true;

    // Check if all cells without mines are shown
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var currCell = gBoard[i][j];
            if (!currCell.isMine && !currCell.isShown) {
                isVictory = false;
                break;
            }
        }
        if (!isVictory) {
            break;
        }
    }

    if (isVictory) {
        console.log('You Won!');
        gGame.isOn = false;
    }
}

function expandShown(elCell, i, j) {
    if (!gGame.isOn) return
    if (elCell.innerText === FLAG) return
    if (elCell.innerText === BOMB) return
    if (elCell.innerText === '0') {
        checkVictory()
        // Helper function to reveal a cell

        function revealCell(rowIdx, colIdx) {
            if (rowIdx < 0 || rowIdx >= gLevel.SIZE || colIdx < 0 || colIdx >= gLevel.SIZE) return

            const cell = gBoard[rowIdx][colIdx]
            const ElCell = document.querySelector(`[data-i = "${rowIdx}"][data-j="${colIdx}"]`)

            if (rowIdx === i - 1 || colIdx === j - 1) {
                const neighborCell = gBoard[rowIdx][colIdx];
                const neighborElCell = document.querySelector(`[data-i="${rowIdx}"][data-j="${colIdx}"]`);
                neighborElCell.className = setCellClass(neighborCell, rowIdx, colIdx);
            }

            if (cell.isShown || cell.isMarked) return

            ElCell.innerText = cell.minesAroundCount
            gGame.shownCount++
            cell.isShown = true

            // Recursively expand if the cell has no mines around it
            if (cell.minesAroundCount === 0) expandShown(ElCell, rowIdx, colIdx)
        }

        // Iterate over neighboring cells
        for (let row = i - 1; row <= i + 1; row++) {
            for (let col = j - 1; col <= j + 1; col++) {
                if (row === i && col === j) continue

                revealCell(row, col);
            }
        }
    }
}