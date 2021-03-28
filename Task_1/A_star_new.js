import { DrawBoardElemState, DrawBoardElem, DrawPath, generateField } from './board.js';
import { calculateHeuristics } from './heuristics.js';
import { buildMaze } from './build_maze.js';
import { cutCornerCheck } from './cut_corner_check.js';

export {
    Board,
    Point,
    board,
    tractorsCount,
    allowed,
    generateField,
    currentHeuristics,
    ortoghonalWeight,
    diagonalWeight,
    stateColorsMap,
    drawPathIterSleep,
    sleep,
    wereMousedown,
    Cell,
    doMouseMoveTrue
};




function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


//Цвета для состояний.
let stateColorsMap = new Map();
stateColorsMap.set("empty", "#a49582");
stateColorsMap.set("start", "#bc7837");
stateColorsMap.set("finish", "#3f0d16");
stateColorsMap.set("wall", "#2d2f28");
stateColorsMap.set("closed", "#797474");
stateColorsMap.set("open", "#5f9ea0");
stateColorsMap.set("path", "#FFFFFF");


class Point {
    constructor(i, j) {
        this.i = i;
        this.j = j;
    }
}

class Cell {
    constructor(i, j) {
        this.coord = new Point(i, j);
        this.F = 0;
        this.G = 0;
        this.H = 0;
        this.parent = new Point(-1, -1);
        this.state = 'empty';
    }
}

class Board {
    constructor(m, n) {
        this.size_m = m;
        this.size_n = n;

        this.cutCorners = cutCornersCheck.checked;

        this.startID = null
        this.finishID = null

        this.startCell = null;
        this.finishCell = null;

        this.wallSet = new Set();
        this.current_state = null;

        this.field = null;

        this.matrix = new Array(m);
        for (let i = 0; i < m; i++) {
            this.matrix[i] = new Array(n);
            for (let j = 0; j < n; j++) {
                this.matrix[i][j] = new Cell(i, j);
            }
        }
    }
}


let board = null;
let cutCornersCheck = document.getElementById('cutAngles');

cutCornersCheck.onchange = function() {
    if (board) {
        board.cutCorners = this.checked;

        console.log(`Current CUT CORNER state: ${this.checked}`);
    }
}


let wereMousedown = false;

function doMouseMoveFalse() {
    wereMousedown = false;
}

function doMouseMoveTrue() {
    wereMousedown = true;
}

document.body.onmouseup = doMouseMoveFalse;


//Валидация введенного размера.
function checkSizeValue(size_value) {
    if (size_value <= 0) {
        console.log(`Invalid size value ${size_value}`);
        size.placeholder = "Invalid size";
        return false;
    }
    return true;
}


//Кнопка ввода размера доски.
let size_button = document.getElementById("size_button")

//Поле ввода размера доски.
let size_form = document.getElementById("size");

size_button.onclick = () => {
    if (checkSizeValue(size_form.value)) {

        console.log(`Size value is: ${size_form.value}`);

        board = new Board(size_form.value, size_form.value);

        generateField();
    }
}


function allowed(i, j) {
    return 0 <= i && i < board.size_m && 0 <= j && j < board.size_n;
}


let drawPathIterSleep = 50;
let currentHeuristics = 'manhattan';
let tractorsCount = null;

let buildMazeButton = document.getElementById('build_maze');

buildMazeButton.onclick = function() {
    if (board) {
        board = new Board(board.size_m, board.size_n);
        tractorsCount = Math.floor(Math.sqrt(board.size_m * board.size_n));
        buildMaze();
    } else {
        alert("(maze) Please define board size");
    }
}



function setCloseState(coord) {
    if (board.startCell.coord.i != coord.i || board.startCell.coord.j != coord.j) {
        board.matrix[coord.i][coord.j].state = 'closed';
    }
}

let whileIterSleep = 450;

let ortoghonalWeight = 10;
let diagonalWeight = 14;

let ortoghonal_checks = [
    [0, 1],
    [1, 0],
    [-1, 0],
    [0, -1],
];
let diagonal_checks = [
    [1, 1],
    [-1, 1],
    [-1, -1],
    [1, -1]
];
let checks = [
    [diagonal_checks, diagonalWeight],
    [ortoghonal_checks, ortoghonalWeight]
];

