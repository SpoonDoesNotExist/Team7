//Цвета для состояний.
let stateColorsMap = new Map();
stateColorsMap.set("empty", "#a49582");
stateColorsMap.set("start", "#bc7837");
stateColorsMap.set("finish", "#3f0d16");
stateColorsMap.set("wall", "#2d2f28");
stateColorsMap.set("closed", "#797474");
stateColorsMap.set("open", "#5f9ea0");
stateColorsMap.set("path", "#FFFFFF");


let cutCornersCheck = document.getElementById('cutAngles');

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
        this.G = 100000;
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

        //this.searchAlgorithm = null;

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

cutCornersCheck.onchange = function() {
    if (board) {
        board.cutCorners = this.checked;

        console.log(`Current CUT CORNER state: ${this.checked}`);
    }
}


function DrawBoardElemState(matrix_elem, coord) {
    console.log("----DRAW B EL------")
    console.log(matrix_elem.coord);
    console.log(matrix_elem.state);
    board.field.rows[coord.i].cells[coord.j].style.backgroundColor = stateColorsMap.get(matrix_elem.state)
}

function DrawBoardElem(matrix_elem, coord) {

    if (matrix_elem.state != 'finish') {
        matrix_elem.state = 'open';
    }

    board.field.rows[coord.i].cells[coord.j].style.backgroundColor = stateColorsMap.get(matrix_elem.state)

    let fe = document.getElementById(`f${coord.i}-${coord.j}`);
    fe.innerText = matrix_elem.F;

    fe = document.getElementById(`g${coord.i}-${coord.j}`);
    fe.innerText = matrix_elem.G;

    fe = document.getElementById(`h${coord.i}-${coord.j}`);
    fe.innerText = matrix_elem.H;
}

/*
function DrawClosedElem(coord) {
    board.field.rows[coord.i].cells[coord.j].style.backgroundColor = stateColorsMap.get('closed');
}*/


function removeOld(state) {
    switch (state) {
        case "start":
            {
                if (board.startCell) {

                    console.log(board.startCell);

                    let coord = board.startCell.coord;

                    console.log(coord);

                    board.matrix[coord.i][coord.j].state = 'empty';
                    DrawBoardElemState(board.matrix[coord.i][coord.j], coord);
                }
                break;
            }
        case "finish":
            {
                if (board.finishCell) {
                    let coord = board.finishCell.coord;

                    board.matrix[coord.i][coord.j].state = 'empty';
                    DrawBoardElemState(board.matrix[coord.i][coord.j], coord);
                }
                break;
            }
        case "wall":
            {

            }
        case "empty":
            {

            }
    }
}




let wereMousedown = false;

function doMouseMoveFalse() {
    wereMousedown = false;
}

function doMouseMoveTrue() {
    wereMousedown = true;
}


function boardElementClickHandler(t) {

    if (!wereMousedown)
        return;

    console.log(`Board Elem Click Handler...`)

    let id = t.id.split('-');
    let elementCoord = new Point(id[0], id[1]);
    let matrix_elem = board.matrix[elementCoord.i][elementCoord.j];

    removeOld(board.current_state);

    switch (board.current_state) {
        case 'start':
            {
                board.startID = t.id;
                board.startCell = new Cell(elementCoord.i, elementCoord.j);
                //board.matrix[elementCoord.i][elementCoord.j].state = 'start';
                break;
            }
        case 'finish':
            board.finishID = t.id;
            board.finishCell = new Cell(elementCoord.i, elementCoord.j);
            //board.matrix[elementCoord.i][elementCoord.j].state = 'finish';
            break;
        case 'wall':
            board.wallSet.add(t.id);
            //board.matrix[elementCoord.i][elementCoord.j].state = 'wall';
            break;
        case 'empty':
            //board.matrix[elementCoord.i][elementCoord.j].state = 'empty';
            break
    }

    console.log(t.state);

    switch (board.matrix[elementCoord.i][elementCoord.j].state) {
        case 'start':
            board.startID = null;
            board.startCell = null;
            break;
        case 'finish':
            board.finishID = null;
            board.finishCell = null;
            break;
        case 'wall':
            board.wallSet.delete(t.id);
            break;
        case 'empty':
            break;
    }

    if (matrix_elem.state == board.current_state) {
        matrix_elem.state = "empty";
    } else {
        matrix_elem.state = board.current_state;
    }

    DrawBoardElemState(matrix_elem, elementCoord);
}


document.body.onmouseup = doMouseMoveFalse;

