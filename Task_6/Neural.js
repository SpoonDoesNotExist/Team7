//------------------Константы поля----------------------
const quantity = 5;
const size = 500;

let pixelsValues = [];

for (let i = 0; i < quantity; i++){
    for (let j = 0; j < quantity; j++){
        pixelsValues[i*quantity+j] = 0;
    }
}

let drawingArea = document.getElementById("drawingArea")
drawingArea.style.height = size + "px";
drawingArea.style.width = size + "px";
drawingArea.style.minWidth = size + "px";
drawingArea.style.minHeight = size + "px";


//------------------Кнопки управления цветом------------
let currentColor = "black";
let currentValue = 1;
let currentColorShow = document.getElementById('currentColorShow');


let whiteButton = document.getElementById("whiteButton")
whiteButton.onclick = function(){
    currentColor = "white";
    currentValue = 0;
    currentColorShow.innerText = "белый";
    currentColorShow.className = "currentColorShow twhite";
}

let blackButton = document.getElementById("blackButton")
blackButton.onclick = function(){
    currentColor = "black";
    currentValue = 1;
    currentColorShow.innerText = "чёрный";
    currentColorShow.className = "currentColorShow tblack";
}

//----------изменение состояния пикселей-------------
let isMousedown = false; //проверяет, было ли нажатие кнопки мыши на холсте

function doisMousedownTrue(){
    isMousedown = true;
}

function doisMousedownFalse(){
    isMousedown = false;
}

document.body.onmouseup = doisMousedownFalse; //если мышку отпустили в любом месте body, отменить нажатие

function changePixelState(pixel){
    if (!isMousedown) return;
    pixel.className = "pixel "+currentColor;
    pixelsValues[pixel.id] = currentValue;
}

//-------Генерация пискельного холста---------------------

for (let i = 0; i < quantity; i++){
    for (let j = 0; j < quantity; j++){
        let pixel = document.createElement('div');
        pixel.className = "pixel white";
        pixel.id = quantity*i + j;
        pixel.style.width = size/quantity + "px";
        pixel.style.height = size/quantity + "px";
        pixel.onmousedown = function(){
            doisMousedownTrue();
            changePixelState(pixel);
        }
        pixel.onmouseover = function(){
            changePixelState(pixel);
        }
        pixel.ondragstart = function(){
            return false;
        }
        drawingArea.append(pixel);
    }
}

//------------------Кнопки полной закраски---------------
function paintAll(){
    doisMousedownTrue();
    for (let i = 0; i < quantity; i++){
        for (let j = 0; j < quantity; j++){
            let pixel = document.getElementById(i*quantity+j);
            changePixelState(pixel);
        }
    }
    doisMousedownFalse();
}
let allPaintButton = document.getElementById("allPaintButton")
allPaintButton.onclick = paintAll;

//------------------Функции и константы для алгоритма--------------
function sigmoid(x){
    return 1/(1 + Math.exp(-x));
}

function sigmoidDerivative(sigmoidX){ //внимание!! это не сама производная, а её выражение через сигмоиду
    return sigmoidX*(1-sigmoidX);
}

function calculateError(voided, really){
    let error = 0;
    for (let i = 0; i < 10; i++){
        let difference = voided[i] - really[i];
        error += difference*difference;
    }
    console.log(`Ашипка равна ${error}`);
    return error;
}

function getNumber_max(arr){
    let max = arr[0];
    let maxNum = 0;
    for (let i = 1; i < arr.length; i++){
        if (arr[i] > max){
            max = arr[i];
            maxNum = i;
        }
    } 
    return maxNum;
}

const layer1quantity = 16;
const layer2quantity = 13;
const learnFactor = 0.1;

