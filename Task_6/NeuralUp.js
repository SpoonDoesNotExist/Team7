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

//----------------Веса нейронной сети-------------------
function beginWeight() {
    return Math.random()/50;
}

function NeuralParameters(quantityOfLayers, quantityInLayer, learnFactor) {
    this.testsQuantity = 0;
    this.learnFactor = learnFactor;
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
            let commonFactor = NNpar.learnFactor * sigmoidDerivative(NN.layer[layerNumber][i]) * NNder.layerDerivate[layerNumber][i];
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
const learnFactor = 0.05;
const pxQuan = 50;
const quantityOfLayers = 4;
const neuronsInLayers = [pxQuan ** 2, 100, 20, 10];

let networkParameters = new NeuralParameters(quantityOfLayers, neuronsInLayers, learnFactor);
let currentNetwork;



//----------------Все элементы левого меню------------------------
let whiteButton = document.getElementById("whiteButton");
let blackButton = document.getElementById("blackButton");
let currentColorShow = document.getElementById('currentColorShow');
let lineWidhtInput = document.getElementById('lineWidhtInput');
let allPaintButton = document.getElementById("allPaintButton");

let readPictureButton = document.getElementById("readPictureButton");
let ask = document.getElementById('ask');
let output = document.getElementById('output');
let yesButton = document.getElementById("yesButton");
let noButton = document.getElementById("noButton");
let newDataBlock = document.getElementById("newDataBlock");
let newData = document.getElementById('newData');
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
let learningState = document.getElementById('learningState');

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

//---------Константы поля, обновление слоёв нейросети-------
const size = 600;

let pixelsValues = [];

for (let i = 0; i < pxQuan; i++) {
    for (let j = 0; j < pxQuan; j++) {
        pixelsValues[i * pxQuan + j] = 0;
    }
}

currentNetwork = new NeuralNetwork(networkParameters, pixelsValues);

async function updateNetwork() {
    sanksText.hidden = true;
    currentNetwork = new NeuralNetwork(networkParameters, pixelsValues);
    output.innerHTML = currentNetwork.getBest();}

let regularChangeNetwork = setInterval(updateNetwork, 3000);


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
    pixel.className = "pixel " + currentColor;
    pixelsValues[pixel.id] = currentValue;
}

function changePixels(pixel){
    if (!isMousedown) return;  
    let thisPixel = pixel.id;
    let lineWidht = lineWidhtInput.value;
    for(let diffAbs = 0; diffAbs < lineWidht; diffAbs++){
        for(let diffLeft = 0; diffLeft <= diffAbs; diffLeft++){
            let diffUp = diffAbs - diffLeft;
            if(thisPixel % pxQuan - diffLeft >= 0){
                if(+thisPixel - diffUp*pxQuan >= 0){
                    let leftUpPixel = document.getElementById(+thisPixel - diffLeft - diffUp*pxQuan);
                    changePixelState(leftUpPixel);
                }
                if(+thisPixel + diffUp*pxQuan < pxQuan**2){
                    let leftDownPixel = document.getElementById(+thisPixel - diffLeft + diffUp*pxQuan);
                    changePixelState(leftDownPixel);
                }
            }
            if(thisPixel % pxQuan + diffLeft < pxQuan){
                if(+thisPixel - diffUp*pxQuan >= 0){
                    let rightUpPixel = document.getElementById(+thisPixel + diffLeft - diffUp*pxQuan);
                    changePixelState(rightUpPixel);
                }
                if(+thisPixel + diffUp*pxQuan < pxQuan**2){
                    let rightDownPixel = document.getElementById(+thisPixel + diffLeft + diffUp*pxQuan);
                    changePixelState(rightDownPixel);
                }
            }
        }
    } 
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
            changePixels(pixel);
        }
        pixel.onmouseover = function () {
            changePixels(pixel);
        }
        pixel.ondragstart = function () {
            return false;
        }
        drawingArea.append(pixel);
    }
}

//------------------Кнопки полной закраски---------------
function paintAll() {
    for (let i = 0; i < pxQuan; i++) {
        for (let j = 0; j < pxQuan; j++) {
            let pixel = document.getElementById(i * pxQuan + j);
            changePixelState(pixel);
        }
    }
    switch(currentColor){
        case "white": 
            blackButton.click();
            break;
        case "black": 
            whiteButton.click();
            break;
    }

}
allPaintButton.onclick = paintAll;


//--------------Кнопки управления----------------
/*readPictureButton.onclick = function(){
    ask.hidden = false;
    sanksText.hidden = true;
    currentNetwork = new NeuralNetwork(networkParameters, pixelsValues);
    output.innerHTML = currentNetwork.getBest();
}*/

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
    //ask.hidden = true;
    newDataBlock.hidden = true;
    sanksText.hidden = false;
    currentNetwork.setVoided(newData.value);
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
    downloadButton.download = "weightsUp.json";
}

//----------------Скачивание тестов-----------------------
let testsArray = [];

function createTestsArrayElement(pixels, figure) {
    let arrElem = pixels.concat();
    arrElem[pxQuan ** 2] = +figure;
    return arrElem;
}

function megaLearning(arrayTests, step) {
    for (let i = 0; i < step; i++) {
        for (let j = i; j < arrayTests.length; j += step) {
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
    downloadTestsButton.download = "testsUp.json";
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
    learningState.innerText = "Обрабатывается...";
    learningState.hidden = false;
    for (let i = 0; i < megaLearnInput.value; i++) {
        megaLearning(testsArray, 30);
        console.log(`Я сейчас на ${i+1} прогоне`);
    }
    await sleep(1500);
    learningState.innerText = "Готово!"
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