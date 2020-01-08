const difficultyEasyRadio = document.querySelector('#difficultyEasy');
const difficultyNormalRadio = document.querySelector('#difficultyNormal');
const difficultyExpertRadio = document.querySelector('#difficultyExpert');

const easyDifficultyConst = 8.1;
const normalDifficultyConst = 6.4;
const expertDifficultyConst = 4.85;

const rowAmount = document.getElementById('rowAmount');
const cellAmount = document.getElementById('cellAmount');

let field = document.createElement('table');
field.style.margin = '30px auto 10px';
field.style.borderCollapse = 'collapse';


function createCell(cellAmount, tr) {
    for (let i = 0; i < cellAmount; i++) {
        let td = document.createElement('td');
        td.style.cssText =
            `border: 1px solid black;
                  width: 28px;
                 height: 28px;
                `;
        td.className = 'cell';
        td.onclick = function () {
            clickCell(this);
        };
        let mine = document.createAttribute("data-mine");
        mine.value = "false";
        td.setAttributeNode(mine);

        td.oncontextmenu = function () {
            td.classList.toggle('flag');
            td.innerHTML = '&#128681;';
            checkLevelCompleted();
            return false;
        };
        tr.append(td);
    }
}

function blockField() {
    let cells = Array.from(document.querySelectorAll('.cell'));
    for (let cell of cells) {
        cell.onclick = '';
        cell.oncontextmenu = '';
    }
}

function createField(rowAmount, cellAmount) {
    field.innerHTML = "";
    for (let i = 0; i < rowAmount; i++) {
        let tr = document.createElement('tr');
        field.append(tr);
        createCell(cellAmount, tr);
    }
    document.querySelector('#mineDiv').style.display = 'block';
    document.body.append(field);
}

function showField() {
    createField(rowAmount.value, cellAmount.value);
}

function getMinesAmount() {
    if (difficultyEasyRadio.checked) {
        return Math.round(rowAmount.value * cellAmount.value / easyDifficultyConst);
        // return 20;
    }
    if (difficultyNormalRadio.checked) {
        return Math.round(rowAmount.value * cellAmount.value / normalDifficultyConst);
    }
    if (difficultyExpertRadio.checked) {
        return Math.round(rowAmount.value * cellAmount.value / expertDifficultyConst);
    }
}

function getMines() {
    let cell = Array.from(document.querySelectorAll('.cell'));

    for (let i = 0; i < getMinesAmount(); i++) {
        let randomPosition = Math.floor(Math.random() * rowAmount.value * cellAmount.value);
        if (cell[randomPosition].classList.contains('mine')) {
            i--
        } else {
            cell[randomPosition].classList.add('mine');
            cell[randomPosition].setAttribute('data-mine', 'true');
        }
    }
}


function showMines() {
    let mines = document.querySelectorAll('.mine');
    for (let mine of mines) {
        mine.innerHTML = '&#128163;';
        mine.style.content = '\1F4A3';
        mine.style.backgroundColor = 'red';
    }
}

function clickCell(td) {
    if (td.getAttribute("data-mine") === "true") {
        showMines();
        td.style.border = '3px solid yellow';
        blockField();
        showModal('lose');
    } else {
        td.classList.add('pressed');
        td.onclick = '';
        let mineCount = 0;
        let cellRow = td.parentNode.rowIndex;
        let cellCol = td.cellIndex;

        for (let i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, document.getElementById('rowAmount').value - 1); i++) {
            for (let j = Math.max(cellCol - 1, 0); j <= Math.min(cellCol + 1, document.getElementById('cellAmount').value - 1); j++) {
                if (field.rows[i].cells[j].getAttribute('data-mine') === 'true') {
                    mineCount++
                }
            }
        }

        td.innerHTML = mineCount;


        if (mineCount === 0) {
            for (let i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, document.getElementById('rowAmount').value - 1); i++) {
                for (let j = Math.max(cellCol - 1, 0); j <= Math.min(cellCol + 1, document.getElementById('cellAmount').value - 1); j++) {
                    // Рекурсивный вызов для неоткрытых ячеек
                    if (field.rows[i].cells[j].innerHTML === "") clickCell(field.rows[i].cells[j]);
                }
            }
        }
        checkLevelCompleted();
    }
}

function checkLevelCompleted() {
    let flags = Array.from(document.querySelectorAll('.flag'));
    let mines = Array.from(document.querySelectorAll('.mine'));
    minesLeft();
    if (flags.length === mines.length && flags.sort().every(function (value, index) {
        return value === mines.sort()[index]
    })) {
        showModal('win');
    }
}

function minesLeft() {
    document.querySelector('#mineLeft').value = getMinesAmount() - Array.from(document.querySelectorAll('.flag')).length;
}

function showModal(result) {
    if (result === 'lose') {
        document.querySelector('#mw').textContent = 'Вы проиграли';
    } else if (result === 'win') {
        document.querySelector('#mw').textContent = 'Вы выиграли';
    }

    document.querySelector('#mw').style.display = 'block';
    document.querySelector('#bw').style.display = 'block';

    document.querySelector('#bw').onclick = function () {    // закрытие окна сделал по нажатию в любое место фона (вместо 'Х')
        document.querySelector('#mw').style.display = 'none';
        document.querySelector('#bw').style.display = 'none';
    };
}

document.getElementById('create').onclick = function () {
    showField();
    getMines();
    minesLeft();
};

