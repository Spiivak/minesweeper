'use strict'

// Emojis for the game
const BOMB = '☢️'
const FLAG = '🚩'

const HAPPY = '😃'
const LOSE = '🤯'
const WIN = '😎'

const LIVE = '❤️'
const HINT = '💡'

var isVictory = false
var gFirstCell

var gBoard = []
var gLevel = {
    SIZE: 4,
    MINES: 2,
    LIVES: 1,
    HINTS: 1
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


// Loading the game and reseting it
function onInit() {
    isVictory = false
    gBoard = buildBoard()
    gFirstCell = true
    displayBombs()
    console.log('gBoard', gBoard)
    renderLives()
    renderHints()
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }

    renderBoard(gBoard)
}

// Building the Board
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


// Rendering the Board
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

// Displaying the Bombs amount in the screen
function displayBombs() {
    const elDisplay = document.querySelector('.display-bomb').innerText = gLevel.MINES
}

// Setting the class for the cell
function setCellClass(currCell, i, j) {
    var className = 'cell';

    if (currCell.isMine) {
        className += ' is-mine'
    }
    if (currCell.isShown) {
        className += ` is-shown`
    }
    if (currCell.isMarked) {
        className += ` is-marked`
    }
    if (currCell.minesAroundCount !== null) {
        className += ` is-${currCell.minesAroundCount}`;
    }

    return className;
}

// Expanding the shown cells
function newSize(elBtn) {
    if (elBtn.innerText === 'Beginner') {
        gLevel.SIZE = 4
        gLevel.MINES = 2
        gLevel.HINTS = 1
        gLevel.LIVES = 1
    } else if (elBtn.innerText === 'Medium') {
        gLevel.SIZE = 8
        gLevel.MINES = 14
        gLevel.HINTS = 2
        gLevel.LIVES = 2
    } else if (elBtn.innerText === 'Expert') {
        gLevel.SIZE = 12
        gLevel.MINES = 32
        gLevel.HINTS = 3
        gLevel.LIVES = 3
    } else {
        console.error('Invalid level')
    }
    onInit()
}

// Rendering the Lives
function renderLives() {
    var elLives = document.querySelector('.lives')
    var strHTML = ''
    for (var i = 0; i < gLevel.LIVES; i++) {
        strHTML += `<div class="life-${i}">${LIVE}</div>`
    }
    elLives.innerHTML = strHTML

}

function renderHints() {
    const elHints = document.querySelector('.hints')
    var strHTML = ''
    for (var i = 0; i < gLevel.HINTS; i++) {
        strHTML += `<div onclick="handleHints()" class="hints-${i}">${HINT}</div>`
    }
    elHints.innerHTML = strHTML
}



// TODO: Reveal negs 
function handleHints() {
    if (gLevel.HINTS > 0) {
        var emptyCells = getEmptyCell()

        if (emptyCells.length > 0 && !gFirstCell) {
            var randomIdx = getRandomInt(0, emptyCells.length - 1)
            var randomCell = emptyCells[randomIdx]
            var i = randomCell.i
            var j = randomCell.j

            const elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)

            // expandShown(elCell, i, j)
            console.log(elCell)
            elCell.innerText = gBoard[i][j].minesAroundCount
            elCell.style.backgroundColor = 'lightblue'
            gLevel.HINTS--
            renderHints()

            setTimeout(() => {
                // expandShown(elCell, i, j)
                elCell.innerText = ''
                elCell.style.backgroundColor = ''
            }, 3000)

        }
    }
}

function handleUndo() {
    if (gGame.shownCount > 0) {
        gGame.shownCount--
        var elCell = document.querySelector('.is-shown')
        elCell.innerText = ''
        elCell.classList.remove('is-shown')
        elCell.classList.remove('is-mine')
        elCell.classList.remove('is-1')
        elCell.classList.remove('is-2')
        elCell.classList.remove('is-3')
        elCell.classList.remove('is-4')
        elCell.classList.remove('is-5')
        elCell.classList.remove('is-6')
        elCell.classList.remove('is-7')
        elCell.classList.remove('is-8')
        elCell.classList.remove('is-9')
    }
}

