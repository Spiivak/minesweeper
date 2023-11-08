'use strict'

const BOMB = '☢️'
const FLAG = '🚩'


var gBoard = []


/* 
# Im using gLevel variable so in future i can resize the board, and
# redefine the amount of bombs in my board
*/
var gLevel = {
    SIZE: 4,
    MINES: 2
}


/*
# Im using the gGame variable so in future i can check if game is on(running)
# or off(lost/stoped game), the ShownCount is
# the marked count is the amount of flags i have
# secsPassed are the amount of time in seconds past
*/
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}



/*
# This function onInit will build the board, generate in random locations bombs
# count negs around and render the board
*/
function onInit() {
    gBoard = buildBoard()

    randomBomb()
    setMinesNegsCount(gBoard)
    console.log('gBoard', gBoard)
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }

    renderBoard(gBoard)
}

/* 
# Build Board Function =>
# I have a board const to help me save the board im building
# Im running in loop on the gLevel.SIZE, means the loop will run
# X time depends on the SIZE argument.
# for each line, im generating another array, so we have array > array > object
# var cel contains things ill need to use in future:
# minesAroundCount: null => after board is rendered it will save the count 
# of bombs around the cell.
# isShown: false => does the cell is reaviled yet?
# isMine: false => does the cell is bomb?
# isMarket: false => does the cell is flagged?
#
# board[i][j] = cell => in each line and row ill send a cell with the arguments above
#
# return borad => will return the built board
*/

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
    // board[0][0].isMine = true
    // board[0][1].isMine = true
    return board
}

/*
# Render Board (board) Function
# Render board is a function which renders the board and get parameter of the board
# I have created in BuildBoard function
#
# I'm var strHTML to render html to the DOM
# 
# First loop is for the rows, im running until the end of the board.length
# for each row im adding a <tr class="minesweeper-row"> tag which contains
# a class for each row
# In the second loop im running on the board culms and i define a const
# currCell = board[i][j]
*/

function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr class="minesweeper-row">\n`
        for (var j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]
            const title = `Cell: ${i + 1}, ${j + 1}`
            var className = `cell cell-${i}-${j}`
            if (currCell.isMine) className += ' mine'
            strHTML += `\t<td title="${title}" class="${className}" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(this, event, ${i}, ${j}); return false;"></td>\n`

        }
        strHTML += `</tr>\n`
    }

    const elCells = document.querySelector('.board-cells')
    elCells.innerHTML = strHTML
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
    // }

    onInit()
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

    if (currCell.isMine) {
        elCell.innerText = BOMB
        currCell.isShown = true
        console.log('You found a bomb!')
        checkGameOver()
    } else {
        // setMinesNegsCount(gBoard)
        elCell.innerText = currCell.minesAroundCount
        gGame.shownCount++
        currCell.isShown = true
        checkVictory()
    }
    console.log(gBoard)
}


function checkGameOver() {
    console.log('You Lost!')
    gGame.isOn = false
}

function checkVictory() {
    if (gGame.markedCount === gLevel.MINES && gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gLevel.MINES) {
        console.log('You Won!')
        gGame.isOn = false
    }
}

// expandShown(board, elcell, i, j)

// function expandShown(elCell, i, j) {
//     var board = gBoard
//     var rowIdx = i
//     var colIdx = j

//     for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
//         if (i < 0 || i >= board.length) continue
//         for (var j = colIdx - 1; j <= colIdx + 1; j++) {
//             if (i === rowIdx && j === colIdx) continue
//             if (j < 0 || j >= board[0].length) continue
//             var currCell = board[i][j]
//             console.log('currCell', currCell)
//             currCell.isShown = true
//             elCell.innerText = currCell.minesAroundCount
//             gGame.shownCount++
//             // const currSeat = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
//             // currSeat.classList.add('highlight')
//         }
//     }
// }