//----------------Веса нейронной сети-------------------
let NeuralParameters = {
    testsQuantity: 0,
    layerWeightsPixels: [], //слой пикселей
    layerBias1: [],
    layerWeights1: [], //первый скрытый слой
    layerBias2: [],
    layerWeights2: [], //второй скрытый слой
    layerBiasEnd: [],

    printAll(){
        console.log("Веса входящего слоя:");
        console.log(this.layerWeightsPixels);
        console.log("Веса первого скрытого слоя:");
        console.log(this.layerWeights1);
        console.log("Сдвиги первого скрытого слоя:");
        console.log(this.layerBias1);
        console.log("Веса второго скрытого слоя:");
        console.log(this.layerWeights2);
        console.log("Сдвиги второго скрытого слоя:");
        console.log(this.layerBias2);
        console.log("Сдвиги выходящего слоя:");
        console.log(this.layerBiasEnd);
        console.log("--------------------------");
    }
}

function beginWeight(){
    return 0;
}

for(let i = 0; i < layer1quantity; i++){
    NeuralParameters.layerBias1[i] = beginWeight();
    NeuralParameters.layerWeightsPixels[i] = [];
    for (let j = 0; j < quantity*quantity; j++){
        NeuralParameters.layerWeightsPixels[i][j] = beginWeight();
    }
}

for(let i = 0; i < layer2quantity; i++){
    NeuralParameters.layerBias2[i] = beginWeight();
    NeuralParameters.layerWeights1[i] = [];
    for (let j = 0; j < layer1quantity; j++){
        NeuralParameters.layerWeights1[i][j] = beginWeight();
    }
}

for(let i = 0; i < 10; i++){
    NeuralParameters.layerBiasEnd[i] = beginWeight();
    NeuralParameters.layerWeights2[i] = [];
    for (let j = 0; j < layer2quantity; j++){
        NeuralParameters.layerWeights2[i][j] = beginWeight();
    }
}

//--------------Конструктор нейронной сети-----------
function NeuralNetwork(parameters, pixels){
    this.layerPixels = pixels,
    this.layer1 = [];
    this.layer2 = [];
    this.layerEnd = [];
    this.voided = [];

    for(let i = 0; i < layer1quantity; i++){
        this.layer1[i] = parameters.layerBias1[i];
        for(let j = 0; j < quantity*quantity; j++){
            this.layer1[i] += pixels[j]*parameters.layerWeightsPixels[i][j];
        }
        this.layer1[i] = sigmoid(this.layer1[i]);
    }

    for(let i = 0; i < layer2quantity; i++){
        this.layer2[i] = parameters.layerBias2[i];
        for(let j = 0; j < layer1quantity; j++){
            this.layer2[i] += this.layer1[j]*parameters.layerWeights1[i][j];
        }
        this.layer2[i] = sigmoid(this.layer2[i]);
    }

    for(let i = 0; i < 10; i++){
        this.layerEnd[i] = parameters.layerBiasEnd[i];
        for(let j = 0; j < layer2quantity; j++){
            this.layerEnd[i] += this.layer2[j]*parameters.layerWeights2[i][j];
        }
        this.layerEnd[i] = sigmoid(this.layerEnd[i]);
    }

    this.setVoided = function(voidedFigure){
        this.voided = [0,0,0,0,0,0,0,0,0,0];
        this.voided[voidedFigure] = 1;
    }

    this.getBest = function(){
        return (getNumber_max(this.layerEnd));
    }

    this.printAll = function(){
        console.log("Слой пикселей:");
        console.log(this.layerPixels);
        console.log("Первый скрытый слой:");
        console.log(this.layer1);
        console.log("Второй скрытый слой:");
        console.log(this.layer2);
        console.log("Конечный слой:");
        console.log(this.layerEnd);
        console.log("Ожидалось:");
        console.log(this.voided);
        console.log("--------------------------");
    }
}

let currentNetwork;

