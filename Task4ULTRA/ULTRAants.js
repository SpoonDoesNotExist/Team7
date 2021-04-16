let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');

let field = new Array(canvas.height / 20);
field.fill(0);
for (let i = 0; i < field.length; i++) {
    field[i] = new Array(canvas.width / 20);
    field[i].fill(0);
}

let setNest = false;

function clearRect(x, y) {
    ctx.clearRect(x * 20, y * 20, 20, 20);
}

function setRect(x, y) {
    ctx.fillRect(x * 20, y * 20, 20, 20);
}

//----------------MAZE(CAVE)----------------------------------------------------------------------------

let aliveChance = 0.35;
let deathLimit = 3;
let birthLimit = 4;
let stepsCount = 10;

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
                // if (aliveCount < 2 || aliveCount > 3) {
                //     newCave[i][j] = false;
                // } else {
                //     newCave[i][j] = cave[i][j];
                // }
                if (wallCount < deathLimit) {
                    newCave[i][j] = false;
                } else {
                    newCave[i][j] = cave[i][j];
                }

            } else {
                // if (aliveCount == 3) {
                //     newCave[i][j] = true;
                // } else {
                //     newCave[i][j] = cave[i][j];
                // }
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

    let cave = new Array(canvas.height / 20);
    for (let i = 0; i < cave.length; i++) {
        cave[i] = new Array(canvas.width / 20);
        cave[i].fill(false);

        for (let j = 0; j < cave[i].length; j++) {
            if (Math.random() < aliveChance) {
                cave[i][j] = true;
            }

            // if (cave[i][j] == true) {
            //     ctx.fillStyle = 'black';
            // } else {
            //     ctx.fillStyle = 'blue';
            // }
            // setRect(j, i);
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
    ctx.fillStyle = '#393232';
    for (let i = 0; i < nest.length; i++) {
        setRect(nest[i].x, nest[i].y);
        field[nest[i].y][nest[i].x] = 'nest';
    }
}

function clearNest(nest) {
    ctx.fillStyle = '#F07B3F';
    for (let i = 0; i < nest.length; i++) {
        setRect(nest[i].x, nest[i].y);
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
        setRect(curFood[i].x, curFood[i].y);
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
        setRect(curWater[i].x, curWater[i].y);
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

//----------CLASSES----------------------------------------------------------------------------------------
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// const movement = new Map([
//     ['left', {
//         xi: -1,
//         yi: 0
//     }],
//     ['up', {
//         xi: 0,
//         yi: -1
//     }],
//     ['right', {
//         xi: 1,
//         yi: 0
//     }],
//     ['down', {
//         xi: 0,
//         yi: 1
//     }],
//     ['left-up', {
//         xi: -1,
//         yi: -1
//     }],
//     ['right-up', {
//         xi: 1,
//         yi: -1
//     }],
//     ['right-down', {
//         xi: 1,
//         yi: 1
//     }],
//     ['left-down', {
//         xi: -1,
//         yi: 1
//     }],
// ]);

class hunterAnt {
    constructor() {
        this.cords = nest[getRandomIntInclusive(0, nest.length - 1)];
        this.prevMove = 'none';
        this.path = [];
        this.path.push(this.cords);
        this.back = false;
    }

    static movement = Object.freeze([{xi: -1, yi: -1}, {xi: 0, yi: -1}, {xi: 1, yi: -1}, {xi: 1, yi: 0},
                                {xi: 1, yi: 1}, {xi: 0, yi: 1}, {xi: -1, yi: 1}, {xi: -1, yi: 0}]);

    goAhead() {
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
        let curKey = availableNow[getRandomIntInclusive(0, availableNow.length - 1)];

        let newX = this.cords.x + hunterAnt.movement[curKey].xi;
        let newY = this.cords.y + hunterAnt.movement[curKey].yi;

        this.prevCords = this.cords;
        this.cords = {
            x:newX,
            y:newY
        };

        this.path.push(this.cords);
        this.prevMove = curKey;

        if (field[this.cords.y][this.cords.x] == 'water'
            || field[this.cords.y][this.cords.x] == 'food') {

            this.back = true;
            this.prevMove = 'none';

            this.path.pop();
            this.prevCords = this.path.pop();
            this.cords = this.path.pop();
        }
    }

    goBack() {
        if (this.path.length > 0) {
            this.prevCords = this.cords;
            this.cords = this.path.pop();
        } else {
            this.back = false;
        }
    }

    includes(curValue, index, arr) {
        if (curValue.x == this.x && curValue.y == this.y) {
            return true;
        } else {
            return false;
        }
    }

    drawAnt() {
        if (nest.some(this.includes, this.prevCords) == false) {
            if (this.back == false) {
                ctx.fillStyle = '#F07B3F';
            } else {
                ctx.fillStyle = '#9DF3C4';
            }
            setRect(this.prevCords.x, this.prevCords.y);
        }

        if (nest.some(this.includes, this.cords) == false) {
            ctx.fillStyle = '#6A2C70';
            setRect(this.cords.x, this.cords.y);
        }
    }

    move() {
        if (this.back == false) {
            this.goAhead();
        } else {
            this.goBack();
        }
        //console.log('move');
        this.drawAnt();
    }
}

let startButton = document.getElementsByClassName("start")[0];
startButton.onclick = () => {
    let ants = [];
    for (let i = 0; i < 3; i++) {
        ants.push(new hunterAnt());
    }
    setTimeout(function tick() {
        for (let ant of ants) {
            ant.move();
        }
        setTimeout(tick, 50);
    }, 50);
}

//---------------BUTTONS-------------------------------------------------------------------------
let toDo = 'none';
canvas.addEventListener('mousedown', function (e) {
    console.log(`${e.offsetX} ${e.offsetY}\n${e.clientX} ${e.clientX}`);

    let newX = Math.floor(e.offsetX / 20);
    let newY = Math.floor(e.offsetY / 20);

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
                ctx.fillStyle = '#FFD460';
                field[i][j] = 'wall';
            } else {
                ctx.fillStyle = '#F07B3F';
                field[i][j] = 0;
            }
            setRect(j, i);
        }
    }
}