/*
let backButton = document.getElementById("back");

backButton.onclick = function () {
    window.location.href="../index.html";
}



class Point
{
    constructor(i,j){
        this.i=i;
        this.j=j;
    }
}

class Cell{
    constructor(){
        this.F=null;
        this.G=null;
        this.H=null;
        this.parent=null;
    }
}

class Board
{
    constructor(m,n){
        this.m=m;
        this.n=n;

        this.board_matrix=new Array(m);  
        for(let i=0;i<m;i++){
            this.board_matrix[i]=new Array(n);
            for(let j=0;j<n;j++){
                this.board_matrix[i][j]=new Cell();
            }
        }
    }
}





let currBoard=new Board(5,5);

const form_rows=document.getElementById("form_rows");
const form_cols=document.getElementById("form_cols");
const form_button=document.getElementById("form_button");

function checkSizeValues(rows,cols){
    if(rows<=0||cols<=0){

        console.log(`Invalid size values ${rows} ${cols}`);

        form_rows.value="";
        form_cols.value="";

        form_rows.placeholder="Invalid size";
        form_cols.placeholder="Invalid size";

        return false;
    }
    return true;
}

form_button.onclick=()=>{
    if(checkSizeValues(form_rows.value,form_cols.value)){

        console.log(`Size changed to ${form_rows.value}x${form_cols.value}`);

        currBoard= new Board(form_rows.value,form_cols.value);
        //Draw_new_board();
    }
}




const algButton = document.getElementById("alg");

algButton.onclick=function(){
    //console.log("Before for");
    for(let i=0;i<currBoard.m;i++)
    {
        for(let j=0;j<currBoard.n;j++)
        {
            console.log(currBoard.board_matrix[i][j]);
        }
        console.log("|");
    }

    
}
*/

"use strict"

//Задержка.
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



class Point {
    constructor(i, j) {
        this.i = i;
        this.j = j;
    }
}

class Cell {
    constructor() {
        this.F = 5;
        this.G = 0;
        this.H = 0;
        this.parent = new Point(0, 0);
    }
}

class Board {
    constructor(m, n) {
        this.m = m;
        this.n = n;

        this.startCoord = new Point(-1, -1);
        this.finishCoord = new Point(-1, -1);

        this.board_matrix = new Array(m);
        for (let i = 0; i < m; i++) {
            this.board_matrix[i] = new Array(n);
            for (let j = 0; j < n; j++) {
                this.board_matrix[i][j] = new Cell();
            }
        }
    }
}




//Выбор размера доски.
let size = document.getElementById("size")

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



//Состояния для элементов доски.
let states = ["empty", "start", "finish", "wall"];

//Цвета для состояний.
let stateColors = new Map();
stateColors.set("empty", "#5f9ea0");
stateColors.set("start", "#bc7837");
stateColors.set("finish", "#3f0d16");
stateColors.set("wall", "#2d2f28");

//Начальное состояние доски - empty.
let currentState = states[0];


//Уникальные состояния - start и finish.
let uniqueStates = new Map();
uniqueStates.set(
    "start", {
    isDefined: false,   //Есть ли на доске start.
    element: false,     //Если есть, то храним этот элемент.
}
);
uniqueStates.set(
    "finish", {
    isDefined: false,   //Есть ли на доске finish.
    element: false,     //Если есть, то храним этот элемент.
}
);




function removeBoardState(state) {
    switch (state) {
        case "start": {
            currBoard.startCoord = new Point(-1, -1);
            break;
        }
        case "finish": {
            currBoard.finishCoord = new Point(-1, -1);
            break;
        }
    }
}