//----------------Обучение----------------------
function NeuralDerivs(NN, NNpar){ //частные производные от значений нейронов
    this.layerDerivateEnd = [];
    this.layerDerivate2 = [];
    this.layerDerivate1 = [];
    this.layerDerivatePixels = [];

    for(let i = 0; i < 10; i++){
        this.layerDerivateEnd[i] = 2*(NN.layerEnd[i]-NN.voided[i]);
    }

    for(let i = 0; i < layer2quantity; i++){
        this.layerDerivate2[i] = 0;
        for(let j = 0; j < 10; j++){
            this.layerDerivate2[i] += NNpar.layerWeights2[j][i]*sigmoidDerivative(NN.layerEnd[j])*this.layerDerivateEnd[j];
            //console.log(`${NNpar.layerWeights2[j][i]}, ${sigmoidDerivative(NN.layerEnd[j])}, ${this.layerDerivateEnd[j]}
            //${this.layerDerivate2[i]}`);
        }
        //console.log("------------------");
    }

    for(let i = 0; i < layer1quantity; i++){
        this.layerDerivate1[i] = 0;
        for(let j = 0; j < layer2quantity; j++){
            this.layerDerivate1[i] += NNpar.layerWeights1[j][i]*sigmoidDerivative(NN.layer2[j])*this.layerDerivate2[j];
        }
    }

    for(let i = 0; i < quantity*quantity; i++){
        this.layerDerivatePixels[i] = 0;
        for(let j = 0; j < layer1quantity; j++){
            this.layerDerivatePixels[i] += NNpar.layerWeightsPixels[j][i]*sigmoidDerivative(NN.layer1[j])*this.layerDerivate1[j];
        }
    }
}

function learnNeuralNetwork(NN, NNpar, NNder){
    for(let i = 0; i < 10; i++){
        let commonDeriv = learnFactor * sigmoidDerivative(NN.layerEnd[i]) * NNder.layerDerivateEnd[i];
        NNpar.layerBiasEnd[i] -= commonDeriv;
        for(let j = 0; j < layer2quantity; j++){
            NNpar.layerWeights2[i][j] -= NN.layer2[j] * commonDeriv;
        } 
    }

    for(let i = 0; i < layer2quantity; i++){
        let commonDeriv = learnFactor * sigmoidDerivative(NN.layer2[i]) * NNder.layerDerivate2[i];
        NNpar.layerBias2[i] -= commonDeriv;
        for(let j = 0; j < layer1quantity; j++){
            NNpar.layerWeights1[i][j] -= NN.layer1[j] * commonDeriv;
        } 
    }

    for(let i = 0; i < layer1quantity; i++){
        let commonDeriv = learnFactor * sigmoidDerivative(NN.layer1[i]) * NNder.layerDerivate1[i];
        NNpar.layerBias1[i] -= commonDeriv;
        for(let j = 0; j < quantity*quantity; j++){
            NNpar.layerWeightsPixels[i][j] -= NN.layerPixels[j] * commonDeriv;
        } 
    }

    NNpar.testsQuantity++;

    return NNpar;
}

//----------------Кнопки слева------------------------
let noButton = document.getElementById("noButton");
let yesButton = document.getElementById("yesButton");
let readPictureButton = document.getElementById("readPictureButton");
let newDataBlock = document.getElementById("newDataBlock");
let sendButton = document.getElementById("sendButton");
let sanksText = document.getElementById("sanksText");
let ask = document.getElementById('ask');
let output = document.getElementById('output');
let newData = document.getElementById('newData');

readPictureButton.onclick = function(){
    ask.hidden = false;
    sanksText.hidden = true;
    currentNetwork = new NeuralNetwork(NeuralParameters, pixelsValues);
    output.innerHTML = currentNetwork.getBest();
}

yesButton.onclick = function(){
    ask.hidden = true;
    sanksText.hidden = false;
    currentNetwork.setVoided(currentNetwork.getBest());
    let derivates = new NeuralDerivs(currentNetwork, NeuralParameters);
    NeuralParameters = learnNeuralNetwork(currentNetwork, NeuralParameters, derivates);
    calculateError(currentNetwork.voided, currentNetwork.layerEnd);
}

noButton.onclick = function(){
    newDataBlock.hidden = false;
    sanksText.hidden = true;
}

sendButton.onclick = function(){
    ask.hidden = true;
    newDataBlock.hidden = true;
    sanksText.hidden = false;
    currentNetwork.setVoided(newData.value);
    let derivates = new NeuralDerivs(currentNetwork, NeuralParameters);
    NeuralParameters = learnNeuralNetwork(currentNetwork, NeuralParameters, derivates); 
    calculateError(currentNetwork.voided, currentNetwork.layerEnd);
}

