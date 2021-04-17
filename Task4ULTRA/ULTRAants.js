let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');

let antCanvas = document.getElementById("antCanvas");
let antCtx = antCanvas.getContext('2d');

const scale = 20;

let field = new Array(canvas.height / scale);
for (let i = 0; i < field.length; i++) {
    field[i] = new Array(canvas.width / scale);
    field[i].fill(0);
}

function clearRect(needCtx, cords) {
    needCtx.clearRect(cords.x * scale, cords.y * scale, scale, scale);
}

function setRect(needCtx, cords) {
    needCtx.fillRect(cords.x * scale, cords.y * scale, scale, scale);
}

//----------------MAZE(CAVE)----------------------------------------------------------------------------

const aliveChance = 0.35;
const deathLimit = 3;
const birthLimit = 4;
const stepsCount = 10;

function countAliveNeighbours(cave, x, y) {
    let aliveCount = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i == 0 && j == 0) {
                continue;
            } else {
                let checkX = (0 <= x + i && x + i < cave[0].length) ? x + i : 'none';
                let checkY = (0 <= y + j && y + j < cave.length) ? y + j : 'none';

                if (checkX != 'none' && checkY != 'none') {
                    if (cave[checkY][checkX] == true) {
                        aliveCount++;
                    }
                } else {
                    aliveCount++;
                }
            }
        }
    }
    return aliveCount;
}

function doSimulationStep(cave) {
    let newCave = new Array(cave.length);
    for (let i = 0; i < newCave.length; i++) {
        newCave[i] = new Array(cave[0].length);
    }

    for (let i = 0; i < cave.length; i++) {
        for (let j = 0; j < cave[i].length; j++) {
            let wallCount = countAliveNeighbours(cave, j, i);
            if (cave[i][j] == true) {
                if (wallCount < deathLimit) {
                    newCave[i][j] = false;
                } else {
                    newCave[i][j] = cave[i][j];
                }

            } else {
                if (wallCount > birthLimit) {
                    newCave[i][j] = true;
                } else {
                    newCave[i][j] = cave[i][j];
                }
            }
        }
    }
    return newCave;
}

function initializeCave() {

    let cave = new Array(canvas.height / scale);
    for (let i = 0; i < cave.length; i++) {
        cave[i] = new Array(canvas.width / scale);
        cave[i].fill(false);

        for (let j = 0; j < cave[i].length; j++) {
            if (Math.random() < aliveChance) {
                cave[i][j] = true;
            }
        }
    }

    return cave;
}

function generateCave() {
    let cave = initializeCave();
    for (let i = 0; i < stepsCount; i++) {
        cave = doSimulationStep(cave);
    }
    return cave;
}
//-------------------------------------------------------------------------------------------------------------

//------------------------NEST-------------------------------------------------------------------------
function drawNest(nest) {
    ctx.fillStyle = '#5a4343';
    for (let i = 0; i < nest.length; i++) {
        setRect(ctx, nest[i]);
        field[nest[i].y][nest[i].x] = 'nest';
    }
}

function clearNest(nest) {
    ctx.fillStyle = '#9c855d';
    for (let i = 0; i < nest.length; i++) {
        setRect(ctx, nest[i]);
        field[nest[i].y][nest[i].x] = 0;
    }
    return [];
}

let nest = [];
function placeNest(x, y) {
    nest = clearNest(nest);
    for (let i = -2; i <= 2; i++) {
        let newX = (x + i >= 0 && x + i < field[0].length) ? x + i : 'none';

        for (let j = -2; j <= 2; j++) {
            if ((Math.abs(i) == 2 && Math.abs(j) % 2 == 0) == false
                && (Math.abs(j) == 2 && Math.abs(i) % 2 == 0) == false) {
                let newY = (y + j >= 0 && y + j < field.length) ? y + j : 'none';

                if (newX != 'none' && newY != 'none'
                    && field[newY][newX] != 'wall') {
                    nest.push({
                        x: newX,
                        y: newY
                    });
                    console.log(`x:${nest[nest.length - 1].x} || y:${nest[nest.length - 1].y}`);
                }
            }
        }
    }
    drawNest(nest);
}
//-------------------------------------------------------------------------------------------------

