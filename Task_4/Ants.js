//--------------------------------------------------------------------------------------------------------------------------------------------------

class ant {

    // Генератор рандомных целых чисел на [min;max]
    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    buildRoute(pheromonesMatrix, weightsMatrix) {
        // Инициализируем маршрут муравья
        let nodeCount = weightsMatrix.length;
        this.routeLength = 0;
        this.route = [];

        // Инициализируем массив посещенных вершин
        let visited = new Array(nodeCount);
        for (let i = 0; i < nodeCount; i++) {
            visited[i] = false;
        }

        // Делаем стартовую вершину посещенной
        let current = this.getRandomIntInclusive(0, nodeCount-1);
        visited[current] = true;
        let visitedCount = 1;
        this.route.push(current);

        // Инициализируем коэффициенты
        let soloMid = 4, teamPlayer = 1;

        // Начало построения маршрута
        while (visitedCount < visited.length) {

            // Инициализируем сумму желаний
            let sumOfWills = 0;
            
            // Считаем сумму желаний
            for (let i = 0; i < nodeCount; i++) {
                if (!visited[i]) {
                    sumOfWills += Math.pow(pheromonesMatrix[current][i], teamPlayer) * Math.pow(1/weightsMatrix[current][i], soloMid);
                }
            }

            // Инициализируем массив желаний попасть в вершину
            let willtoNodes = [];

            // Записываем в массив вершины и желания попасть в них
            for (let i = 0; i < nodeCount; i++) {
                if (!visited[i]) {
                    let willToI = Math.pow(1/weightsMatrix[current][i], soloMid)*Math.pow(pheromonesMatrix[current][i], teamPlayer)/sumOfWills;

                    let consideredNode = {
                        node:i,
                        will:willToI
                    };

                    for (let j = 0; j < willtoNodes.length; j++) {
                        consideredNode.will += willtoNodes[j].will;
                    }
                    willtoNodes.push(consideredNode);
                }
            }

            // Выбираем рандомное число от 0 до 1
            let choice = Math.random();

            // Добавляем в маршрут вершину, на которую указал выбор
            for (let i = 0; i < willtoNodes.length; i++) {
                if (willtoNodes[i].will >= choice) {

                    this.routeLength += weightsMatrix[current][willtoNodes[i].node];
                    this.route.push(willtoNodes[i].node);

                    visited[willtoNodes[i].node] = true;
                    visitedCount++;

                    current = willtoNodes[i].node;
                    break;
                }
            }
        }

        this.routeLength += weightsMatrix[this.route[nodeCount-1]][this.route[0]];
    }
};

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