async function A_STAR_ALGORITHM() {
    board.startCell = board.matrix[board.startCell.coord.i][board.startCell.coord.j];
    board.finishCell = board.matrix[board.finishCell.coord.i][board.finishCell.coord.j];

    let openList = new Map();
    let closeList = new Set();

    board.startCell.G = 0;
    board.matrix[board.startCell.coord.i][board.startCell.coord.j].G = 0;

    openList.set(`${board.startCell.coord.i}-${board.startCell.coord.j}`, board.startCell);

    let currCell;

    while (openList.size > 0) {
        await sleep(whileIterSleep);

        let openListArray = [...openList.entries()];

        currCell = openListArray.reduce((acc, curr) => {
            if (acc[1].F < curr[1].F)
                return acc;
            return curr;
        })[1];

        openList.delete(`${currCell.coord.i}-${currCell.coord.j}`);

        let i = Number(currCell.coord.i);
        let j = Number(currCell.coord.j);

        closeList.add(`${i}-${j}`);
        setCloseState(currCell.coord);
        DrawBoardElemState(currCell, currCell.coord);

        for (let checkPair of checks) {

            let curr_checks = checkPair[0];
            let weight = checkPair[1];

            for (let c of curr_checks) {

                if (allowed(i + c[0], j + c[1]) && cutCornerCheck(i + c[0], j + c[1], c[0], c[1])) {
                    if (!board.wallSet.has(`${i + c[0]}-${j + c[1]}`) && !closeList.has(`${i + c[0]}-${j + c[1]}`)) {

                        if (openList.has(`${i + c[0]}-${j + c[1]}`)) {
                            let e = openList.get(`${i + c[0]}-${j + c[1]}`);

                            if (board.matrix[i][j].G + weight < e.G) {
                                board.matrix[i + c[0]][j + c[1]].G = +board.matrix[i][j].G + weight;
                                board.matrix[i + c[0]][j + c[1]].F = +board.matrix[i + c[0]][j + c[1]].G + board.matrix[i + c[0]][j + c[1]].H;

                                board.matrix[i + c[0]][j + c[1]].parent = board.matrix[i][j].coord;

                                openList.set(`${i + c[0]}-${j + c[1]}`, board.matrix[i + c[0]][j + c[1]]);
                            }
                        } else {
                            board.matrix[i + c[0]][j + c[1]].H = calculateHeuristics(board.matrix[i + c[0]][j + c[1]].coord, board.finishCell.coord);
                            board.matrix[i + c[0]][j + c[1]].G = Number(board.matrix[i][j].G) + Number(weight);
                            board.matrix[i + c[0]][j + c[1]].F = Number(board.matrix[i + c[0]][j + c[1]].G) + board.matrix[i + c[0]][j + c[1]].H;

                            board.matrix[i + c[0]][j + c[1]].parent = board.matrix[i][j].coord;

                            openList.set(`${i + c[0]}-${j + c[1]}`, board.matrix[i + c[0]][j + c[1]]);
                        }
                        DrawBoardElem(board.matrix[i + c[0]][j + c[1]], board.matrix[i + c[0]][j + c[1]].coord);

                        if (board.finishCell.coord.i == i + c[0] && board.finishCell.coord.j == j + c[1]) {
                            DrawPath();
                            return;
                        }
                    }
                }
            }
        }
    }
    alert("PATH DOES NOT EXIST");
}


//Кнопка для запуска алгоритма.
let startAlgorithmButton = document.getElementById("start_alg");

function startAndFinishAreDefined() {
    if (board.startID && board.finishID) {
        return true;
    }
    alert("Please set start and finish points");

    return false;
}

startAlgorithmButton.onclick = async function() {
    if (board) {
        if (startAndFinishAreDefined()) { ///Если на доске есть начало и конец/
            await A_STAR_ALGORITHM();
        }
    } else {
        alert("Please set board size");
    }
}


let states = ["empty", "wall", "start", "finish"];

//Изменяет текущее состояние.
function changeState() {

    for (let stateButton of states) {
        stateButton = document.getElementById(`${stateButton}`);

        if (board.current_state == stateButton.name) {
            stateButton.className = `state ${stateButton.name}`;
            break;
        }
    }

    board.current_state = this.name;
    this.className += " activatedState";

    console.log(`Current state: ${board.current_state}`);
}

//Кнопки выбора состояния.
let state_empty = document.getElementById("empty");
let state_start = document.getElementById("start");
let state_finish = document.getElementById("finish");
let state_wall = document.getElementById("wall");

state_empty.onclick = changeState;
state_start.onclick = changeState;
state_finish.onclick = changeState;
state_wall.onclick = changeState;


function changeHeuristics() {
    currentHeuristics = this.value;
}

let euclidean_radio = document.getElementById('euclidean');
let manhattan_radio = document.getElementById('manhattan');

euclidean_radio.onclick = changeHeuristics;
manhattan_radio.onclick = changeHeuristics;


// Можно ввести максимум 2 цифры в размер поля
let sizeInput = document.getElementById('size');
sizeInput.oninput = function() {
    this.value = this.value.slice(0, this.maxLength);
    if (this.value == 0) {
        this.value = "";
    }
}


let iterSleep = document.getElementById('iteration_sleep');
iterSleep.oninput = function() {
    whileIterSleep = 500 - iterSleep.value;

    console.log(`#############################`);
    console.log(`While iter sleep: ${whileIterSleep}`);
    console.log(`#############################`);
}