//------------------FOOD------------------------------------------------------------------------------------
function drawFood(curFood) {
    ctx.fillStyle = '#F73859';
    for (let i = 0; i < curFood.length; i++) {
        setRect(ctx, curFood[i]);
        field[curFood[i].y][curFood[i].x] = 'food';
    }
}

function placeFood(x, y) {

    let curFood = [];
    for (let i = -2; i <= 2; i++) {
        let newX = (x + i >= 0 && x + i < field[0].length) ? x + i : 'none';

        for (let j = -2; j <= 2; j++) {
            if ((Math.abs(i) == 2 && Math.abs(j) == 2) == false
                && (Math.abs(i) == 1 && Math.abs(j) == 2) == false
                && (Math.abs(i) == 2 && Math.abs(j) == 1) == false) {
                let newY = (y + j >= 0 && y + j < field.length) ? y + j : 'none';

                if (newX != 'none' && newY != 'none'
                    && field[newY][newX] != 'nest' && field[newY][newX] != 'food'
                    && field[newY][newX] != 'wall') {
                    curFood.push({
                        x: newX,
                        y: newY
                    });
                }
            }
        }
    }
    drawFood(curFood);
}
//-------------------------------------------------------------------------------------------------

//---------------------------WATER----------------------------------------------------------------------
function drawWater(curWater) {
    ctx.fillStyle = '#3490DE';
    for (let i = 0; i < curWater.length; i++) {
        setRect(ctx, curWater[i]);
        field[curWater[i].y][curWater[i].x] = 'water';
    }
}

function placeWater(x, y) {

    let curWater = [];
    for (let i = -3; i <= 3; i++) {
        let newX = (x + i >= 0 && x + i < field[0].length) ? x + i : 'none';

        for (let j = -3; j <= 3; j++) {
            if ((Math.abs(i) == 3 && Math.abs(j) == 3) == false) {
                let newY = (y + j >= 0 && y + j < field.length) ? y + j : 'none';

                if (newX != 'none' && newY != 'none'
                    && field[newY][newX] != 'nest' && field[newY][newX] != 'water'
                    && field[newY][newX] != 'wall') {
                    curWater.push({
                        x: newX,
                        y: newY
                    });
                }
            }
        }
    }
    drawWater(curWater);
}
//------------------------------------------------------------------------------------------------------

//------------------CLASSES-------------------------------------------------------------------------------------------

//--------------PHEROMONE------------------------------------------------------------------------------------------------
const maxPheromoneOnPath = 300;
const reduceQuotient = 0.99;
const maxValue = 7;

class cell {
    constructor(cords, length, value, next, prev) {

        this.reversedLength = null;
        this.length = length;
        this.cords = cords;

        this.value = value / reduceQuotient;
        if (this.value > maxValue) {
            this.value = maxValue / reduceQuotient;
        }

        this.prev = prev;

        this.next = [];
        if (next != null) {
            this.next.push(next);
        }
    }

    updateValue(value) {
        if (value == -1) {
            this.value = 0;
        } else {
            this.value += value / reduceQuotient;
            if (this.value > maxValue) {
                this.value = maxValue / reduceQuotient;
            }
        }
    }

    static includes(curValue, index, arr) {
        if (curValue.x == this.x && curValue.y == this.y) {
            return true;
        } else {
            return false;
        }
    }

    getPrev() {
        return this.prev;
    }

    setPrev(prev) {
        this.prev = prev;
    }

    getNext() {
        if (this.next.length > 0) {
            this.next.sort((a, b) => field[b.y][b.x].value - field[a.y][a.x].value);
            return this.next[getRandomIntInclusive(0, this.next.length/2)];
        }
        return null;
    }

