
class individual {
    constructor(bypass) {
        this.bypass = bypass;
    }

    getLengthBtwDots(d1, d2) {
        // if (d1 == undefined || d2 == undefined) {
        //     console.log(`За что ${d1} | ${d2}`);
        //     return 1;
        // }
        return Math.sqrt(Math.pow(d1.x - d2.x, 2) + Math.pow(d1.y - d2.y, 2));
    }

    countWeight(startNode) {
        this.weight = this.getLengthBtwDots(startNode, this.bypass[0]) + this.getLengthBtwDots(this.bypass[this.bypass.length - 1], startNode);
        for (let i = 0; i < this.bypass.length - 1; i++) {
            this.weight += this.getLengthBtwDots(this.bypass[i], this.bypass[i + 1]);
        }
    }
}


// Генератор рандомных целых чисел на [min;max]
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Инициализируем Список вершин графа
let nodeList = [];

// Количество вершин в геноме каждой особи
let genomSize;

// Задаем количество особей
let populationCount = 50;

// Вывести массив в консоль
function write(array) {
    console.log("Writing...");
    for (let i = 0; i < array.length; i++) {
        // console.log(`${array[i].x} ${array[i].y}`);
        console.log(`${array[i].weight}`);
    }
}

// Вторая функция рандома - алгоритм под названием Тасование Фишера — Йетса
function getRandomGenom() {
    // write(nodeList);
    for (let i = nodeList.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * i) + 1;

        [nodeList[i], nodeList[j]] = [nodeList[j], nodeList[i]];
    }
    // write(nodeList);

    let genom = JSON.parse(JSON.stringify(nodeList));
    genom.shift();
    // write(genom);

    return genom;
}

// Функция, которая генерирует и возвращает начальное поколение
function setInitialGeneration() {
    let initialGeneration = [];

    for (let i = 0; i < populationCount; i++) {
        // let curIndividual = [];
        // console.log(`Подбор для ${i} особи`);
        // for (let j = 2; curIndividual.length < nodeList.length - 1; j++) {

        //     console.log(`Подбор ${j} гена`);
        //     let toInclude = getRandomIntInclusive(0, nodeList.length - j);

        //     console.log(`Индекс ${j}ного гена в массиве вершин: ${toInclude}`);
        //     curIndividual.push(nodeList[toInclude]);

        //     console.log(`До смены мест: ${nodeList[toInclude].x} ${nodeList[toInclude].y} || ${nodeList[nodeList.length - j].x} ${nodeList[nodeList.length - j].y}`);

        //     let toSwap = nodeList[toInclude];
        //     nodeList[toInclude] = nodeList[nodeList.length - j];
        //     nodeList[nodeList.length - j] = toSwap;

        //     console.log(`После смены мест: ${nodeList[toInclude].x} ${nodeList[toInclude].y} || ${nodeList[nodeList.length - j].x} ${nodeList[nodeList.length - j].y}`);
        // }
        // console.log(`Текущая особь: ${curIndividual}`);
        //let individ = new individual(getRandomGenom());
        //console.log(`${ind.bypass[0].x} ${ind.bypass[0].y} || ${ind.bypass[1].x} ${ind.bypass[1].y} || ${ind.bypass[2].x} ${ind.bypass[2].y}`);
        initialGeneration.push(new individual(getRandomGenom()));
    }
    //console.log(`Начальная популяция: ${initialGeneration}`);

    for (let i = 0; i < populationCount; i++) {

        console.log(`Путь ${i} особи:`)
        // for (let j = 0; j < initialGeneration[i].bypass.length; j++) {
        //     console.log(initialGeneration[i].bypass[j]);
        // }

        initialGeneration[i].countWeight(nodeList[0]);
        console.log(`Вес пройденного пути: ${initialGeneration[i].weight}`);
    }

    return initialGeneration;
}

// Элементы с наименьшими весами будут в левой части массива
function forSort(left, right) {
    if (left.weight <= right.weight) {
        return -1;
    } else {
        return 1;
    }
}

