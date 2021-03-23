//Цвета для состояний.
let stateColorsMap = new Map();
stateColorsMap.set("empty", "#5f9ea0");
stateColorsMap.set("start", "#bc7837");
stateColorsMap.set("finish", "#3f0d16");
stateColorsMap.set("wall", "#2d2f28");




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

        this.cutCorners = false;

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

function DrawBoardState(matrix_elem, coord) {
    board.field.rows[coord.i].cells[coord.j].style.backgroundColor = stateColorsMap.get(matrix_elem.state)
}

function DrawBoardElem(matrix_elem, coord) {
    board.field.rows[coord.i].cells[coord.j].style.backgroundColor = stateColorsMap.get(matrix_elem.state)

    let fe = document.getElementById(`f${coord.i}-${coord.j}`);
    fe.innerText = matrix_elem.F;

    fe = document.getElementById(`g${coord.i}-${coord.j}`);
    fe.innerText = matrix_elem.G;

    fe = document.getElementById(`h${coord.i}-${coord.j}`);
    fe.innerText = matrix_elem.H;
}

function removeOld(state) {
    switch (state) {
        case "start":
            {
                if (board.startCell) {

                    console.log(board.startCell);

                    let coord = board.startCell.coord;

                    console.log(coord);

                    board.matrix[coord.i][coord.j].state = 'empty';
                    DrawBoardState(board.matrix[coord.i][coord.j], coord);
                }
                break;
            }
        case "finish":
            {
                if (board.finishCell) {
                    let coord = board.finishCell.coord;

                    board.matrix[coord.i][coord.j].state = 'empty';
                    DrawBoardState(board.matrix[coord.i][coord.j], coord);
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
                break;
            }
        case 'finish':
            board.finishID = t.id;
            board.finishCell = new Cell(elementCoord.i, elementCoord.j);
            break;
        case 'wall':
            board.wallSet.add(t.id);
            break;
        case 'empty':
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


    DrawBoardState(matrix_elem, elementCoord);
}


document.body.onmouseup = doMouseMoveFalse;

//Создает доску нужного размера.
function generateField(n) {
    console.log(`Generating field...`)

    //Доска, на которой находятся элементы. (является table).
    board.field = document.getElementById("board_block")

    board.field.innerHTML = "";
    board.field.hidden = false;

    for (let i = 0; i < n; i++) {
        let board_row = document.createElement("tr"); //Создаем строку.

        for (let j = 0; j < n; j++) {
            let board_elem = document.createElement('td'); //Создаем элемент стороки.

            board_elem.className = "board_elem";
            board_elem.name = "empty";
            board_elem.id = `${i}-${j}`;

            //board_elem.onclick = boardElementClickHandler;        //Обработчик нажатия на элемент.
            //board_elem.style.fontSize = 300 / n + "px";

            board_elem.onmousedown = function() {
                doMouseMoveTrue();
                //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                boardElementClickHandler(this);
                //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

            };
            board_elem.onmousemove = function() {
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

        generateField(size_form.value);
    }
}


function DrawPath(clearPath = false) {
    let e = board.matrix[board.finishCell.coord.i][board.finishCell.coord.j];
    e = board.matrix[e.parent.i][e.parent.j];

    console.log("Drawing PATH>>>>")

    let fieldElem;
    while (e.state != "start") {
        console.log(e);

        fieldElem = document.getElementById(`${e.coord.i}-${e.coord.j}`)


        if (clearPath)
            fieldElem.style.backgroundColor = stateColorsMap("empty");
        else
            fieldElem.style.backgroundColor = "#FFFFFF";


        e = board.matrix[e.parent.i][e.parent.j];
    }
}


function allowed(i, j) {
    return 0 <= i && i < board.size_m && 0 <= j && j < board.size_n;
}

let ortoghonalWeight = 10;
let diagonalWeight = 14;



function manhattan(p1, p2) {
    return ortoghonalWeight * (Math.abs(p1.i - p2.i) + Math.abs(p1.j - p2.j));
}

function euclid(p1, p2) {
    return Math.floor(Math.sqrt(Math.pow(p1.i - p2.i, 2) + Math.pow(p1.j - p2.j, 2))) * diagonalWeight;
}

let heuristicMap = new Map();
heuristicMap.set('manhattan', manhattan);
heuristicMap.set('euclid', euclid);



let currentHeuristic = 'euclid';

function calculateHeuristic(p1, p2) {
    return heuristicMap.get(currentHeuristic)(p1, p2);
}




function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


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
        return true;
    } else {
        if (cut_corner_checks.has(`${ci}:${cj}`)) {
            let check = cut_corner_checks.get(`${ci}:${cj}`);

            return !board.wallSet.has(`${i + check[0][0]}-${j + check[0][1]}`) && !board.wallSet.has(`${i + check[1][0]}-${j + check[1][1]}`)
        }
        return true;
    }
}


function A_STAR_ALGORITHM() {

    let openList = new Map();
    let closeList = new Set();

    console.log(`EMPTY SET`);

    console.log(closeList.size);

    board.startCell.G = 0;
    board.matrix[board.startCell.coord.i][board.startCell.coord.j].G = 0;


    openList.set(`${board.startCell.coord.i}-${board.startCell.coord.j}`, board.startCell);

    let currCell;

    let ittr = 0;

    while (openList.size > 0) {
        ittr += 1;
        console.log(`-------------------------------------------------------------`)
        console.log(`STEP ${ittr}`)

        console.log(`OPEN LIST SIZE NOW  ${openList.size}`)

        /////////////////////////////////////////
        let openListArray = [...openList.entries()];
        //const [initial] = openListArray;

        currCell = openListArray.reduce((acc, curr) => {
            console.log("<><><>><>><><><>")
            console.log(acc[1])
            console.log(curr[1])
            console.log("<><><>><>><><><>")
            if (acc[1].F < curr[1].F)
                return acc;
            return curr;
        })[1];

        console.log(currCell);

        /////

        openList.delete(`${currCell.coord.i}-${currCell.coord.j}`);

        console.log(`CELL FROM OPEN LIST with F = ${currCell.F}`);
        console.log(`${currCell.coord.i} ${currCell.coord.j}`);



        let i = Number(currCell.coord.i);
        let j = Number(currCell.coord.j);

        closeList.add(`${i}-${j}`);

        for (let c in checks) {
            let curr_checks = checks[c][0];
            let weight = checks[c][1];


            for (let c in curr_checks) {
                c = curr_checks[c];

                if (allowed(i + c[0], j + c[1]) && cutCornerCheck(i + c[0], j + c[1], c[0], c[1])) {
                    if (!board.wallSet.has(`${i + c[0]}-${j + c[1]}`) && !closeList.has(`${i + c[0]}-${j + c[1]}`)) {

                        //console.log(`CHECKING ALLOWED ${c}`);

                        if (openList.has(`${i + c[0]}-${j + c[1]}`)) {
                            let e = openList.get(`${i + c[0]}-${j + c[1]}`);

                            if (board.matrix[i][j].G + weight < e.G) {
                                board.matrix[i + c[0]][j + c[1]].G = +board.matrix[i][j].G + weight;
                                board.matrix[i + c[0]][j + c[1]].F = +board.matrix[i + c[0]][j + c[1]].G + board.matrix[i + c[0]][j + c[1]].H;

                                board.matrix[i + c[0]][j + c[1]].parent = board.matrix[i][j].coord;

                                openList.set(`${i + c[0]}-${j + c[1]}`, board.matrix[i + c[0]][j + c[1]]);
                            }
                        } else {

                            console.log("C is///")
                            console.log(...c);
                            console.log(`board_matrix.G`);

                            board.matrix[i + c[0]][j + c[1]].H = calculateHeuristic(board.matrix[i + c[0]][j + c[1]].coord, board.finishCell.coord);
                            board.matrix[i + c[0]][j + c[1]].G = Number(board.matrix[i][j].G) + Number(weight);
                            board.matrix[i + c[0]][j + c[1]].F = Number(board.matrix[i + c[0]][j + c[1]].G) + board.matrix[i + c[0]][j + c[1]].H;

                            board.matrix[i + c[0]][j + c[1]].parent = board.matrix[i][j].coord;

                            openList.set(`${i + c[0]}-${j + c[1]}`, board.matrix[i + c[0]][j + c[1]]);

                            console.log(`OPEN LIST HAS `)
                            console.log(openList.get(`${i + c[0]}-${j + c[1]}`));
                        }

                        DrawBoardElem(board.matrix[i + c[0]][j + c[1]], board.matrix[i + c[0]][j + c[1]].coord);

                        if (board.finishCell.coord.i == i + c[0] && board.finishCell.coord.j == j + c[1]) {
                            console.log("DRAWING PATH")
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

            //if(board.matrix[board.finishCell.coord.i][board.finishCell.coord.i].parent.i!=-1)
            //  DrawPath(clearPath=true);

            A_STAR_ALGORITHM();
            alert("BCE")
        }
    }
}


let states = ["empty", "wall", "start", "finish"];

/*
//Изменяет текущее состояние.
function changeState() {
    board.current_state = this.name;

    console.log(`Current state: ${this.name}`);
}*/

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
let state1 = document.getElementById("empty");
let state2 = document.getElementById("start");
let state3 = document.getElementById("finish");
let state4 = document.getElementById("wall");

state1.onclick = changeState;
state2.onclick = changeState;
state3.onclick = changeState;
state4.onclick = changeState;