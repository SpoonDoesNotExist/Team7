import { currentHeuristics, ortoghonalWeight, diagonalWeight } from "./A_star_new.js";

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

export { calculateHeuristics };