'use strict'

var gBoard = {
    minesAroundCount: 4,
    isShown: false,
    isMine: false,
    isMarked: true
}

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
    renderBoard(gBoard)
}

function buildBoard() {
    const board = []
    for (var i = 0; i < 4; i++) {
        board[i] = []
        for (var j = 0; j < 4; j++) {
            var cell = {}
            board[i][j] = cell

        }
    }
    return board
}

function setMinesNegsCount(board) { }

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr class="minesweeper-row" >\n`
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            const title = `Cell: ${i + 1}, ${j + 1}`
            strHTML += `\t<td data-i="${i}" data-j="${j}" title="${title}" class="cell" onclick="onCellClicked(this, ${i}, ${j})" ></td>\n`
        }
        strHTML += `</tr>\n`
    }
    // console.log(strHTML)

    const elCells = document.querySelector('.board-cells')
    elCells.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {
    console.log('Hi')
}

function onCellMarked(elCell) { }

function checkGameOver() { }

function expandShown(board, elcell, i, j) { }