    setNext(next) {
        this.next.push(next);
    }

    deleteNext(next) {
        for (let i = 0; i < this.next.length; i++) {
            if (next.x == this.next[i].x && next.y == this.next[i].y) {
                this.next.splice(i, 1);
                break;
            }
        }
    }

    tick() {
        this.value *= reduceQuotient;
        let opacity = this.value / maxValue;

        ctx.fillStyle = `rgba(167, 255, 131, ${opacity})`;
        clearRect(ctx, this.cords);
        setRect(ctx, this.cords);
    }
};

//----------HUNTERANTS---------------------------------------------------------------------------------------------------------
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class hunterAnt {
    constructor() {
        this.cords = nest[getRandomIntInclusive(0, nest.length - 1)];
        this.prevMove = 'none';
        this.length = 0;
        this.back = false;
    }

    static movement = Object.freeze([{ xi: -1, yi: -1 }, { xi: 0, yi: -1 }, { xi: 1, yi: -1 }, { xi: 1, yi: 0 },
    { xi: 1, yi: 1 }, { xi: 0, yi: 1 }, { xi: -1, yi: 1 }, { xi: -1, yi: 0 }]);

    getDirection() {
        let availableNow = [];
        for (let i = 0; i <= 7; i++) {

            let wrongDirection = false;
            for (let j = 3; j <= 5; j++) {
                if ((this.prevMove + j) % 8 == i) {
                    wrongDirection = true;
                    break;
                }
            }

            if (wrongDirection == true) {
                continue;
            }

            let newX = this.cords.x + hunterAnt.movement[i].xi;
            let newY = this.cords.y + hunterAnt.movement[i].yi;

            if (0 <= newX && newX < field[0].length
                && 0 <= newY && newY < field.length) {

                if (field[newY][newX] == 'food' || field[newY][newX] == 'water') {
                    availableNow = [];
                    availableNow.push(i);
                    break;

                } else if (field[newY][newX] != 'wall') {
                    availableNow.push(i);
                }
            }
        }

        if (availableNow.length == 0) {
            availableNow.push((this.prevMove + 4) % 8);
        }
        return availableNow[getRandomIntInclusive(0, availableNow.length - 1)];
    }

    goAhead() {
        let curKey = this.getDirection();

        let newX = this.cords.x + hunterAnt.movement[curKey].xi;
        let newY = this.cords.y + hunterAnt.movement[curKey].yi;

        this.prevCords = this.cords;
        this.cords = {
            x: newX,
            y: newY
        };

        this.prevMove = curKey;
        this.length++;

        if (field[this.cords.y][this.cords.x] == 'nest') {
            this.length = 0;
        }

        if (field[this.cords.y][this.cords.x] == 'water'
            || field[this.cords.y][this.cords.x] == 'food') {

            this.prevMove = 'none';
            this.back = true;
            this.length--;

            field[this.prevCords.y][this.prevCords.x].updateValue(maxPheromoneOnPath / this.length);
            field[this.prevCords.y][this.prevCords.x].setNext(this.cords);

            this.cords = field[this.prevCords.y][this.prevCords.x].getPrev();

        }
    }

    goBack() {
        if (field[this.cords.y][this.cords.x] instanceof cell) {
            this.prevCords = this.cords;
            this.cords = field[this.cords.y][this.cords.x].getPrev();
        } else {
            this.length = 0;
            this.back = false;
        }
    }

    static includes(curValue, index, arr) {
        if (curValue.x == this.x && curValue.y == this.y) {
            return true;
        } else {
            return false;
        }
    }

    drawAnt() {
        if (field[this.prevCords.y][this.prevCords.x] != 'nest') {
            clearRect(antCtx, this.prevCords);
        }

        if (field[this.cords.y][this.cords.x] != 'nest') {

            if (this.back == false) {
                if ((field[this.cords.y][this.cords.x] instanceof cell) == false) {

                    field[this.cords.y][this.cords.x] = new cell(this.cords, this.length, 0, null, this.prevCords);
                } else {
                    if (field[this.cords.y][this.cords.x].length > this.length) {
                        field[this.cords.y][this.cords.x].setPrev(this.prevCords);
                        field[this.cords.y][this.cords.x].length = this.length;
                    } else {
                        this.length = field[this.cords.y][this.cords.x].length;
                    }
                }
            } else {
                field[this.cords.y][this.cords.x].updateValue(maxPheromoneOnPath / this.length);
                field[this.cords.y][this.cords.x].setNext(this.prevCords);
            }

            antCtx.fillStyle = '#6A2C70';
            setRect(antCtx, this.cords);
        }
    }

    move() {
        if (this.back == false) {
            this.goAhead();
        } else {
            this.goBack();
        }
        this.drawAnt();
    }
};

