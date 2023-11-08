'use strict'

const BOMB = '#'


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
    console.log('gBoard', gBoard)
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

    board[0][0].isMine = true
    board[0][1].isMine = true
    return board
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

function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr class="minesweeper-row">\n`
        for (var j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]
            const title = `Cell: ${i + 1}, ${j + 1}`
            var className = `cell cell-${i}-${j}`
            if (currCell.isMine) className += ' mine'
            strHTML += `\t<td title="${title}" class="${className}" onclick="onCellClicked(this, ${i}, ${j})" ></td>\n`
        }
        strHTML += `</tr>\n`
    }
    // console.log(strHTML)

    const elCells = document.querySelector('.board-cells')
    elCells.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {
    var currCell = gBoard[i][j]

    if (elCell.classList.contains('mine')) {
        elCell.innerText = BOMB
        console.log('You found a bomb!')
    } else {
        setMinesNegsCount(gBoard)
        elCell.innerText = currCell.minesAroundCount
        currCell.isShown = true
        console.log('Good Job!')
    }
    console.log(gBoard)
}

function onCellMarked(elCell) { }

function checkGameOver() { }

function expandShown(board, elcell, i, j) { }