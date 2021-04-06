//------------------Ожидание---------------------------------------
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//------------------Функции и константы для алгоритма--------------
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function sigmoidDerivative(sigmoidX) { //производная берётся не по x, а по y = sigmoid(x)
    return sigmoidX * (1 - sigmoidX);
}

function calculateError(voided, really) {
    let error = 0;
    for (let i = 0; i < 10; i++) {
        let difference = voided[i] - really[i];
        error += difference * difference;
    }
    console.log(`Ашипка равна ${error}`);
    return error;
}

function getNumberOfMax(arr) {
    let max = arr[0];
    let maxNum = 0;
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
            maxNum = i;
        }
    }
    return maxNum;
}

const learnFactor = 0.15;

//----------------Веса нейронной сети-------------------
function beginWeight() {
    return Math.random()/5;
}

function NeuralParameters(quantityOfLayers, quantityInLayer) {
    this.testsQuantity = 0;
    this.layersQuantity = quantityOfLayers;
    this.neuronsInLayers = quantityInLayer;
    this.layerWeights = [];
    this.layerBias = [];

    for (let layerNumber = 1; layerNumber < quantityOfLayers; layerNumber++) {
        this.layerBias[layerNumber] = [];
        this.layerWeights[layerNumber] = [];
        for (let i = 0; i < quantityInLayer[layerNumber]; i++) {
            this.layerBias[layerNumber][i] = beginWeight();
            this.layerWeights[layerNumber][i] = [];
            for (let j = 0; j < quantityInLayer[layerNumber - 1]; j++) {
                this.layerWeights[layerNumber][i][j] = beginWeight();
            }
        }
    }
}

//--------------Конструктор нейронной сети-----------
function NeuralNetwork(NNpar, beginLayer) {
    this.layer = [];
    this.voided = [];
    this.end = NNpar.layersQuantity - 1;

    this.layer[0] = beginLayer;

    for (let layerNumber = 1; layerNumber < NNpar.layersQuantity; layerNumber++) {
        this.layer[layerNumber] = [];
        for (let i = 0; i < NNpar.neuronsInLayers[layerNumber]; i++) {
            this.layer[layerNumber][i] = NNpar.layerBias[layerNumber][i];
            for (let j = 0; j < NNpar.neuronsInLayers[layerNumber - 1]; j++) {
                this.layer[layerNumber][i] += NNpar.layerWeights[layerNumber][i][j] * this.layer[layerNumber - 1][j];
            }
            this.layer[layerNumber][i] = sigmoid(this.layer[layerNumber][i])
        }
    }

    this.setVoided = function (voidedFigure) {
        this.voided = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.voided[voidedFigure] = 1;
    }

    this.getBest = function () {
        return (getNumberOfMax(this.layer[this.end]));
    }
}

//--------------------Обучение----------------------
function NeuralDerivs(NN, NNpar) { //частные производные по значениям нейронов
    this.layerDerivate = [];

    this.layerDerivate[NN.end] = [];
    for (let i = 0; i < NNpar.neuronsInLayers[NN.end]; i++) {
        this.layerDerivate[NN.end][i] = 2 * (NN.layer[NN.end][i] - NN.voided[i]);
    }

    for (let layerNumber = NN.end - 1; layerNumber >= 0; layerNumber--) {
        this.layerDerivate[layerNumber] = [];
        for (let i = 0; i < NNpar.neuronsInLayers[layerNumber]; i++) {
            this.layerDerivate[layerNumber][i] = 0;
            for (let j = 0; j < NNpar.neuronsInLayers[layerNumber + 1]; j++) {
                this.layerDerivate[layerNumber][i] += NNpar.layerWeights[layerNumber + 1][j][i] * sigmoidDerivative(NN.layer[layerNumber + 1][j]) * this.layerDerivate[layerNumber + 1][j];
            }
        }
    }
}



function learnNeuralNetwork(NN, NNpar, NNder) {
    for (let layerNumber = 1; layerNumber < NNpar.layersQuantity; layerNumber++) {
        for (let i = 0; i < NNpar.neuronsInLayers[layerNumber]; i++) {
            let commonFactor = learnFactor * sigmoidDerivative(NN.layer[layerNumber][i]) * NNder.layerDerivate[layerNumber][i];
            NNpar.layerBias[layerNumber][i] -= commonFactor;
            for (let j = 0; j < NNpar.neuronsInLayers[layerNumber - 1]; j++) {
                NNpar.layerWeights[layerNumber][i][j] -= NN.layer[layerNumber - 1][j] * commonFactor;
            }
        }
    }
    NNpar.testsQuantity++;
    return NNpar;
}




//-----------Нейросеть на текущей странице--------------
let pxQuan = 5;
let quantityOfLayers = 3;
let neuronsInLayers = [pxQuan ** 2, 17, 10];
let networkParameters = new NeuralParameters(quantityOfLayers, neuronsInLayers);
let currentNetwork;