function getEmptyCell() {
    var emptyCell = []

    for (let i = 0; i < gLevel.SIZE; i++) {
        for (let j = 0; j < gLevel.SIZE; j++) {
            var currCell = gBoard[i][j]
            if (!currCell.isMine && !currCell.isMarked && !currCell.isShown) {
                emptyCell.push({ i, j })
            }

        }

    }

    return emptyCell
}

// Counts the bombs around the cell
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

// Setting the mines amount around count
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

// Rendering the mines amount around the cell
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

// Right click to flag cell
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

// Actions on cell clicked
function onCellClicked(elCell, i, j) {
    var currCell = gBoard[i][j]

    if (!gGame.isOn) return //if game is not on
    if (elCell.innerText === FLAG) return // if cell is flagged
    if (currCell.isShown) return // if cell is shown
    if (currCell.isMarked) return // if cell is marked
    if (gFirstCell) { // if first cell true
        gFirstCell = false;
        randomBomb()
        setMinesNegsCount(gBoard)
    }

    if (currCell.isMine) {
        gLevel.LIVES--
        renderLives()
        if (gLevel.LIVES < 0) {
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

// TODO: FIX THE REVEAL ALL BOMB ON LOST
function checkGameOver() {
    const elEmotion = document.querySelector('.emotion')
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isMine) {
                currCell.isShown = true;
            }
        }
    }
    console.log('You Lost!')
    elEmotion.innerText = LOSE
    gGame.isOn = false;
}

// checks if the game is won
function checkVictory() {
    const elEmotion = document.querySelector('.emotion')
    var isVictory = true
    // Check if all cells without mines are shown or marked
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var currCell = gBoard[i][j];
            if (!currCell.isMine && !currCell.isShown && !currCell.isMarked) {
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
        elEmotion.innerText = WIN
        gGame.isOn = false;

    }
}

function darkmode() {
    const icon = document.querySelector('.icon');
    document.body.classList.toggle('darkmode')

    if (document.body.classList.contains('darkmode')) {
        icon.innerHTML = `<i class="ri-moon-fill"></i>`
    } else {
        icon.innerHTML = `<i class="ri-sun-line"></i>`
    }
}

// Revealing the cells
function expandShown(elCell, i, j) {
    if (!gGame.isOn) return
    if (elCell.innerText === FLAG) return
    if (elCell.innerText === BOMB) return
    if (elCell.innerText === '0') {
        checkVictory()


        // Iterate over neighboring cells
        for (let row = i - 1; row <= i + 1; row++) {
            for (let col = j - 1; col <= j + 1; col++) {
                if (row === i && col === j) continue

                revealCell(row, col);
            }
        }
    }
}

function revealCell(rowIdx, colIdx) {
    if (rowIdx < 0 || rowIdx >= gLevel.SIZE || colIdx < 0 || colIdx >= gLevel.SIZE) return;

    const cell = gBoard[rowIdx][colIdx];
    const elCell = document.querySelector(`[data-i="${rowIdx}"][data-j="${colIdx}"]`);

    // Update the class for the revealed cell
    elCell.className = setCellClass(cell, rowIdx, colIdx);

    if (cell.isShown || cell.isMarked) return;

    elCell.innerText = cell.minesAroundCount;
    gGame.shownCount++;
    cell.isShown = true;

    // Recursively expand if the cell has no mines around it
    if (cell.minesAroundCount === 0) {
        for (let i = rowIdx - 1; i <= rowIdx + 1; i++) {
            for (let j = colIdx - 1; j <= colIdx + 1; j++) {
                revealCell(i, j);
            }
        }
    }
}