//------------------upload/download weights--------------
let uploadButton = document.getElementById('uploadButton');
let textUploaded = document.getElementById('textUploaded');
let weightsFileName = document.getElementById('weightsFileName');
let downloadButton = document.getElementById('downloadButton');

uploadButton.onchange = function(){
    let file = uploadButton.files[0];
    let reader = new FileReader;
    reader.readAsText(file);
    reader.onload = function(){
        NeuralParameters = JSON.parse(reader.result);
    }
    weightsFileName.innerText = file.name;
    textUploaded.hidden = false;
}

downloadButton.onclick = function(){
    let newjson = JSON.stringify(NeuralParameters, null, 4);
    let file = new Blob([newjson], {type: 'application/json'});
    downloadButton.href = URL.createObjectURL(file);
    downloadButton.download = "weights.json";
}

//----------------Скачивание тестов-----------------------
let testsArray = [];

function createTestsArrayElement(pixels, figure){
    let arrElem = pixels.concat();
    arrElem[quantity*quantity] = +figure;
    return arrElem;
}

function megaLearning(arrayTests){
    for (let i = 0; i < 15; i++){
        for (let j = i; j < arrayTests.length; j += 15){
            let figure = testsArray[j][quantity**2];
            let pixels = arrayTests[j].concat();
            pixels.pop();
            currentNetwork = new NeuralNetwork(NeuralParameters, pixels);
            currentNetwork.setVoided(figure);
            let derivates = new NeuralDerivs(currentNetwork, NeuralParameters);
            NeuralParameters = learnNeuralNetwork(currentNetwork, NeuralParameters, derivates); 
        }
    }
}

let addTestButton = document.getElementById('addTestButton');
let testsInput = document.getElementById('testsInput');
let downloadTestsButton = document.getElementById('downloadTestsButton');


addTestButton.onclick = function(){
    let newElem = createTestsArrayElement(pixelsValues, testsInput.value);
    testsArray.push(newElem);
    console.log("add:");
    console.log(newElem);
    doneText.hidden = false;    
}

addTestButton.onmouseout = function(){
    doneText.hidden = true;
}

downloadTestsButton.onclick = function(){
    let newtxt = JSON.stringify(testsArray, null, 4);
    let file = new Blob([newtxt], {type: 'application/json'});
    downloadTestsButton.href = URL.createObjectURL(file);
    downloadTestsButton.download = "tests.json";
}

let uploadTestsButton = document.getElementById('uploadTestsButton');
let megaLearnInput = document.getElementById('megaLearnInput');
let textUploadedTests = document.getElementById('textUploadedTests');
let testsFileName = document.getElementById('testsFileName');
let megaLearnStartButton = document.getElementById('megaLearnStartButton');
let learningState = document.getElementById('learningState');

uploadTestsButton.onchange = function(){
    let file = uploadTestsButton.files[0];
    let reader = new FileReader;
    reader.readAsText(file);
    reader.onload = function(){
        testsArray = JSON.parse(reader.result);
    }
    testsFileName.innerText = file.name;
    textUploadedTests.hidden = false;
}

megaLearnStartButton.onclick = function(){
    learningState.innerText = "Обрабатывается...";
    learningState.hidden = false;
    for (let i = 0; i < megaLearnInput.value; i++){
        megaLearning(testsArray);
    }
    learningState.innerText = "Готово!"
}

//---------------Таинственные исчезновения-----------
let weightsBlockButton = document.getElementById('weightsBlockButton');
let weightsBlock = document.getElementById('weightsBlock');
let testsBlockButton = document.getElementById('testsBlockButton');
let testsBlock = document.getElementById('testsBlock');

weightsBlockButton.onclick = function(){
    if(weightsBlock.style.display == "none"){
        weightsBlock.style.display = "flex";
    }
    else{
        weightsBlock.style.display = "none";
    }
    testsBlock.style.display = "none";
}

testsBlockButton.onclick = function(){
    if(testsBlock.style.display == "none"){
        testsBlock.style.display = "flex";
    }
    else{
        testsBlock.style.display = "none";
    }
    weightsBlock.style.display = "none";
}