//Поле для линий и доп точек
let forBest = document.getElementsByClassName("canvas")[0];
let bestCtx = forBest.getContext('2d');

//Поле для вершин
let field = document.getElementsByClassName("canvas")[1];
console.log(field);

let ctx = field.getContext('2d');
//---------------------------------------------------------

//Хранит последнюю красную точку для ее переопределения
let lastDrawed = {
    x: -10,
    y: -10
};

function showBestPath(bestBypass) {
    // Очистка линий
    bestCtx.clearRect(0, 0, forBest.width, forBest.height);

    // Перекрашивание предыдущей последней вершины
    ctx.fillStyle = 'cyan';
    ctx.beginPath();
    ctx.arc(lastDrawed.x, lastDrawed.y, 11, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.stroke();

    // Генерация новых линий
    bestCtx.strokeStyle = 'black';
    bestCtx.lineWidth = 4.8;
    bestCtx.beginPath();

    bestCtx.moveTo(nodeList[0].x, nodeList[0].y);
    bestCtx.lineTo(bestBypass[0].x, bestBypass[0].y);

    for (let i = 1; i < genomSize; i++) {
        bestCtx.lineTo(bestBypass[i].x, bestBypass[i].y);
    }

    bestCtx.lineTo(nodeList[0].x, nodeList[0].y);
    bestCtx.closePath();
    bestCtx.stroke();
    //-------------------------------------------------------

    //Отмечаем стартовую вершину
    if (lastDrawed.x == -10) {
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(nodeList[0].x, nodeList[0].y, 11, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.stroke();
    }

    //Отмечаем новую последнюю вершину
    lastDrawed = bestBypass[genomSize - 1];
    ctx.fillStyle = 'red';

    ctx.beginPath();
    ctx.arc(lastDrawed.x, lastDrawed.y, 11, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.stroke();
    //-------------------------------------------------------

    // console.log("Лучший путь");
    // console.log(`${nodeList[0].x} | ${nodeList[0].y}`);
    // for (let i = 0; i < bestBypass.length; i++) {
    //     console.log(`${bestBypass[i].x} | ${bestBypass[i].y}`);
    // }
    // console.log(`${nodeList[0].x} | ${nodeList[0].y}`);
}

function getChild(parent1, parent2) {
    let border = getRandomIntInclusive(1, genomSize - 1);

    // if (Math.random() < 0.5) {
    //     console.log("До изменения---------------------------");
    //     console.log(`${parent1.weight} | ${parent2.weight}`);
    //     [parent1, parent2] = [parent2, parent1];
    //     console.log(`${parent1.weight} | ${parent2.weight}`);
    //     console.log("После изменения---------------------------");
    // }

    let newGenom = parent1.bypass.slice(0, border);
    
    for (let k = 0; k < genomSize && newGenom.length < genomSize; k++) {
        if (newGenom.some(function (curValue, index, arr) {
            if (curValue.x == this.x && curValue.y == this.y) {
                return true;
            } else {
                return false;
            }
        }, parent2.bypass[k]) == false) {
            newGenom.push(parent2.bypass[k]);
        }
    }

    let child = new individual(newGenom);

    //Шанс на мутацию 40%
    if (Math.random() < 0.3) {
        let repeats = getRandomIntInclusive(genomSize/3, genomSize - 1);
        for (let j = 0; j < repeats; j++) {

            let gen1, gen2;
            do {
                gen1 = getRandomIntInclusive(0, genomSize - 1);
                gen2 = getRandomIntInclusive(0, genomSize - 1);
            } while (gen1 == gen2);

            [child.bypass[gen1], child.bypass[gen2]] = [child.bypass[gen2], child.bypass[gen1]];
        }
    }

    child.countWeight(nodeList[0]);
    return child;
}

function getNextGeneration(curGeneration) {

    let nextGeneration = [];
    // for (let par1 = 0; par1 < populationCount - 1; par1++) {
    //     for (let par2 = par1 + 1; par2 < populationCount; par2++) {
    //         let child = getChild(curGeneration[par1], curGeneration[par2]);
    //         nextGeneration.push(child);
    //     }
    // }

    for (let i = 0; i < populationCount*9/10; i++) {
        let parent1, parent2;
        do {
            parent1 = curGeneration[getRandomIntInclusive(0, populationCount - 1)];
            parent2 = curGeneration[getRandomIntInclusive(0, populationCount - 1)];
        } while (parent1 === parent2);

        let child = getChild(parent1, parent2);
        nextGeneration.push(child);
    }

    let naturalSelection = curGeneration.slice(0, populationCount/10).concat(nextGeneration);
    naturalSelection.sort(forSort);
    return naturalSelection;
}

//Сам алгоритм
function geneticAlgorithm() {
    console.log("Начало алгоритма");
    let curGeneration = setInitialGeneration();
    curGeneration.sort(forSort);

    console.log("Начало цикла");
    console.log("--------------------------------------------------------------");
    for (let generationNumber = 1; generationNumber <= 1000; generationNumber++) {

        curGeneration = getNextGeneration(curGeneration);
        showBestPath(curGeneration[0].bypass);

        console.log(`${generationNumber} поколение прошло`);
        console.log(`Вес лучшего пути: ${curGeneration[0].weight}`);
        console.log("--------------------------------------------------------------");

        //console.log("До сортировки:");
        //write(curGeneration);
        //console.log("После сортировки:");
        //write(curGeneration);

        // Формируем следующее поколение
        // let nextGeneration = [];
        // for (let i = 0; i < populationCount; i++) {

        //     let parent1, parent2;
        //     do {
        //         parent1 = curGeneration[getRandomIntInclusive(0, populationCount - 1)];
        //         parent2 = curGeneration[getRandomIntInclusive(0, populationCount - 1)];
        //     } while (parent1 === parent2);

        //     let border = getRandomIntInclusive(1, genomSize - 1);
        //     let newGenom = parent1.bypass.slice(0, border);

        //     for (let k = 0; k < genomSize; k++) {
        //         if (newGenom.some(function (curValue, index, arr) {
        //             if (curValue.x == this.x && curValue.y == this.y) {
        //                 return true;
        //             } else {
        //                 return false;
        //             }
        //         }, parent2.bypass[k]) == false) {
        //             newGenom.push(parent2.bypass[k]);
        //         }
        //     }

        //     let child = new individual(newGenom);

        //     //Шанс на мутацию 25%
        //     if (Math.random() < 0.4) {
        //         let repeats = getRandomIntInclusive(0, genomSize - 1);
        //         for (let j = 0; j < repeats; j++) {

        //             let gen1, gen2;
        //             do {
        //                 gen1 = getRandomIntInclusive(0, genomSize - 1);
        //                 gen2 = getRandomIntInclusive(0, genomSize - 1);
        //             } while (gen1 == gen2);

        //             [child.bypass[gen1], child.bypass[gen2]] = [child.bypass[gen2], child.bypass[gen1]];
        //         }
        //     }

        //     child.countWeight(nodeList[0]);
        //     curGeneration.push(child);
        // }
        //---------------------------------------------------------------------------------------------
        // for (let i = 0; i < populationCount / 2; i++) {
        //     for (let j = 0; j < populationCount / 2; j++) {

        //         if (i == j) {
        //             continue;
        //         }

        //         let border = getRandomIntInclusive(1, genomSize - 1);
        //         let newGenom = curGeneration[i].bypass.slice(0, border);

        //         for (let k = 0; k < genomSize; k++) {
        //             if (newGenom.some(function(curValue, index, arr) {
        //                 if(curValue.x == this.x && curValue.y == this.y) {
        //                     return true;
        //                 } else {
        //                     return false;
        //                 }
        //             }, curGeneration[j].bypass[k]) == false) {
        //                 newGenom.push(curGeneration[j].bypass[k]);
        //             }
        //         }

        //         let child = new individual(newGenom);

        //         //Шанс на мутацию 25%
        //         if (Math.random() < 0.4) {
        //             let gen1, gen2;
        //             do {
        //                 gen1 = getRandomIntInclusive(0, genomSize - 1);
        //                 gen2 = getRandomIntInclusive(0, genomSize - 1);
        //             } while (gen1 == gen2);

        //             [child.bypass[gen1], child.bypass[gen2]] = [child.bypass[gen2], child.bypass[gen1]];
        //         }

        //         console.log(`Считаем вес i=${i} j=${j}`);
        //         child.countWeight(nodeList[0]);
        //         console.log(`Вес: ${child.weight}`);

        //         curGeneration.push(child);
        //         // nextGeneration.push(child);
        //     }
        // }
        // nextGeneration.sort(forSort);

        // curGeneration.sort(forSort);
        // curGeneration = curGeneration.slice(0, populationCount);
        // showBestPath(curGeneration[0].bypass);

        // console.log('Смена поколений');
        // write(nextGeneration);

        // // curGeneration = nextGeneration.slice(0, populationCount);

        // console.log('----------------------------------------------------------');
        // write(curGeneration);
    }
    console.log("Алгоритм закончен!");
}

// let field = document.getElementsByClassName("canvas")[1];
// console.log(field);

// let ctx = field.getContext('2d');

// Обработка расположения вершин (точек)
let fieldRect = field.getBoundingClientRect();
let allowSetDots = false;
field.addEventListener('mousedown', function (e) {

    if (allowSetDots) {
        //Вывод положения в окне и на экране
        console.log(`
        relX: ${e.offsetX} abs: ${e.clientX}
        relY: ${e.offsetY} abs: ${e.clientY}
        `);

        let curNode = {
            x: e.offsetX,
            y: e.offsetY
        };

        let radius = 11;

        let noCross = true;
        for (const node of nodeList) {
            if (Math.abs(node.x - curNode.x) < radius * 2 && Math.abs(node.y - curNode.y) < radius * 2) {
                noCross = false;
                break;
            }
        }

        // Проверка на то, чтобы визуализации вершин не пересекались
        if (noCross) {
            ctx.fillStyle = 'cyan';


            ctx.beginPath();
            ctx.arc(e.clientX - fieldRect.left, e.clientY - fieldRect.top, radius, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.stroke();

            nodeList.push(curNode);
        }
    }
});

// nodeList.push({
//     x:122,
//     y:100
// })

// nodeList.push({
//     x:14,
//     y:11
// })

// nodeList.push({
//     x:129,
//     y:115
// })

// nodeList.push({
//     x:112,
//     y:44
// })

// nodeList.push({
//     x:6,
//     y:135
// })

// nodeList.push({
//     x:141,
//     y:68
// })

// nodeList.push({
//     x:54,
//     y:78
// })

// nodeList.push({
//     x:165,
//     y:54
// })

// nodeList.push({
//     x:84,
//     y:25
// })

// nodeList.push({
//     x:96,
//     y:89
// })

// nodeList.push({
//     x:76,
//     y:148
// })

let startButton = document.getElementsByClassName('start')[0];
startButton.onclick = () => {
    if (nodeList.length > 1) {

        populationCount = nodeList.length*10;
        genomSize = nodeList.length - 1;
        allowSetDots = false;
        geneticAlgorithm();

    } else {
        alert('Укажите больше 1 вершины!');
    }
};
console.log(startButton);



let setDots = document.getElementsByClassName('setDots')[0];
setDots.onclick = () => {
    allowSetDots = !allowSetDots;
};
console.log(setDots);



// При каждом изменении размера окна, делаем корректным видимость курсора внутри окна
window.addEventListener('resize', function () {
    fieldRect.getBoundingClientRect();
})