//Создает доску нужного размера.
function generateField() {
    console.log(`Generating field...`)

    let n = board.size_m;

    //Доска, на которой находятся элементы. (является table).
    board.field = document.getElementById("board_block")

    board.field.innerHTML = "";
    board.field.hidden = false;

    for (let i = 0; i < n; i++) {
        let board_row = document.createElement("tr"); //Создаем строку.

        for (let j = 0; j < n; j++) {
            let board_elem = document.createElement('td'); //Создаем элемент стороки.

            board_elem.className = "board_elem";
            board_elem.name = board.matrix[i][j].state;
            board_elem.id = `${i}-${j}`;
            board_elem.style.backgroundColor = stateColorsMap.get(board.matrix[i][j].state);

            //board_elem.onclick = boardElementClickHandler;        //Обработчик нажатия на элемент.
            //board_elem.style.fontSize = 300 / n + "px";

            board_elem.onmousedown = function() {
                doMouseMoveTrue();
                boardElementClickHandler(this);
            };
            board_elem.onmouseout = function() {
                boardElementClickHandler(this);
            }

            let f = document.createElement('div');
            f.className = "f";
            f.id = `f${board_elem.id}`;
            board_elem.append(f);


            let g = document.createElement('div');
            g.className = "g";
            g.id = `g${board_elem.id}`;
            board_elem.append(g);


            let h = document.createElement('div');
            h.className = "h";
            h.id = `h${board_elem.id}`;
            board_elem.append(h)


            board_elem.value = "<span class=\"f\">f</span><br>";

            board_row.append(board_elem); //Добавляем элемент в строку.
        }
        board.field.append(board_row); //Добавляем всю строку в таблицу.
    }

    console.log(`Field has been created`);
}


