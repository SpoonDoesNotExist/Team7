import { board } from './A_star_new.js';
export { cutCornerCheck };

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