//-----------PLODDERS-----------------------------------------------------------------------------------------------------------
class plodderAnt {
    constructor() {
        this.cords = nest[getRandomIntInclusive(0, nest.length - 1)];
        this.prevCords;
        this.length = 0;
        this.back = false;
    }

    static movement = Object.freeze([{ xi: -1, yi: -1 }, { xi: 0, yi: -1 }, { xi: 1, yi: -1 }, { xi: 1, yi: 0 },
    { xi: 1, yi: 1 }, { xi: 0, yi: 1 }, { xi: -1, yi: 1 }, { xi: -1, yi: 0 }]);

    getDirection() {
        let availableNow = [];
        for (const move of plodderAnt.movement) {
            let newX = this.cords.x + move.xi;
            let newY = this.cords.y + move.yi;

            if (0 <= newX && newX < field[0].length
                && 0 <= newY && newY < field.length) {

                if (field[newY][newX] instanceof cell && field[newY][newX].value > 0
                     && field[newY][newX].next.length > 0) {
                    return {
                        x: newX,
                        y: newY
                    };
                } else if (field[newY][newX] == 'nest') {
                    availableNow.push({
                        x: newX,
                        y: newY
                    });
                }
            }
        }

        return availableNow[getRandomIntInclusive(0, availableNow.length - 1)];
    }

    findFood(cords) {
        for (const move of plodderAnt.movement) {
            let newX = cords.x + move.xi;
            let newY = cords.y + move.yi;

            if (0 <= newX && newX < field[0].length
                && 0 <= newY && newY < field.length) {

                if (field[newY][newX] == 'water' || field[newY][newX] == 'food') {
                    return {
                        x: newX,
                        y: newY
                    };
                }
            }
        }
        return null;
    }

    goAhead() {
        let goTo;

        let additFood = this.findFood(this.cords);
        if (additFood != null) {
            goTo = additFood;
        } else {
            goTo = ((field[this.cords.y][this.cords.x] instanceof cell) == false)
                ? this.getDirection() : field[this.cords.y][this.cords.x].getNext();

            if (goTo == null) {
                [this.prevCords, this.cords] = [this.cords, this.prevCords];
                this.length = Infinity;
                this.back = true;

                if (field[this.cords.y][this.cords.x] instanceof cell) {
                    field[this.cords.y][this.cords.x].deleteNext(this.prevCords);
                    field[this.prevCords.y][this.prevCords.x].updateValue(-1);
                }
                return;

            } else if (field[goTo.y][goTo.x] instanceof cell) {
                this.length++;
            }
        }

        this.prevCords = this.cords;
        this.cords = goTo;

        if (field[this.cords.y][this.cords.x] == 'water'
            || field[this.cords.y][this.cords.x] == 'food') {

            [this.prevCords, this.cords] = [this.cords, this.prevCords];
            this.back = true;

            field[this.prevCords.y][this.prevCords.x] = new cell(this.prevCords, this.length,
                maxPheromoneOnPath / this.length, null, this.cords);

            field[this.cords.y][this.cords.x].setNext(this.prevCords);
        }
    }