function drawLines(bestRoute, strokeStyle, lineWidth) {
    // Генерация новых линий
    bestCtx.strokeStyle = strokeStyle;
    bestCtx.lineWidth = lineWidth;
    bestCtx.beginPath();

    bestCtx.moveTo(bestRoute[0].x, bestRoute[0].y);

    for (let i = 1; i < nodeCount; i++) {
        bestCtx.lineTo(bestRoute[i].x, bestRoute[i].y);
    }

    bestCtx.lineTo(bestRoute[0].x, bestRoute[0].y);
    bestCtx.closePath();
    bestCtx.stroke();
    //-------------------------------------------------------

    //Отмечаем стартовую вершину
    lastDrawedGreen = bestRoute[0];
    ctx.fillStyle = '#4ECCA3';

    ctx.beginPath();
    ctx.arc(lastDrawedGreen.x, lastDrawedGreen.y, 11, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.stroke();

    //Отмечаем новую последнюю вершину
    lastDrawedRed = bestRoute[nodeCount - 1];
    ctx.fillStyle = '#FF2E63';

    ctx.beginPath();
    ctx.arc(lastDrawedRed.x, lastDrawedRed.y, 11, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.stroke();
    //-------------------------------------------------------

    // console.log("Лучший путь");
    // console.log(`${nodeList[0].x} | ${nodeList[0].y}`);
    // for (let i = 0; i < bestRoute.length; i++) {
    //     console.log(`${bestRoute[i].x} | ${bestRoute[i].y}`);
    // }
    // console.log(`${nodeList[0].x} | ${nodeList[0].y}`);
}
//---------------------------------------------------------------------------------------------------------------------------------------------


// Инициализируем Список вершин графа
let nodeList = [];

// Количество вершин в геноме каждой особи
let nodeCount;

// Задаем количество особей
let iterationSize;

// initialize matrixOfAdjacency
let weightsMatrix;

let pheromonesMatrix;

let reduceQuotient = 0.7;
let addPheromones = 240;
function updatePheromones(ants) {

    // Испарение феромон
    for (let i = 0; i < nodeCount; i++) {
        for (let j = i; j < nodeCount; j++) {
            pheromonesMatrix[i][j] *= reduceQuotient;
            pheromonesMatrix[j][i] *= reduceQuotient;
        }
    }

    // Добавление феромон
    for (let i = 0; i < ants.length; i++) {
        let toAdd = addPheromones / ants[i].routeLength;

        pheromonesMatrix[ants[i].route[0]][ants[i].route[nodeCount - 1]] += toAdd;
        pheromonesMatrix[ants[i].route[nodeCount - 1]][ants[i].route[0]] += toAdd;

        for (let j = 0; j < nodeCount - 1; j++) {
            pheromonesMatrix[ants[i].route[j]][ants[i].route[j + 1]] += toAdd;
            pheromonesMatrix[ants[i].route[j + 1]][ants[i].route[j]] += toAdd;
        }
    }
}

function drawBestRoute(bestRoute, strokeStyle, lineWidth) {
    resetLines();
    let route = [];
    for (let i = 0; i < nodeCount; i++) {
        route[i]=nodeList[bestRoute[i]];
    }
    drawLines(route, strokeStyle, lineWidth);
}

// Сам алгоритм
function antAlgorithm() {

    let bestAnt = new ant();
    bestAnt.buildRoute(pheromonesMatrix, weightsMatrix);
    drawBestRoute(bestAnt.route, '#D3D4D8', 4.8);

    let noChanged = 0;
    setTimeout(function runAlg() {
    
        let ants = new Array(iterationSize);
        let changed = false;
        for (let j = 0; j < iterationSize; j++) {
            ants[j] = new ant();
            ants[j].buildRoute(pheromonesMatrix, weightsMatrix);

            if (ants[j].routeLength < bestAnt.routeLength) {
                bestAnt = ants[j];
                drawBestRoute(bestAnt.route, '#D3D4D8', 4.8);
                changed = true;
            }
        }

        if (!changed) {
            noChanged++;
        } else {
            noChanged = 0;
        }

        updatePheromones(ants);

        if (noChanged >= 50) {
            drawBestRoute(bestAnt.route, '#00BBF0', 7.0);

            startButton.disabled = false;
            clearButton.disabled = false;
            setDots.disabled = false;

            setDots.innerHTML = "Разместить города"
            setDots.className = "setDots";
            clearButton.className = "clearButton";
            startButton.className = "start";
        } else {
            setTimeout(runAlg, 100/60);
        }
    }, 100/60);
}

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

        if (searching.innerHTML = "Маршрут построен!") {

            currentGeneration.innerHTML = "Текущее поколение: №1";
            mostCheapBypass.innerHTML = "Самый выгодный обход: ...$";
            children.innerHTML = "Было рождено: 0 потомков";
            searching.innerHTML = "Разместите города...";
            resetLines();
        }

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
        x: -10,
        y: -10
    }
    lastDrawedRed = {
        x: -10,
        y: -10
    }

    nodeList = [];
    searching.innerHTML = "Разместите города...";
    nodeCountLabel.innerHTML = "Количество городов: 0";
    currentGeneration.innerHTML = "Текущее поколение: №1";
    mostCheapBypass.innerHTML = "Самый выгодный обход: ...$";
    children.innerHTML = "Было рождено: 0 потомков";
}

function getLength(dot1, dot2) {
    return Math.sqrt(Math.pow(dot1.x - dot2.x, 2) + Math.pow(dot1.y - dot2.y, 2));
}

let startButton = document.getElementsByClassName('start')[0];
startButton.onclick = () => {
    if (nodeList.length > 1) {

        nodeCount = nodeList.length;
        iterationSize = 80;

        pheromonesMatrix = new Array(nodeCount);
        weightsMatrix = new Array(nodeCount);

        for(let i = 0; i < nodeCount; i++) {
            pheromonesMatrix[i] = new Array(nodeCount);
            weightsMatrix[i] = new Array(nodeCount);
        }

        for (let i = 0; i < nodeCount; i++) {
            for (let j = i; j < nodeCount; j++) {

                weightsMatrix[i][j] = getLength(nodeList[i], nodeList[j]);
                weightsMatrix[j][i] = weightsMatrix[i][j];

                pheromonesMatrix[i][j] = 0.1;
                pheromonesMatrix[j][i] = 0.1;
            }
        }

        clearButton.disabled = true;
        startButton.disabled = true;
        setDots.disabled = true;
        allowSetDots = false;

        currentGeneration.innerHTML = "Текущее поколение: №1";
        mostCheapBypass.innerHTML = "Самый выгодный обход: ...$";
        children.innerHTML = "Было рождено: 0 потомков";

        setDots.className = "setDots disabled";
        clearButton.className += " disabled";
        startButton.className += " disabled";
        field.className = "canvas";

        searching.innerHTML = "Идёт поиск";
        setTimeout(function search() {

            if (searching.textContent.length < 13) {
                searching.innerHTML += ".";
            } else {
                searching.innerHTML = "Идёт поиск";
            }

            if (startButton.disabled) {
                setTimeout(search, 500);
            } else {
                searching.innerHTML = "Маршрут построен!";
            }
        }, 500);

        antAlgorithm();
    } else {
        alert('Укажите больше 1 вершины!');
    }
};
console.log(startButton);