/*Обработчик для уникальных состояний.
    Если на доске уже есть start(finish), то сначала делаем старый empty, 
    потом создаем новый start(finish). 
*/
function handleUniqueStates(element) {
    console.log(element.name);
    console.log(uniqueStates.get(currentState));

    //Если находимся в состоянии start(finish)
    switch (currentState) {
        case "start":
        case "finish": {
            if (uniqueStates.get(currentState).isDefined) {               //Если на доске уже есть start(finish).
                if (uniqueStates.get(currentState).element != element) {    //Если это другая клетка.
                    uniqueStates.get(currentState).element.style.backgroundColor = stateColors.get("empty");  //Делаем старую empty.
                    uniqueStates.get(currentState).element.name = "empty";
                    uniqueStates.get(currentState).element = element;                                         //Записываем текущую клетку в качестве start(finish).
                }                                                                                        
            }
            else {                                                       //Если еще нет start(finish).
                uniqueStates.get(currentState).isDefined = true;          //Записываем текущую клетку в качестве start(finish).
                uniqueStates.get(currentState).element = element;
            }
            break;
        }
    }

    /*
    
        СДЕЛАТЬ НОРМАЛЬНУЮ ОБРАБОТКУ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
    */
    if (currentState != "start" && uniqueStates.get("start").element == element) {
        uniqueStates.get("start").isDefined = false;
        uniqueStates.get("start").element = false;
        removeBoardState("start");
    }
    if (currentState != "finish" && uniqueStates.get("finish").element == element) {
        uniqueStates.get("finish").isDefined = false;
        uniqueStates.get("finish").element = false;
        removeBoardState("finish");
    }

    console.log(uniqueStates.get(currentState));
    console.log(`HandleUniqueStates processed`);
}



function setStateCoordinates(element) {

    console.log(`SetStateCoordinates. ${element.name}`);

    switch (element.name) {
        case "start": {
            currBoard.startCoord = new Point(element.parentElement.rowIndex, element.cellIndex);
            break;
        }
        case "finish": {
            currBoard.finishCoord = new Point(element.parentElement.rowIndex, element.cellIndex);
            break;
        }
    }
}

let wereMousedown = false;

function doMouseOverFalse(){
    wereMousedown = false;
}

function doMouseOverTrue(){
    wereMousedown = true;
}

//Обработчик нажатий на элементы доски.
function boardElementOverHandler() {
    if(!wereMousedown) return; 
    console.log(`BoardElementOverHandler. Processing element ${this.id}`);

    //Проверяем уникальность start(finish).
    handleUniqueStates(this);

    console.log(`Cell pressed. Coord: ${this.parentElement.rowIndex} ${this.cellIndex}`);

    /*if (this.name == currentState) {                                //Если текщее состояние совпадает с состоянием клетки.
        this.name = "empty";                                      //Делаем ее empty. (своего рода отмена).
        this.style.backgroundColor = stateColors.get("empty");
    }
    else {   */                                                    //Иначе изменим состояние текущей клетки.
        this.name = currentState;
        this.style.backgroundColor = stateColors.get(currentState);
    //}

    setStateCoordinates(this);

    console.log(this.name);
    console.log(`BoardElementClickHandler has been processed`);
}



//Доска, на которой находятся элементы. (является table).
const board_block = document.getElementById("board_block")

document.body.onmouseup = doMouseOverFalse;

//Создает доску нужного размера.
function generateField(n) {
    board_block.innerHTML = "";
    board_block.hidden = false;

    n = n % 100;

    for (let i = 0; i < n; i++) {
        let board_row = document.createElement("tr");            //Создаем строку.

        for (let j = 0; j < n; j++) {
            let board_elem = document.createElement('td');       //Создаем элемент стороки.

            board_elem.className = "board_elem";
            board_elem.name = "empty";
            board_elem.id = i * n + j;
            board_elem.onmousedown = doMouseOverTrue;
            board_elem.onmouseover = boardElementOverHandler;        //Обработчик нажатия на элемент.

            board_elem.style.fontSize = 300 / n + "px";
            
            let f = document.createElement('div');
            f.innerText = 2;
            f.className = "f";
            f.id = `f${board_elem.id}`;
            board_elem.append(f);

            let g = document.createElement('div');
            g.innerText = 14 * 99;
            g.className = "g";
            g.id = `g${board_elem.id}`;
            board_elem.append(g);

            let h = document.createElement('div');
            h.innerText = 1234;
            h.className = "h";
            h.id = `h${board_elem.id}`;
            board_elem.append(h)

            board_elem.value = "<span class=\"f\">f</span><br>";

            board_row.append(board_elem);                       //Добавляем элемент в строку.
        }
        board_block.append(board_row);                          //Добавляем всю строку в таблицу.
    }

    console.log(`Field has been created`);
}



