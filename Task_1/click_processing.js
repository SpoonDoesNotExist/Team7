import { board, Cell, wereMousedown, Point } from './A_star_new.js';
import { DrawBoardElemState } from './board.js';


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



export { boardElementClickHandler };