    goBack() {
        if (field[this.cords.y][this.cords.x] instanceof cell) {
            this.prevCords = this.cords;
            this.cords = field[this.cords.y][this.cords.x].getPrev();
        } else {
            this.cords = nest[getRandomIntInclusive(0, nest.length - 1)];
            this.length = 0;
            this.back = false;
        }
    }

    static includes(curValue, index, arr) {
        if (curValue.x == this.x && curValue.y == this.y) {
            return true;
        } else {
            return false;
        }
    }

    drawAnt() {
        if (field[this.prevCords.y][this.prevCords.x] != 'nest') {
            clearRect(antCtx, this.prevCords);
        }

        if (field[this.cords.y][this.cords.x] != 'nest') {

            if (this.back == true) {
                field[this.cords.y][this.cords.x].updateValue(maxPheromoneOnPath / this.length);
            }

            antCtx.fillStyle = '#35170c';
            setRect(antCtx, this.cords);
        }
    }

    move() {
        if (this.back == false) {
            this.goAhead();
        } else {
            this.goBack();
        }
        this.drawAnt();
    }
};

//--------------------------------------------------------------------------------------------

//---------------BUTTONS-------------------------------------------------------------------------

let startButton = document.getElementsByClassName("start")[0];
startButton.onclick = () => {
    let hunterAnts = [];
    for (let i = 0; i < 7; i++) {
        hunterAnts.push(new hunterAnt());
    }

    let plodderAnts = [];
    for (let i = 0; i < 15; i++) {
        plodderAnts.push(new plodderAnt());
    }

    setTimeout(function tick() {
        for (let ant of hunterAnts) {
            ant.move();
        }
        for (let ant of plodderAnts) {
            ant.move();
        }
        for (let y = 0; y < field.length; y++) {
            for (let x = 0; x < field[0].length; x++) {
                if (field[y][x] instanceof cell) {
                    field[y][x].tick();
                }
            }
        }
        setTimeout(tick, 100);
    }, 100);
}

let toDo = 'none';
antCanvas.addEventListener('mousedown', function (e) {
    console.log(`${e.offsetX} ${e.offsetY}\n${e.clientX} ${e.clientX}`);

    let newX = Math.floor(e.offsetX / scale);
    let newY = Math.floor(e.offsetY / scale);

    switch (toDo) {
        case 'setNest':
            if (field[newY][newX] != 'wall') {
                placeNest(newX, newY);
            }
            break;
        case 'setFood':
            placeFood(newX, newY);
            break;
        case 'setWater':
            placeWater(newX, newY);
            break;
        default:
    }
});

let NestButton = document.getElementsByClassName("setNest")[0];
NestButton.onclick = () => {
    toDo = 'setNest';
};

let foodButton = document.getElementsByClassName("setFood")[0];
foodButton.onclick = () => {
    toDo = 'setFood';
}

let waterButton = document.getElementsByClassName("setWater")[0];
waterButton.onclick = () => {
    toDo = 'setWater';
}

let clearButton = document.getElementsByClassName("clear")[0];
clearButton.onclick = () => {
    toDo = 'none';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < field.length; i++) {
        field[i].fill(0);
    }
}

let caveButton = document.getElementsByClassName("cave")[0];
caveButton.onclick = () => {
    let cave = generateCave();

    for (let i = 0; i < cave.length; i++) {
        for (let j = 0; j < cave[0].length; j++) {
            if (cave[i][j] == true) {
                ctx.fillStyle = '#896635';
                field[i][j] = 'wall';
            } else {
                ctx.fillStyle = '#9c855d';
                field[i][j] = 0;
            }
            setRect(ctx, { x: j, y: i });
        }
    }
}
