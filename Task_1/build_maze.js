import { Point, board, tractorsCount, allowed, generateField } from './A_star_new.js';

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

    for (let d of moveDirections) {
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

async function buildMaze() {
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

}

export { buildMaze };