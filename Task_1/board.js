import { stateColorsMap, board, drawPathIterSleep, sleep, doMouseMoveTrue } from './A_star_new.js';
import { boardElementClickHandler } from './click_processing.js';

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
            board_elem.onmouseover = function() {
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

export { DrawBoardElem, DrawBoardElemState, DrawPath, generateField };