//Матрица для текущей доски.
let currBoard = null;


function boardIsCreated() {
    if (currBoard == null) {
        alert("Please create the board");
        return false;
    }
    return true;
}



function startAndFinishAreDefined() {
    if (currBoard.startCoord.i != -1 && currBoard.finishCoord.i != -1) {
        return true;
    }

    alert("Please set start and finish points");

    return false;
}






let diagonalWeight = 14;
let straightWeight = 10;


function manhattanHueristic(currentPoint, finishPoint) {
    let countOfSteps = Math.abs(currentPoint.i - finishPoint.i) + Math.abs(currentPoint.j - finishPoint.j);
    return countOfSteps * straightWeight;
}


let hueristicMap = new Map();
hueristicMap.set("manhattan", manhattanHueristic);

let currentHeuristic = "manhattan";

function calculateHeuristic(currentPoint) {
    let hFunction = hueristicMap.get(currentHeuristic);
    let finishPoint = new Point(currBoard.finishCoord.i, currBoard.finishCoord.j);

    return hFunction(currentPoint, finishPoint);
}

async function calculateAllHueristics() {
    for (let i = 0; i < currBoard.m; i++) {
        for (let j = 0; j < currBoard.n; j++) {
            await sleep(500);
            let hue=document.getElementById(`h${board_block.rows[i].cells[j].id}`);
            hue.innerText = calculateHeuristic(new Point(i, j));
        }
    }
}


function A_STAR_ALGORITHM() {

    calculateAllHueristics();

    /*
    for (let i = 0; i < currBoard.m; i++) {
        for (let j = 0; j < currBoard.n; j++) {
            await sleep(500);
            board_block.rows[i].cells[j].textContent = currBoard.board_matrix[i][j].H;
        }
    }*/

    console.log(`A_STAR_ALGORITHM has been finished`);
}



//Кнопка для запуска алгоритма.
let startAlgorithmButton = document.getElementById("start_alg");


startAlgorithmButton.onclick = async function () {
    if (boardIsCreated()) {
        if (startAndFinishAreDefined()) {///Если на доске есть начало и конец/
            A_STAR_ALGORITHM();
        }
    }
}




//Кнопка ввода размера доски.
let button = document.getElementById("size_button")

button.onclick = () => {
    if (checkSizeValue(size.value)) {

        console.log(`Size value is: ${size.value}`);

        currBoard = new Board(size.value, size.value);
        generateField(size.value);
    }
}



//Изменяет текущее состояние.
function changeState() {
    currentState = this.name;

    console.log(`Current state: ${currentState}`);
}

//Кнопки выбора состояния.
let state1 = document.getElementById("state1");
let state2 = document.getElementById("state2");
let state3 = document.getElementById("state3");
let state4 = document.getElementById("state4");

state1.onclick = changeState;
state2.onclick = changeState;
state3.onclick = changeState;
state4.onclick = changeState;


let diagonal = document.getElementById('diagonal');
let additSettings = document.getElementById('additSettings');

diagonal.onclick = () => {
    additSettings.hidden = !additSettings.hidden;
}

// Можно ввести максимум 3 цифры в размер поля
let sizeInput = document.getElementById('size');
sizeInput.oninput = function() {
    this.value = this.value.slice(0, this.maxLength);
    if (this.value == 0) {
        this.value = "";
    }
}
