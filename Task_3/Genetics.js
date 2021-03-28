
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

    countWeight() {
        this.weight = this.getLengthBtwDots(this.bypass[this.bypass.length - 1], this.bypass[0]);
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
        let j = Math.floor(Math.random() * (i + 1));

        [nodeList[i], nodeList[j]] = [nodeList[j], nodeList[i]];
    }
    // write(nodeList);

    let genom = JSON.parse(JSON.stringify(nodeList));
    // genom.shift();
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

        initialGeneration[i].countWeight();
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
let forLines = document.getElementById("forLines");
let bestCtx = forLines.getContext('2d');

//Поле для вершин
let field = document.getElementById("forDots");
console.log(field);

let ctx = field.getContext('2d');
//---------------------------------------------------------

//Храним последние красную и зеленую точки для их переопределения
let lastDrawedRed = {
    x: -10,
    y: -10
};

let lastDrawedGreen = {
    x: -10,
    y: -10
};

function resetLines() {
    // Очистка линий
    bestCtx.clearRect(0, 0, forLines.width, forLines.height);

    // Перекрашивание предыдущей последней вершины
    ctx.fillStyle = '#EEEEEE';
    ctx.beginPath();
    ctx.arc(lastDrawedRed.x, lastDrawedRed.y, 11, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.stroke();

    // Перекрашивание предыдущей стартовой вершины
    ctx.beginPath();
    ctx.arc(lastDrawedGreen.x, lastDrawedGreen.y, 11, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.stroke();
}

function drawLines(bestBypass, strokeStyle, lineWidth) {
    // Генерация новых линий
    bestCtx.strokeStyle = strokeStyle;
    bestCtx.lineWidth = lineWidth;
    bestCtx.beginPath();

    bestCtx.moveTo(bestBypass[0].x, bestBypass[0].y);

    for (let i = 1; i < genomSize; i++) {
        bestCtx.lineTo(bestBypass[i].x, bestBypass[i].y);
    }

    bestCtx.lineTo(bestBypass[0].x, bestBypass[0].y);
    bestCtx.closePath();
    bestCtx.stroke();
    //-------------------------------------------------------

    //Отмечаем стартовую вершину
    lastDrawedGreen = bestBypass[0];
    ctx.fillStyle = '#4ECCA3';

    ctx.beginPath();
    ctx.arc(lastDrawedGreen.x, lastDrawedGreen.y, 11, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.stroke();

    //Отмечаем новую последнюю вершину
    lastDrawedRed = bestBypass[genomSize - 1];
    ctx.fillStyle = '#FF2E63';

    ctx.beginPath();
    ctx.arc(lastDrawedRed.x, lastDrawedRed.y, 11, 0, Math.PI * 2, false);
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

function showBestPath(bestBypass) {
    resetLines();
    drawLines(bestBypass, '#D3D4D8', 4.8);
}

// function Mutation(generation) {
//     for (let i = nodeList.length; i < populationCount; i++) {
//         //Шанс на мутацию 40%
//         if (Math.random() < 0.3) {

//             let border = getRandomIntInclusive(1, genomSize - 1);
//             let part1 = generation[i].bypass.slice(0, border);
//             let part2 = generation[i].bypass.slice(border, genomSize);
//             generation[i].bypass = part1.reverse().concat(part2.reverse());
//             generation[i].countWeight();

//             // let gen1, gen2;
//             // do {
//             //     gen1 = getRandomIntInclusive(0, genomSize - 1);
//             //     gen2 = getRandomIntInclusive(0, genomSize - 1);
//             // } while (gen1 === gen2);

//             // [generation[i].bypass[gen1], generation[i].bypass[gen2]] = [generation[i].bypass[gen2], generation[i].bypass[gen1]];
//             // generation[i].countWeight();
//         }
//     }
//     return generation;
// }
let mutationPercent = 0.7;
function mutationChance(child) {
    //Шанс на мутацию 70%
    if (Math.random() < mutationPercent) {

        // let repeats = getRandomIntInclusive(1, 1);
        // for (let j = 0; j < repeats; j++) {
        //     let gen1, gen2;
        //     do {
        //         gen1 = getRandomIntInclusive(0, genomSize - 1);
        //         gen2 = getRandomIntInclusive(0, genomSize - 1);
        //     } while (gen1 == gen2);

        //     [child.bypass[gen1], child.bypass[gen2]] = [child.bypass[gen2], child.bypass[gen1]];
        // }
        // let gen1, gen2;
        // do {
        //     gen1 = getRandomIntInclusive(0, genomSize - 1);
        //     gen2 = getRandomIntInclusive(0, genomSize - 1);           
        // } while (gen1 == gen2);
        // [child.bypass[gen1], child.bypass[gen2]] = [child.bypass[gen2], child.bypass[gen1]];

        // let border = getRandomIntInclusive(1, genomSize - 1);

        // let part1 = child.bypass.slice(0, border).reverse();
        // let part2 = child.bypass.slice(border, genomSize).reverse();

        // child.bypass = part1.concat(part2);

        let repeats = getRandomIntInclusive(1, 3);
        for (let j = 0; j < repeats; j++) {
            let border1, border2;
            do {
                border1 = getRandomIntInclusive(0, genomSize);
                border2 = getRandomIntInclusive(0, genomSize);
            } while (border1 == border2);

            if (border1 > border2) {
                [border1, border2] = [border2, border1];
            }

            let part1 = child.bypass.slice(0, border1);
            let part2 = child.bypass.slice(border1, border2).reverse();
            let part3 = child.bypass.slice(border2, genomSize);

            child.bypass = part1.concat(part2, part3);
        }
    }

    return child;
}

function includes(curValue, index, arr) {
    if (curValue.x == this.x && curValue.y == this.y) {
        return true;
    } else {
        return false;
    }
}

function getChild(parent1, parent2) {

    let border = getRandomIntInclusive(1, genomSize - 1);
    let newGenom = parent1.bypass.slice(0, border);

    for (let k = border; k < genomSize; k++) {
        if (newGenom.some(includes, parent2.bypass[k]) == false) {
            newGenom.push(parent2.bypass[k]);
        }
    }

    if (newGenom.length < genomSize) {
        for (let k = border; newGenom.length < genomSize; k++) {
            if (newGenom.some(includes, parent1.bypass[k]) == false) {
                newGenom.push(parent1.bypass[k]);
            }
        }
    }

    let child = new individual(newGenom);
    child = mutationChance(child);

    child.countWeight();
    return child;
}

function getNextGeneration(curGeneration) {

    let nextGeneration = [];
    // for (let par1 = 0; par1 < populationCount - 1; par1++) {
    //     for (let par2 = par1 + 1; par2 < populationCount; par2++) {

    //         let child = getChild(curGeneration[par1], curGeneration[par2]);
    //         nextGeneration.push(child);

    //         let secChild = getChild(curGeneration[par2], curGeneration[par1]);
    //         nextGeneration.push(secChild);
    //     }
    // }

    for (let i = 0; i < populationCount*10; i++) {
        let parent1, parent2;
        do {
            parent1 = curGeneration[getRandomIntInclusive(0, populationCount - 1)];
            parent2 = curGeneration[getRandomIntInclusive(0, populationCount - 1)];
        } while (parent1 === parent2);

        let child = getChild(parent1, parent2);
        nextGeneration.push(child);

        let secChild = getChild(parent2, parent1);
        nextGeneration.push(secChild);
    }

    let naturalSelection = curGeneration.slice(0, populationCount*0.3).concat(nextGeneration);
    naturalSelection.sort(forSort);
    return naturalSelection.slice(0, populationCount);
    // curGeneration.sort(forSort);
    // return curGeneration.slice(0, populationCount);
}

//Сам алгоритм
function geneticAlgorithm() {
    console.log("Начало алгоритма");
    let curGeneration = setInitialGeneration();
    curGeneration.sort(forSort);

    let theBestIndivid = curGeneration[0];
    showBestPath(theBestIndivid.bypass);

    let bestNoChanged = 0;
    let bestGeneration = 1;

    console.log("Начало цикла");
    console.log("--------------------------------------------------------------");

    let generationNumber = 1, childrenCount = 0;
    setTimeout(function runAlgorithm() {

        curGeneration = getNextGeneration(curGeneration);
        //showBestPath(curGeneration[0].bypass);

        bestNoChanged++;
        // if (mutationPercent < 0.7) {
        //     mutationPercent += 0.005;
        // }
        if (curGeneration[0].weight < theBestIndivid.weight) {

            console.log(`${generationNumber} поколений прошло`);
            console.log(`Предыдущий лучший путь был в ${bestGeneration} поколении`);
            console.log(`Вес лучшего пути: ${theBestIndivid.weight}`);
            console.log(`Количество потомков: ${childrenCount}`);
            console.log("--------------------------------------------------------------");

            theBestIndivid = curGeneration[0];

            let bestWeight = Math.round(theBestIndivid.weight*100)/100;
            bestWeight = bestWeight.toString().replace('.', ',');
            mostCheapBypass.innerHTML = `Самый выгодный обход: ${bestWeight}...$`;

            // console.log(``);
            bestNoChanged = 0;
            //mutationPercent = 0.1;
            bestGeneration = generationNumber;
            showBestPath(theBestIndivid.bypass);
        }

        generationNumber++;
        currentGeneration.innerHTML = `Текущее поколение: №${generationNumber}`;

        childrenCount += populationCount * 20;
        children.innerHTML = `Было рождено: ${childrenCount} потомков`;

        if (bestNoChanged >= 300) {
            drawLines(theBestIndivid.bypass, '#00BBF0', 7.0);

            console.log("Алгоритм завершен!");
            console.log(`Количество вершин: ${nodeList.length}`);
            console.log(mutationPercent);
            console.log(`Вес лучшего пути: ${theBestIndivid.weight}`);
            console.log(`${generationNumber} поколение`);

            startButton.disabled = false;
            clearButton.disabled = false;
            setDots.disabled = false;
            
            setDots.innerHTML = "Разместить города"
            setDots.className = "setDots";
            clearButton.className = "clearButton";
            startButton.className = "start";
        } else {
            setTimeout(runAlgorithm, 100 / 60);
        }
    }, 100 / 60);
}

//Старая версия алгоритма
function oldgeneticAlgorithm() {
    console.log("Начало алгоритма");
    let curGeneration = setInitialGeneration();
    curGeneration.sort(forSort);

    // let theBestIndivid = curGeneration[0];
    // showBestPath(theBestIndivid.bypass);

    console.log("Начало цикла");
    console.log("--------------------------------------------------------------");
    for (let generationNumber = 1, childrenCount = 0; generationNumber <= 3000; generationNumber++, childrenCount += populationCount * 9 / 10) {

        curGeneration = getNextGeneration(curGeneration);
        showBestPath(curGeneration[0].bypass);

        // if (curGeneration[0].weight < theBestIndivid.weight) {
        //     theBestIndivid = curGeneration[0];
        //     showBestPath(theBestIndivid.bypass);
        // }



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
//let fieldRect = field.getBoundingClientRect();

//Надпись про количество городов
let nodeCountLabel = document.getElementsByClassName('nodeCount')[0];

//Надпись про текущее поколение
let currentGeneration = document.getElementsByClassName('generation')[0];


//Надпись про самый выгодный обход
let mostCheapBypass = document.getElementsByClassName('bestBypass')[0];

//Надпись про количество детей
let children = document.getElementsByClassName('children')[0];

let allowSetDots = false;
let buttonPushed = false;

function forEvent(e, gap) {
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
        if (Math.abs(node.x - curNode.x) < radius * 2 * gap && Math.abs(node.y - curNode.y) < radius * 2 * gap) {

            noCross = false;
            break;
        }
    }

    let noBorder = true;
    if (curNode.x < 12 || curNode.y < 12 || curNode.x > 988 || curNode.y > 688) {
        noBorder = false;
    }

    // Проверка на то, чтобы визуализации вершин не пересекались
    if (noCross && noBorder) {

        ctx.fillStyle = '#EEEEEE';
        ctx.strokeStyle = '#393E46';

        ctx.beginPath();
        //ctx.arc(e.clientX - fieldRect.left, e.clientY - fieldRect.top, radius, 0, Math.PI * 2, false);
        ctx.arc(e.offsetX, e.offsetY, radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.stroke();

        nodeList.push(curNode);
        nodeCountLabel.innerHTML = `Количество городов: ${nodeList.length}`;
    }
}

// Клики и вождение мышкой
field.addEventListener('mousedown', function (e) {
    if (allowSetDots) {
        buttonPushed = true;
        forEvent(e, 1);
    }
});

field.addEventListener('mousemove', function (e) {
    if (buttonPushed) {
        forEvent(e, 2);
    }
});

document.body.addEventListener('mouseup', function (e) {
    buttonPushed = false;
})

//Идет поиск с точками
let searching = document.getElementsByClassName("search")[0];

let setDots = document.getElementsByClassName('setDots')[0];
setDots.onclick = () => {
    allowSetDots = !allowSetDots;
    if (allowSetDots) {
        setDots.innerHTML = "Размещение разрешено";
        setDots.className += " pushed";
        field.className += " cursor";
    } else {
        setDots.innerHTML = "Размеcтить города";
        setDots.className = "setDots";
        field.className = "canvas";
    }
};
console.log(setDots);

let clearButton = document.getElementsByClassName('clearButton')[0];
clearButton.onclick = () => {
    bestCtx.clearRect(0, 0, forLines.width, forLines.height);
    ctx.clearRect(0, 0, field.width, field.height);

    lastDrawedGreen = {
        x:-10,
        y:-10
    }
    lastDrawedRed = {
        x:-10,
        y:-10
    }

    nodeList = [];
    searching.innerHTML="Разместите города...";
    nodeCountLabel.innerHTML="Количество городов: 0";
    currentGeneration.innerHTML="Текущее поколение: №1";
    mostCheapBypass.innerHTML="Самый выгодный обход: ...$";
    children.innerHTML = "Было рождено: 0 потомков";
}

let startButton = document.getElementsByClassName('start')[0];
startButton.onclick = () => {
    if (nodeList.length > 1) {

        populationCount = nodeList.length;
        genomSize = nodeList.length;
        clearButton.disabled = true;
        startButton.disabled = true;
        setDots.disabled = true;
        allowSetDots = false;

        setDots.className = "setDots disabled";
        clearButton.className += " disabled";
        startButton.className += " disabled";
        field.className = "canvas";
        
        searching.innerHTML = "Идёт поиск";
        setTimeout(function search() {

            if (searching.textContent.length < 13) {
                searching.innerHTML+=".";
            } else {
                searching.innerHTML = "Идёт поиск";
            }
            
            if (startButton.disabled) {
                setTimeout(search, 500);
            } else {
                searching.innerHTML = "Маршрут построен!";
            }
        }, 500);

        geneticAlgorithm();
    } else {
        alert('Укажите больше 1 вершины!');
    }
};
console.log(startButton);

// При каждом изменении размера окна, делаем корректным видимость курсора внутри окна
// window.addEventListener('resize', function () {
//     fieldRect.getBoundingClientRect();
// })