//----------------Все элементы левого меню------------------------
let whiteButton = document.getElementById("whiteButton");
let blackButton = document.getElementById("blackButton");
let currentColorShow = document.getElementById('currentColorShow');
let allPaintButton = document.getElementById("allPaintButton");

let askBlock = document.getElementById('askBlock');
let output = document.getElementById('output');
let yesButton = document.getElementById("yesButton");
let noButton = document.getElementById("noButton");
let newDataBlock = document.getElementById("newDataBlock");
let newDataInput = document.getElementById('newDataInput');
let sendButton = document.getElementById("sendButton");
let sanksText = document.getElementById("sanksText");

let uploadButton = document.getElementById('uploadButton');
let textUploaded = document.getElementById('textUploaded');
let weightsFileName = document.getElementById('weightsFileName');
let downloadButton = document.getElementById('downloadButton');

let uploadTestsButton = document.getElementById('uploadTestsButton');
let megaLearnInput = document.getElementById('megaLearnInput');
let textUploadedTests = document.getElementById('textUploadedTests');
let testsFileName = document.getElementById('testsFileName');
let megaLearnStartButton = document.getElementById('megaLearnStartButton');
let learningStateText = document.getElementById('learningStateText');

let addTestButton = document.getElementById('addTestButton');
let testsInput = document.getElementById('testsInput');
let downloadTestsButton = document.getElementById('downloadTestsButton');

//------------------Кнопки управления цветом------------
let currentColor = "black";
let currentValue = 1;

whiteButton.onclick = function () {
    currentColor = "white";
    currentValue = 0;
    currentColorShow.innerText = "белый";
    currentColorShow.className = "currentColorShow twhite";
}

blackButton.onclick = function () {
    currentColor = "black";
    currentValue = 1;
    currentColorShow.innerText = "чёрный";
    currentColorShow.className = "currentColorShow tblack";
}

//------------------Константы поля----------------------
const size = 600;

let pixelsValues = [];

for (let i = 0; i < pxQuan; i++) {
    for (let j = 0; j < pxQuan; j++) {
        pixelsValues[i * pxQuan + j] = 0;
    }
}
currentNetwork = new NeuralNetwork(networkParameters, pixelsValues);


let drawingArea = document.getElementById("drawingArea");
drawingArea.style.height = size + "px";
drawingArea.style.width = size + "px";
drawingArea.style.minWidth = size + "px";
drawingArea.style.minHeight = size + "px";

//----------изменение состояния пикселей-------------
let isMousedown = false; //проверяет, было ли нажатие кнопки мыши на холсте

function doisMousedownTrue() {
    isMousedown = true;
}

function doisMousedownFalse() {
    isMousedown = false;
}

document.body.onmouseup = doisMousedownFalse; //если мышку отпустили в любом месте body, отменить нажатие

function changePixelState(pixel) {
    if (!isMousedown) return;
    pixel.className = "pixel " + currentColor;
    pixelsValues[pixel.id] = currentValue;
    sanksText.hidden = true;
    currentNetwork = new NeuralNetwork(networkParameters, pixelsValues);
    output.innerHTML = currentNetwork.getBest();
}

//-------Генерация пискельного холста---------------------
for (let i = 0; i < pxQuan; i++) {
    for (let j = 0; j < pxQuan; j++) {
        let pixel = document.createElement('div');
        pixel.className = "pixel white";
        pixel.id = pxQuan * i + j;
        pixel.style.width = size / pxQuan + "px";
        pixel.style.height = size / pxQuan + "px";
        pixel.onmousedown = function () {
            doisMousedownTrue();
            changePixelState(pixel);
        }
        pixel.onmouseover = function () {
            changePixelState(pixel);
        }
        pixel.ondragstart = function () {
            return false;
        }
        drawingArea.append(pixel);
    }
}

//------------------Кнопки полной закраски---------------
function paintAll() {
    doisMousedownTrue();
    for (let i = 0; i < pxQuan; i++) {
        for (let j = 0; j < pxQuan; j++) {
            let pixel = document.getElementById(i * pxQuan + j);
            changePixelState(pixel);
        }
    }
    doisMousedownFalse();
}
allPaintButton.onclick = paintAll;


//--------------Кнопки управления----------------
yesButton.onclick = function () {
    sanksText.hidden = false;
    currentNetwork.setVoided(currentNetwork.getBest());
    let derivates = new NeuralDerivs(currentNetwork, networkParameters);
    networkParameters = learnNeuralNetwork(currentNetwork, networkParameters, derivates);
    calculateError(currentNetwork.voided, currentNetwork.layer[currentNetwork.end]);
}

