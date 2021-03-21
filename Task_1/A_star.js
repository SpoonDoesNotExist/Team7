(function (f) { if (typeof exports === "object" && typeof module !== "undefined") { module.exports = f() } else if (typeof define === "function" && define.amd) { define([], f) } else { var g; if (typeof window !== "undefined") { g = window } else if (typeof global !== "undefined") { g = global } else if (typeof self !== "undefined") { g = self } else { g = this } g.PriorityQueue = f() } })(function () {
    var define, module, exports; return (function e(t, n, r) { function s(o, u) { if (!n[o]) { if (!t[o]) { var a = typeof require == "function" && require; if (!u && a) return a(o, !0); if (i) return i(o, !0); var f = new Error("Cannot find module '" + o + "'"); throw f.code = "MODULE_NOT_FOUND", f } var l = n[o] = { exports: {} }; t[o][0].call(l.exports, function (e) { var n = t[o][1][e]; return s(n ? n : e) }, l, l.exports, e, t, n, r) } return n[o].exports } var i = typeof require == "function" && require; for (var o = 0; o < r.length; o++)s(r[o]); return s })({
        1: [function (_dereq_, module, exports) {
            var AbstractPriorityQueue, ArrayStrategy, BHeapStrategy, BinaryHeapStrategy, PriorityQueue,
                extend = function (child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
                hasProp = {}.hasOwnProperty;

            AbstractPriorityQueue = _dereq_('./PriorityQueue/AbstractPriorityQueue');

            ArrayStrategy = _dereq_('./PriorityQueue/ArrayStrategy');

            BinaryHeapStrategy = _dereq_('./PriorityQueue/BinaryHeapStrategy');

            BHeapStrategy = _dereq_('./PriorityQueue/BHeapStrategy');

            PriorityQueue = (function (superClass) {
                extend(PriorityQueue, superClass);

                function PriorityQueue(options) {
                    options || (options = {});
                    options.strategy || (options.strategy = BinaryHeapStrategy);
                    options.comparator || (options.comparator = function (a, b) {
                        return (a || 0) - (b || 0);
                    });
                    PriorityQueue.__super__.constructor.call(this, options);
                }

                return PriorityQueue;

            })(AbstractPriorityQueue);

            PriorityQueue.ArrayStrategy = ArrayStrategy;

            PriorityQueue.BinaryHeapStrategy = BinaryHeapStrategy;

            PriorityQueue.BHeapStrategy = BHeapStrategy;

            module.exports = PriorityQueue;


        }, { "./PriorityQueue/AbstractPriorityQueue": 2, "./PriorityQueue/ArrayStrategy": 3, "./PriorityQueue/BHeapStrategy": 4, "./PriorityQueue/BinaryHeapStrategy": 5 }], 2: [function (_dereq_, module, exports) {
            var AbstractPriorityQueue;

            module.exports = AbstractPriorityQueue = (function () {
                function AbstractPriorityQueue(options) {
                    var ref;
                    if ((options != null ? options.strategy : void 0) == null) {
                        throw 'Must pass options.strategy, a strategy';
                    }
                    if ((options != null ? options.comparator : void 0) == null) {
                        throw 'Must pass options.comparator, a comparator';
                    }
                    this.priv = new options.strategy(options);
                    this.length = (options != null ? (ref = options.initialValues) != null ? ref.length : void 0 : void 0) || 0;
                }

                AbstractPriorityQueue.prototype.queue = function (value) {
                    this.length++;
                    this.priv.queue(value);
                    return void 0;
                };

                AbstractPriorityQueue.prototype.dequeue = function (value) {
                    if (!this.length) {
                        throw 'Empty queue';
                    }
                    this.length--;
                    return this.priv.dequeue();
                };

                AbstractPriorityQueue.prototype.peek = function (value) {
                    if (!this.length) {
                        throw 'Empty queue';
                    }
                    return this.priv.peek();
                };

                AbstractPriorityQueue.prototype.clear = function () {
                    this.length = 0;
                    return this.priv.clear();
                };

                return AbstractPriorityQueue;

            })();


        }, {}], 3: [function (_dereq_, module, exports) {
            var ArrayStrategy, binarySearchForIndexReversed;

            binarySearchForIndexReversed = function (array, value, comparator) {
                var high, low, mid;
                low = 0;
                high = array.length;
                while (low < high) {
                    mid = (low + high) >>> 1;
                    if (comparator(array[mid], value) >= 0) {
                        low = mid + 1;
                    } else {
                        high = mid;
                    }
                }
                return low;
            };

            module.exports = ArrayStrategy = (function () {
                function ArrayStrategy(options) {
                    var ref;
                    this.options = options;
                    this.comparator = this.options.comparator;
                    this.data = ((ref = this.options.initialValues) != null ? ref.slice(0) : void 0) || [];
                    this.data.sort(this.comparator).reverse();
                }

                ArrayStrategy.prototype.queue = function (value) {
                    var pos;
                    pos = binarySearchForIndexReversed(this.data, value, this.comparator);
                    this.data.splice(pos, 0, value);
                    return void 0;
                };

                ArrayStrategy.prototype.dequeue = function () {
                    return this.data.pop();
                };

                ArrayStrategy.prototype.peek = function () {
                    return this.data[this.data.length - 1];
                };

                ArrayStrategy.prototype.clear = function () {
                    this.data.length = 0;
                    return void 0;
                };

                return ArrayStrategy;

            })();


        }, {}], 4: [function (_dereq_, module, exports) {
            var BHeapStrategy;

            module.exports = BHeapStrategy = (function () {
                function BHeapStrategy(options) {
                    var arr, i, j, k, len, ref, ref1, shift, value;
                    this.comparator = (options != null ? options.comparator : void 0) || function (a, b) {
                        return a - b;
                    };
                    this.pageSize = (options != null ? options.pageSize : void 0) || 512;
                    this.length = 0;
                    shift = 0;
                    while ((1 << shift) < this.pageSize) {
                        shift += 1;
                    }
                    if (1 << shift !== this.pageSize) {
                        throw 'pageSize must be a power of two';
                    }
                    this._shift = shift;
                    this._emptyMemoryPageTemplate = arr = [];
                    for (i = j = 0, ref = this.pageSize; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                        arr.push(null);
                    }
                    this._memory = [];
                    this._mask = this.pageSize - 1;
                    if (options.initialValues) {
                        ref1 = options.initialValues;
                        for (k = 0, len = ref1.length; k < len; k++) {
                            value = ref1[k];
                            this.queue(value);
                        }
                    }
                }

                BHeapStrategy.prototype.queue = function (value) {
                    this.length += 1;
                    this._write(this.length, value);
                    this._bubbleUp(this.length, value);
                    return void 0;
                };

                BHeapStrategy.prototype.dequeue = function () {
                    var ret, val;
                    ret = this._read(1);
                    val = this._read(this.length);
                    this.length -= 1;
                    if (this.length > 0) {
                        this._write(1, val);
                        this._bubbleDown(1, val);
                    }
                    return ret;
                };

                BHeapStrategy.prototype.peek = function () {
                    return this._read(1);
                };

                BHeapStrategy.prototype.clear = function () {
                    this.length = 0;
                    this._memory.length = 0;
                    return void 0;
                };

                BHeapStrategy.prototype._write = function (index, value) {
                    var page;
                    page = index >> this._shift;
                    while (page >= this._memory.length) {
                        this._memory.push(this._emptyMemoryPageTemplate.slice(0));
                    }
                    return this._memory[page][index & this._mask] = value;
                };

                BHeapStrategy.prototype._read = function (index) {
                    return this._memory[index >> this._shift][index & this._mask];
                };

                BHeapStrategy.prototype._bubbleUp = function (index, value) {
                    var compare, indexInPage, parentIndex, parentValue;
                    compare = this.comparator;
                    while (index > 1) {
                        indexInPage = index & this._mask;
                        if (index < this.pageSize || indexInPage > 3) {
                            parentIndex = (index & ~this._mask) | (indexInPage >> 1);
                        } else if (indexInPage < 2) {
                            parentIndex = (index - this.pageSize) >> this._shift;
                            parentIndex += parentIndex & ~(this._mask >> 1);
                            parentIndex |= this.pageSize >> 1;
                        } else {
                            parentIndex = index - 2;
                        }
                        parentValue = this._read(parentIndex);
                        if (compare(parentValue, value) < 0) {
                            break;
                        }
                        this._write(parentIndex, value);
                        this._write(index, parentValue);
                        index = parentIndex;
                    }
                    return void 0;
                };

                BHeapStrategy.prototype._bubbleDown = function (index, value) {
                    var childIndex1, childIndex2, childValue1, childValue2, compare;
                    compare = this.comparator;
                    while (index < this.length) {
                        if (index > this._mask && !(index & (this._mask - 1))) {
                            childIndex1 = childIndex2 = index + 2;
                        } else if (index & (this.pageSize >> 1)) {
                            childIndex1 = (index & ~this._mask) >> 1;
                            childIndex1 |= index & (this._mask >> 1);
                            childIndex1 = (childIndex1 + 1) << this._shift;
                            childIndex2 = childIndex1 + 1;
                        } else {
                            childIndex1 = index + (index & this._mask);
                            childIndex2 = childIndex1 + 1;
                        }
                        if (childIndex1 !== childIndex2 && childIndex2 <= this.length) {
                            childValue1 = this._read(childIndex1);
                            childValue2 = this._read(childIndex2);
                            if (compare(childValue1, value) < 0 && compare(childValue1, childValue2) <= 0) {
                                this._write(childIndex1, value);
                                this._write(index, childValue1);
                                index = childIndex1;
                            } else if (compare(childValue2, value) < 0) {
                                this._write(childIndex2, value);
                                this._write(index, childValue2);
                                index = childIndex2;
                            } else {
                                break;
                            }
                        } else if (childIndex1 <= this.length) {
                            childValue1 = this._read(childIndex1);
                            if (compare(childValue1, value) < 0) {
                                this._write(childIndex1, value);
                                this._write(index, childValue1);
                                index = childIndex1;
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                    return void 0;
                };

                return BHeapStrategy;

            })();


        }, {}], 5: [function (_dereq_, module, exports) {
            var BinaryHeapStrategy;

            module.exports = BinaryHeapStrategy = (function () {
                function BinaryHeapStrategy(options) {
                    var ref;
                    this.comparator = (options != null ? options.comparator : void 0) || function (a, b) {
                        return a - b;
                    };
                    this.length = 0;
                    this.data = ((ref = options.initialValues) != null ? ref.slice(0) : void 0) || [];
                    this._heapify();
                }

                BinaryHeapStrategy.prototype._heapify = function () {
                    var i, j, ref;
                    if (this.data.length > 0) {
                        for (i = j = 1, ref = this.data.length; 1 <= ref ? j < ref : j > ref; i = 1 <= ref ? ++j : --j) {
                            this._bubbleUp(i);
                        }
                    }
                    return void 0;
                };

                BinaryHeapStrategy.prototype.queue = function (value) {
                    this.data.push(value);
                    this._bubbleUp(this.data.length - 1);
                    return void 0;
                };

                BinaryHeapStrategy.prototype.dequeue = function () {
                    var last, ret;
                    ret = this.data[0];
                    last = this.data.pop();
                    if (this.data.length > 0) {
                        this.data[0] = last;
                        this._bubbleDown(0);
                    }
                    return ret;
                };

                BinaryHeapStrategy.prototype.peek = function () {
                    return this.data[0];
                };

                BinaryHeapStrategy.prototype.clear = function () {
                    this.length = 0;
                    this.data.length = 0;
                    return void 0;
                };

                BinaryHeapStrategy.prototype._bubbleUp = function (pos) {
                    var parent, x;
                    while (pos > 0) {
                        parent = (pos - 1) >>> 1;
                        if (this.comparator(this.data[pos], this.data[parent]) < 0) {
                            x = this.data[parent];
                            this.data[parent] = this.data[pos];
                            this.data[pos] = x;
                            pos = parent;
                        } else {
                            break;
                        }
                    }
                    return void 0;
                };

                BinaryHeapStrategy.prototype._bubbleDown = function (pos) {
                    var last, left, minIndex, right, x;
                    last = this.data.length - 1;
                    while (true) {
                        left = (pos << 1) + 1;
                        right = left + 1;
                        minIndex = pos;
                        if (left <= last && this.comparator(this.data[left], this.data[minIndex]) < 0) {
                            minIndex = left;
                        }
                        if (right <= last && this.comparator(this.data[right], this.data[minIndex]) < 0) {
                            minIndex = right;
                        }
                        if (minIndex !== pos) {
                            x = this.data[minIndex];
                            this.data[minIndex] = this.data[pos];
                            this.data[pos] = x;
                            pos = minIndex;
                        } else {
                            break;
                        }
                    }
                    return void 0;
                };

                return BinaryHeapStrategy;

            })();


        }, {}]
    }, {}, [1])(1)
});

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
    constructor(i, j) {
        this.coord = new Point(i, j);
        this.F = 0;
        this.G = 10000;
        this.H = 0;
        this.parent = new Point(-1, -1);
    }
}

class Board {
    constructor(m, n) {
        this.m = m;
        this.n = n;

        this.startCell = new Cell();
        this.finishCell = new Cell();

        this.startCoord = new Point(-1, -1);
        this.finishCoord = new Point(-1, -1);

        this.board_matrix = new Array(m);
        for (let i = 0; i < m; i++) {
            this.board_matrix[i] = new Array(n);
            for (let j = 0; j < n; j++) {
                this.board_matrix[i][j] = new Cell(i, j);
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
stateColors.set("empty", "#a49582");
stateColors.set("start", "#042f28");
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
        default: {
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
            currBoard.startCell = currBoard.board_matrix[element.parentElement.rowIndex][element.cellIndex];
            break;
        }
        case "finish": {
            currBoard.finishCoord = new Point(element.parentElement.rowIndex, element.cellIndex);
            currBoard.finishCell = currBoard.board_matrix[element.parentElement.rowIndex][element.cellIndex];
            break;
        }
    }
}

<<<<<<< HEAD

let wallSet = new Set();

function checkWallSet(element) {

    console.log(`CHECK WALL SET`);
    console.log(element.id);

    if (currentState == "wall" && element.name == "empty") {
        wallSet.add(element.id);
    }
    else {
        wallSet.delete(element.id);
    }
}

//Обработчик нажатий на элементы доски.
function boardElementClickHandler() {
=======
let wereMousedown = false;

function doMouseOverFalse(){
    wereMousedown = false;
}

function doMouseOverTrue(){
    wereMousedown = true;
}
>>>>>>> origin/ArmenAndMynka

//Обработчик нажатий на элементы доски.
function boardElementOverHandler() {
    if(!wereMousedown) return; 
    console.log(`BoardElementOverHandler. Processing element ${this.id}`);

    //Проверяем уникальность start(finish).
    handleUniqueStates(this);

    checkWallSet(this);

    console.log(`Cell pressed. Coord: ${this.parentElement.rowIndex} ${this.cellIndex}`);

<<<<<<< HEAD
    if (this.name == currentState) {                              //Если текщее состояние совпадает с состоянием клетки.
        this.name = "empty";                                      //Делаем ее empty. (своего рода отмена).
        this.style.backgroundColor = stateColors.get("empty");
    }
    else {                                                        //Иначе изменим состояние текущей клетки.
=======
    /*if (this.name == currentState) {                                //Если текщее состояние совпадает с состоянием клетки.
        this.name = "empty";                                      //Делаем ее empty. (своего рода отмена).
        this.style.backgroundColor = stateColors.get("empty");
    }
    else { */                                                    //Иначе изменим состояние текущей клетки.
>>>>>>> origin/ArmenAndMynka
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
<<<<<<< HEAD
            board_elem.id = `${i}-${j}`;
            board_elem.onclick = boardElementClickHandler;        //Об``работчик нажатия на элемент.

            board_elem.style.fontSize = 300 / n + "px";

=======
            board_elem.id = i * n + j;
            board_elem.onmousedown = function() {
                this.name = currentState;
                this.style.backgroundColor = stateColors.get(currentState);
                doMouseOverTrue();
            };
            board_elem.onmousemove = boardElementOverHandler;        //Обработчик нажатия на элемент.

            if (n < 20) {
                board_elem.style.fontSize = 16.5/n + "vw";
            } else {
                board_elem.style.fontSize = 16.5/20 + "vw";
            }
            
>>>>>>> origin/ArmenAndMynka
            let f = document.createElement('div');
            //f.innerText = 2;
            f.className = "f";
            f.id = `f${board_elem.id}`;
            board_elem.append(f);

            let g = document.createElement('div');
            //g.innerText = 14 * 99;
            g.className = "g";
            g.id = `g${board_elem.id}`;
            board_elem.append(g);

            let h = document.createElement('div');
            //h.innerText = 1234;
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

function calculateAllHueristics() {
    for (let i = 0; i < currBoard.m; i++) {
        for (let j = 0; j < currBoard.n; j++) {
<<<<<<< HEAD
            //await sleep(500);
            let hue = document.getElementById(`h${board_block.rows[i].cells[j].id}`);

            if (!wallSet.has(hue.id.slice(1,))) {
                let heu = calculateHeuristic(new Point(i, j));
                hue.innerText = heu;
                currBoard.board_matrix[i][j].H = heu;
            }
=======
            await sleep(100);
            let hue=document.getElementById(`h${board_block.rows[i].cells[j].id}`);
            hue.innerText = calculateHeuristic(new Point(i, j));
>>>>>>> origin/ArmenAndMynka
        }
    }
}


let openListCheck = new Set();
let openList = new PriorityQueue({ comparator: function (a, b) { return a.F <= b.F } });
let closeList = new Set();


function getID(point, size) {
    return point.i * size + point.j;
}

function availableCoordinates(point) {
    console.log(point)
    let a = 0 <= point.i && point.i < currBoard.m && 0 <= point.j && point.j < currBoard.n;

    console.log(`availableCoordinates ${point.i} ${point.j}`);

    return a;
}

function DrawBoardElem(e) {
    let i = e.coord.i;
    let j = e.coord.j;

    let f_elem = document.getElementById(`f${i * currBoard.m + j}`);
    let g_elem = document.getElementById(`g${i * currBoard.m + j}`);

    console.log(f_elem);

    f_elem.innerText = e.F;
    g_elem.innerText = e.G;
}



let theWayExists = false;

function finishCheck(e) {
    theWayExists = (e == currBoard.finishCell);
}


function checkNeighbours(currentCell) {
    let i = currentCell.coord.i;
    let j = currentCell.coord.j;

    console.log("CHECKING NEIGH.....................");

    console.log(`COORD: ${i} ${j}`);

    let tmpNeigh;


    if (availableCoordinates(new Point(i + 1, j))) {

        tmpNeigh = currBoard.board_matrix[i + 1][j];

        finishCheck(tmpNeigh);

        if (!closeList.has(tmpNeigh) && !wallSet.has(`${(i + 1) * currBoard.m + j}`)) {

            console.log("CHECK G......................")
            console.log(tmpNeigh)

            if (currentCell.G + straightWeight < tmpNeigh.G ) {

                console.log(`+++++++++++++++++++++++++++${tmpNeigh.G}`)
                console.log(`+++++++++++++++++++++++++++${tmpNeigh.H}`)

                tmpNeigh.G = currentCell.G + straightWeight;
                tmpNeigh.F = tmpNeigh.G + tmpNeigh.H;
                tmpNeigh.parent = new Cell(i, j);
            }

            if (!openListCheck.has(tmpNeigh)) {
                openListCheck.add(tmpNeigh);
                openList.queue(tmpNeigh);
            }

            DrawBoardElem(tmpNeigh);
        }
    }

    if (availableCoordinates(new Point(i - 1, j))) {

        tmpNeigh = currBoard.board_matrix[i - 1][j];

        finishCheck(tmpNeigh);

        if (!closeList.has(tmpNeigh) && !wallSet.has(`${(i - 1) * currBoard.m + j}`)) {

            console.log("CHECK G......................")
            console.log(tmpNeigh)

            if (currentCell.G + straightWeight < tmpNeigh.G) {

                console.log(`+++++++++++++++++++++++++++${tmpNeigh.G}`)
                console.log(`+++++++++++++++++++++++++++${tmpNeigh.H}`)

                tmpNeigh.G = currentCell.G + straightWeight;
                tmpNeigh.F = tmpNeigh.G + tmpNeigh.H;
                tmpNeigh.parent = new Cell(i, j);
            }

            if (!openListCheck.has(tmpNeigh)) {
                openListCheck.add(tmpNeigh);
                openList.queue(tmpNeigh);
            }

            DrawBoardElem(tmpNeigh);
        }
    }

    if (availableCoordinates(new Point(i, j + 1))) {

        tmpNeigh = currBoard.board_matrix[i][j + 1];

        finishCheck(tmpNeigh);

        if (!closeList.has(tmpNeigh) && !wallSet.has(`${(i) * currBoard.m + j + 1}`)) {

            console.log("CHECK G......................")
            console.log(tmpNeigh)

            if (currentCell.G + straightWeight < tmpNeigh.G) {

                console.log(`+++++++++++++++++++++++++++${tmpNeigh.G}`)
                console.log(`+++++++++++++++++++++++++++${tmpNeigh.H}`)

                tmpNeigh.G = currentCell.G + straightWeight;
                tmpNeigh.F = tmpNeigh.G + tmpNeigh.H;
                tmpNeigh.parent = new Cell(i, j);
            }

            if (!openListCheck.has(tmpNeigh)) {
                openListCheck.add(tmpNeigh);
                openList.queue(tmpNeigh);
            }

            DrawBoardElem(tmpNeigh);
        }
    }

    if (availableCoordinates(new Point(i, j - 1))) {

        tmpNeigh = currBoard.board_matrix[i][j - 1];

        finishCheck(tmpNeigh);

        if (!closeList.has(tmpNeigh) && !wallSet.has(`${(i) * currBoard.m + j - 1}`)) {

            console.log("CHECK G......................")
            console.log(tmpNeigh)

            if (currentCell.G + straightWeight < tmpNeigh.G) {

                console.log(`+++++++++++++++++++++++++++${tmpNeigh.G}`)
                console.log(`+++++++++++++++++++++++++++${tmpNeigh.H}`)

                tmpNeigh.G = currentCell.G + straightWeight;
                tmpNeigh.F = tmpNeigh.G + tmpNeigh.H;
                tmpNeigh.parent = new Cell(i, j);
            }

            if (!openListCheck.has(tmpNeigh)) {
                openListCheck.add(tmpNeigh);
                openList.queue(tmpNeigh);
            }

            DrawBoardElem(tmpNeigh);
        }
    }



    ///////////////////////////////////////////////////


    if (availableCoordinates(new Point(i + 1, j + 1))) {

        tmpNeigh = currBoard.board_matrix[i + 1][j + 1];

        finishCheck(tmpNeigh);

        if (!closeList.has(tmpNeigh) && !wallSet.has(`${(i + 1) * currBoard.m + j + 1}`)) {

            console.log("CHECK G......................")
            console.log(tmpNeigh)

            if (currentCell.G + diagonalWeight < tmpNeigh.G) {

                console.log(`+++++++++++++++++++++++++++${tmpNeigh.G}`)
                console.log(`+++++++++++++++++++++++++++${tmpNeigh.H}`)

                tmpNeigh.G = currentCell.G + diagonalWeight;
                tmpNeigh.F = tmpNeigh.G + tmpNeigh.H;
                tmpNeigh.parent = new Cell(i, j);
            }

            if (!openListCheck.has(tmpNeigh)) {
                openListCheck.add(tmpNeigh);
                openList.queue(tmpNeigh);
            }

            DrawBoardElem(tmpNeigh);
        }
    }

    if (availableCoordinates(new Point(i - 1, j - 1))) {

        tmpNeigh = currBoard.board_matrix[i - 1][j - 1];

        finishCheck(tmpNeigh);

        if (!closeList.has(tmpNeigh) && !wallSet.has(`${(i - 1) * currBoard.m + j - 1}`)) {

            console.log("CHECK G......................")
            console.log(tmpNeigh)

            if (currentCell.G + diagonalWeight < tmpNeigh.G) {

                console.log(`+++++++++++++++++++++++++++${tmpNeigh.G}`)
                console.log(`+++++++++++++++++++++++++++${tmpNeigh.H}`)

                tmpNeigh.G = currentCell.G + diagonalWeight;
                tmpNeigh.F = tmpNeigh.G + tmpNeigh.H;
                tmpNeigh.parent = new Cell(i, j);
            }

            if (!openListCheck.has(tmpNeigh)) {
                openListCheck.add(tmpNeigh);
                openList.queue(tmpNeigh);
            }

            DrawBoardElem(tmpNeigh);
        }
    }

    if (availableCoordinates(new Point(i - 1, j + 1))) {

        tmpNeigh = currBoard.board_matrix[i - 1][j + 1];

        finishCheck(tmpNeigh);

        if (!closeList.has(tmpNeigh) && !wallSet.has(`${(i - 1) * currBoard.m + j + 1}`)) {

            console.log("CHECK G......................")
            console.log(tmpNeigh)

            if (currentCell.G + diagonalWeight < tmpNeigh.G) {

                console.log(`+++++++++++++++++++++++++++${tmpNeigh.G}`)
                console.log(`+++++++++++++++++++++++++++${tmpNeigh.H}`)

                tmpNeigh.G = currentCell.G + diagonalWeight;
                tmpNeigh.F = tmpNeigh.G + tmpNeigh.H;
                tmpNeigh.parent = new Cell(i, j);
            }

            if (!openListCheck.has(tmpNeigh)) {
                openListCheck.add(tmpNeigh);
                openList.queue(tmpNeigh);
            }

            DrawBoardElem(tmpNeigh);
        }
    }

    if (availableCoordinates(new Point(i + 1, j - 1))) {


        tmpNeigh = currBoard.board_matrix[i + 1][j - 1];

        finishCheck(tmpNeigh);

        if (!closeList.has(tmpNeigh) && !wallSet.has(`${(i + 1) * currBoard.m + j - 1}`)) {

            console.log("CHECK G......................")
            console.log(tmpNeigh)

            if (currentCell.G + diagonalWeight < tmpNeigh.G ) {

                console.log(`+++++++++++++++++++++++++++${tmpNeigh.G}`)
                console.log(`+++++++++++++++++++++++++++${tmpNeigh.H}`)

                tmpNeigh.G = currentCell.G + diagonalWeight;
                tmpNeigh.F = tmpNeigh.G + tmpNeigh.H;
                tmpNeigh.parent = new Cell(i, j);
            }

            if (!openListCheck.has(tmpNeigh)) {
                openListCheck.add(tmpNeigh);
                openList.queue(tmpNeigh);
            }

            DrawBoardElem(tmpNeigh);
        }
    }


}



function DrawTheWay() {

    if (theWayExists) {

        let cur = currBoard.finishCell;

        while (cur != currBoard.startCell) {

            console.log(cur);

            board_block.rows[cur.coord.i].cells[cur.coord.j].style.backgroundColor = "#FFFFFF";


            cur = currBoard.board_matrix[cur.parent.coord.i][cur.parent.coord.j];
        }
    }
    else {
        alert("NO WAY");
    }
}


async function A_STAR_ALGORITHM() {

    theWayExists = false;

    calculateAllHueristics();

    openList.queue(currBoard.startCell);
    openListCheck.add(currBoard.startCell);

    currBoard.startCell.F = 0;
    currBoard.startCell.G = 0;

    console.log(`================${currBoard.startCell}================================`);

    let minCell;
    while (!theWayExists && openList.length != 0) {

        await sleep(700);

        console.log(`OPEN LIST ELEM ${openList.peek()}`);

        minCell = openList.dequeue();
        closeList.add(minCell);

        checkNeighbours(minCell);
    }

    console.log("DrawTheWay")
    DrawTheWay();
    console.log("end   DrawTheWay")

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


        let pq=PriorityQueue({comparator: function(a,b){a.F<b.F}})
        
        //board_block.rows[0].cells[0].
    }
}



//Изменяет текущее состояние.
function changeState() {

    // Кликабельность кнопок состояния ------------------------------------------------ИЗМЕНЕНИЕ!!!!!!!!!!!!!!!
    for (let stateButton of states) {
        stateButton = document.getElementById(`${stateButton}`);

        if (currentState == stateButton.name) {
            stateButton.className = `state ${stateButton.name}`;
            break;
        }
    }

    currentState = this.name;
    this.className += " activatedState";

    console.log(`Current state: ${currentState}`);
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


// Кнопки движения по диагонали и среза углов
let diagonal = document.getElementById('diagonal');
let additSettings = document.getElementById('additSettings');

diagonal.onclick = () => {
    additSettings.hidden = !additSettings.hidden;
}

// Можно ввести максимум 2 цифры в размер поля
let sizeInput = document.getElementById('size');
sizeInput.oninput = function () {
    this.value = this.value.slice(0, this.maxLength);
    if (this.value == 0) {
        this.value = "";
    }
}