//Валидация введенного размера.
function checkSizeValue(size_value) {
    if (size_value <= 0) {

        console.log(`Invalid size value ${size_value}`);

        size.value = "";
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


let drawPathIterSleep = 70;

async function DrawPath(clearPath = false) {
    console.log("Drawing path...");

    let e = board.matrix[board.finishCell.coord.i][board.finishCell.coord.j];
    e = board.matrix[e.parent.i][e.parent.j];

    let fieldElem;
    while (e.state != "start") {

        await sleep(drawPathIterSleep);
        fieldElem = document.getElementById(`${e.coord.i}-${e.coord.j}`)

        if (clearPath)
            fieldElem.style.backgroundColor = stateColorsMap.get("empty");
        else
            fieldElem.style.backgroundColor = stateColorsMap.get('path');

        e = board.matrix[e.parent.i][e.parent.j];
    }
    console.log("Path has been drawn");
}


function allowed(i, j) {
    return 0 <= i && i < board.size_m && 0 <= j && j < board.size_n;
}


let currentHeuristics = 'manhattan';

function manhattan(p1, p2) {
    return ortoghonalWeight * (Math.abs(p1.i - p2.i) + Math.abs(p1.j - p2.j));
}

function euclidean(p1, p2) {
    return Math.floor(Math.sqrt(Math.pow(p1.i - p2.i, 2) + Math.pow(p1.j - p2.j, 2))) * diagonalWeight;
}

let heuristicsMap = new Map();
heuristicsMap.set('manhattan', manhattan);
heuristicsMap.set('euclidean', euclidean);

function calculateHeuristics(p1, p2) {
    return heuristicsMap.get(currentHeuristics)(p1, p2);
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


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


let cut_corner_checks = new Map();
cut_corner_checks.set(`${1}:${1}`, [
    [0, -1],
    [-1, 0]
]);
cut_corner_checks.set(`${1}:${-1}`, [
    [0, 1],
    [-1, 0]
]);
cut_corner_checks.set(`${-1}:${-1}`, [
    [0, 1],
    [1, 0]
]);
cut_corner_checks.set(`${-1}:${1}`, [
    [0, -1],
    [1, 0]
]);


function cutCornerCheck(i, j, ci, cj) {

    console.log(`CUT CORNER CHECK: ${i} ${j}`);

    if (board.cutCorners) {
        if (cut_corner_checks.has(`${ci}:${cj}`)) {
            let check = cut_corner_checks.get(`${ci}:${cj}`);

            return !board.wallSet.has(`${i + check[0][0]}-${j + check[0][1]}`) || !board.wallSet.has(`${i + check[1][0]}-${j + check[1][1]}`)
        }
        return true;
    } else {
        if (cut_corner_checks.has(`${ci}:${cj}`)) {
            let check = cut_corner_checks.get(`${ci}:${cj}`);

            return !board.wallSet.has(`${i + check[0][0]}-${j + check[0][1]}`) && !board.wallSet.has(`${i + check[1][0]}-${j + check[1][1]}`)
        }
        return true;
    }
}


//---------------------------------------------------------------------------------MAZE
function getTargetPointsSet(matrix) {
    let set = new Set();

    for (let i = 0; i < matrix.length; i += 2) {
        for (let j = 0; j < matrix[0].length; j += 2) {
            set.add(`${i}:${j}`);
            board.wallSet.add(`${i}-${j}`);
        }
    }
    return set;
}

function getTractorsArray(n) {
    let arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(new Point(0, 0));
    }
    return arr
}


let moveDirections = [
    [0, 2],
    [2, 0],
    [-2, 0],
    [0, -2],
];

function getMoveDirection(tractor) {
    let allowedDirections = [];

    for (d of moveDirections) {
        if (allowed(tractor.i + d[0], tractor.j + d[1]))
            allowedDirections.push([d[0], d[1]]);
    }
    return allowedDirections[Math.floor(Math.random() * allowedDirections.length)];
}


function wallWholeBoard() {
    for (let i = 0; i < board.size_m; i++) {
        for (let j = 0; j < board.size_n; j++) {
            board.matrix[i][j].state = "wall";
            board.wallSet.add(`${i}-${j}`);
        }
    }
}


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


function checkEvenCase() {
    if (board.size_m % 2 == 0) {
        for (let j = 0; j < board.size_n; j++) {
            if (getRandomInt(2)) {
                board.matrix[board.size_m - 1][j].state = 'empty';
                board.wallSet.delete(`${board.size_m - 1}-${j}`);
            }
        }
    }
    if (board.size_n % 2 == 0) {
        for (let i = 0; i < board.size_m; i++) {
            if (getRandomInt(2)) {
                board.matrix[i][board.size_n - 1].state = 'empty';
                board.wallSet.delete(`${i}-${board.size_n - 1}`);
            }
        }
    }
}


let tractorsCount = 15;

async function buildMaze() {
    if (board) {
        board = new Board(board.size_m, board.size_n);

        wallWholeBoard();

        let targetPointsSet = getTargetPointsSet(board.matrix);

        let tractors = getTractorsArray(tractorsCount);

        board.matrix[0][0].state = 'empty';
        targetPointsSet.delete(`0:0`);
        board.wallSet.delete(`0-0`);

        while (targetPointsSet.size > 0) {

            console.log(`IN WHILE: Set size: ${targetPointsSet.size}`);

            for (let i = 0; i < tractorsCount; i++) {
                let tractor = tractors[i];

                let [di, dj] = getMoveDirection(tractor);

                if (board.matrix[tractor.i + di][tractor.j + dj].state == 'wall') {
                    board.matrix[tractor.i + di][tractor.j + dj].state = 'empty';
                    board.wallSet.delete(`${tractor.i + di}-${tractor.j + dj}`);

                    board.matrix[tractor.i + di / 2][tractor.j + dj / 2].state = 'empty';
                    board.wallSet.delete(`${tractor.i + di / 2}-${tractor.j + dj / 2}`);
                }

                targetPointsSet.delete(`${tractor.i + di}:${tractor.j + dj}`);
                console.log(`Delete ${tractor.i + di}:${tractor.j + dj}`);
                console.log(targetPointsSet);

                tractors[i].i = tractor.i + di;
                tractors[i].j = tractor.j + dj;
            }
            //generateField();
            //await sleep(1);
        }
        checkEvenCase();
        generateField();

        console.log('Maze generation has finished')
    } else {
        alert("(maze) Please define board size");
    }
}

let buildMazeButton = document.getElementById('build_maze');
buildMazeButton.onclick = buildMaze;
//-----------------------------------------------------------------------------------------------------

function setCloseState(coord) {
    if (board.startCell.coord.i != coord.i || board.startCell.coord.j != coord.j) {
        board.matrix[coord.i][coord.j].state = 'closed';
    }
}

let whileIterSleep = 50;

async function A_STAR_ALGORITHM() {
    board.startCell = board.matrix[board.startCell.coord.i][board.startCell.coord.j];
    board.finishCell = board.matrix[board.finishCell.coord.i][board.finishCell.coord.j];

    let openList = new Map();
    let closeList = new Set();

    board.startCell.G = 0;
    board.matrix[board.startCell.coord.i][board.startCell.coord.j].G = 0;

    openList.set(`${board.startCell.coord.i}-${board.startCell.coord.j}`, board.startCell);

    let currCell;
    let currentIteration = 0;

    while (openList.size > 0) {
        currentIteration += 1;
        await sleep(whileIterSleep);

        console.log(`------------------------------`)
        console.log(`STEP ${currentIteration}`)

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

        for (let c in checks) {

            let curr_checks = checks[c][0];
            let weight = checks[c][1];

            for (let c in curr_checks) {
                c = curr_checks[c];

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

                        //board.matrix[i + c[0]][j + c[1]].state = 'open';
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

// // Кнопки движения по диагонали и среза углов
// let diagonal = document.getElementById('diagonal');
// let additSettings = document.getElementById('additSettings');

// diagonal.onclick = () => {
//     additSettings.hidden = !additSettings.hidden;
// }

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
}