noButton.onclick = function () {
    newDataBlock.hidden = false;
    sanksText.hidden = true;
}

sendButton.onclick = function () {
    //askBlock.hidden = true;
    newDataBlock.hidden = true;
    sanksText.hidden = false;
    currentNetwork.setVoided(newDataInput.value);
    let derivates = new NeuralDerivs(currentNetwork, networkParameters);
    networkParameters = learnNeuralNetwork(currentNetwork, networkParameters, derivates);
    calculateError(currentNetwork.voided, currentNetwork.layer[currentNetwork.end]);
}

//------------------upload/download weights--------------
uploadButton.onchange = function () {
    let file = uploadButton.files[0];
    let reader = new FileReader;
    reader.readAsText(file);
    reader.onload = function () {
        networkParameters = JSON.parse(reader.result);
    }
    weightsFileName.innerText = file.name;
    textUploaded.hidden = false;
}

downloadButton.onclick = function () {
    let newjson = JSON.stringify(networkParameters, null, 4);
    let file = new Blob([newjson], { type: 'application/json' });
    downloadButton.href = URL.createObjectURL(file);
    downloadButton.download = "weights.json";
}

//----------------Скачивание тестов-----------------------
let testsArray = [];

function createTestsArrayElement(pixels, figure) {
    let arrElem = pixels.concat();
    arrElem[pxQuan ** 2] = +figure;
    return arrElem;
}

function megaLearning(arrayTests) {
    for (let i = 0; i < 15; i++) {
        for (let j = i; j < arrayTests.length; j += 15) {
            let figure = testsArray[j][pxQuan ** 2];
            let pixels = arrayTests[j].concat();
            pixels.pop();
            currentNetwork = new NeuralNetwork(networkParameters, pixels);
            currentNetwork.setVoided(figure);
            let derivates = new NeuralDerivs(currentNetwork, networkParameters);
            networkParameters = learnNeuralNetwork(currentNetwork, networkParameters, derivates);
        }
    }
}

addTestButton.onclick = function () {
    let newElem = createTestsArrayElement(pixelsValues, testsInput.value);
    testsArray.push(newElem);
    console.log("add:");
    console.log(newElem);
}

downloadTestsButton.onclick = function () {
    let newtxt = JSON.stringify(testsArray, null, 4);
    let file = new Blob([newtxt], { type: 'application/json' });
    downloadTestsButton.href = URL.createObjectURL(file);
    downloadTestsButton.download = "tests.json";
}

uploadTestsButton.onchange = function () {
    let file = uploadTestsButton.files[0];
    let reader = new FileReader;
    reader.readAsText(file);
    reader.onload = function () {
        testsArray = JSON.parse(reader.result);
    }
    testsFileName.innerText = file.name;
    textUploadedTests.hidden = false;
}

megaLearnStartButton.onclick = async function () {
    learningStateText.innerText = "Обрабатывается...";
    learningStateText.hidden = false;
    for (let i = 0; i < megaLearnInput.value; i++) {
        megaLearning(testsArray);
    }
    await sleep(1500);
    learningStateText.innerText = "Готово!"
}

//---------------Таинственные исчезновения-----------
let weightsBlockButton = document.getElementById('weightsBlockButton');
let weightsBlock = document.getElementById('weightsBlock');
let testsBlockButton = document.getElementById('testsBlockButton');
let testsBlock = document.getElementById('testsBlock');

weightsBlockButton.onclick = function () {
    if (weightsBlock.style.display == "none") {
        weightsBlock.style.display = "flex";
    }
    else {
        weightsBlock.style.display = "none";
    }
    testsBlock.style.display = "none";
}

testsBlockButton.onclick = function () {
    if (testsBlock.style.display == "none") {
        testsBlock.style.display = "flex";
    }
    else {
        testsBlock.style.display = "none";
    }
    weightsBlock.style.display = "none";
}

let whatAreTheWeightsButton = document.getElementById('whatAreTheWeightsButton');
let whatAreTheWeightsBlock = document.getElementById('whatAreTheWeightsBlock');
let whatAreTheTestsButton = document.getElementById('whatAreTheTestsButton');
let whatAreTheTestsBlock = document.getElementById('whatAreTheTestsBlock');

whatAreTheWeightsButton.onclick = function () {
    if (whatAreTheWeightsBlock.style.display == "none") {
        whatAreTheWeightsBlock.style.display = "block";
    }
    else {
        whatAreTheWeightsBlock.style.display = "none";
    }
    whatAreTheTestsBlock.style.display = "none";
}

whatAreTheTestsButton.onclick = function () {
    if (whatAreTheTestsBlock.style.display == "none") {
        whatAreTheTestsBlock.style.display = "block";
    }
    else {
        whatAreTheTestsBlock.style.display = "none";
    }
    whatAreTheWeightsBlock.style.display = "none";
}