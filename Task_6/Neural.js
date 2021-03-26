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
    currentColorShow.innerText = currentColor;

}
let blackButton = document.getElementById("blackButton")
blackButton.onclick = function(){
    currentColor = "black";
    currentValue = 1;
    currentColorShow.innerText = currentColor;
}


//----------изменение состояния пикселей-------------
let wereMousedown = false; //проверяет, было ли нажатие кнопки мыши на холсте

function doWereMousedownTrue(){
    wereMousedown = true;
}

function doWereMousedownFalse(){
    wereMousedown = false;
}

document.body.onmouseup = doWereMousedownFalse; //если мышку отпустили в любом месте body, отменить нажатие

function changePixelState(pixel){
    if (!wereMousedown) return;
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
            doWereMousedownTrue();
            changePixelState(pixel);
        }
        pixel.onmouseover = function(){
            changePixelState(pixel);
        }
        drawingArea.append(pixel);
    }
}

//------------------Кнопки полной закраски---------------
function paintAll(){
    doWereMousedownTrue();
    for (let i = 0; i < quantity; i++){
        for (let j = 0; j < quantity; j++){
            let pixel = document.getElementById(i*quantity+j);
            changePixelState(pixel);
        }
    }
    doWereMousedownFalse();
}
let allPaintButton = document.getElementById("allPaintButton")
allPaintButton.onclick = paintAll;

//------------------Собственно алгоритм--------------
function sigmoid(x){
    return 1/(1 + Math.exp(-x));
}

const layer1quantity = 19;
const layer2quantity = 14;

let layerWeights0 = []; //веса слоя пикселей
for(let i = 0; i < layer1quantity; i++){
    layerWeights0[i] = [];
    for (let j = 0; j < quantity*quantity+1; j++){
        layerWeights0[i][j] = 0;
    }
}

let layerWeights1 = []; //веса первого скрытого слоя
for(let i = 0; i < layer2quantity; i++){
    layerWeights1[i] = [];
    for (let j = 0; j < layer1quantity+1; j++){
        layerWeights1[i][j] = 0;
    }
}

let layerWeights2 = []; //веса второго скрытого слоя
for(let i = 0; i < 10; i++){
    layerWeights2[i] = [];
    for (let j = 0; j < layer2quantity+1; j++){
        layerWeights2[i][j] = 0;
    }
}

function neuralNetwork(){
    console.log(pixelsValues);

    let layer1 = [];
    for(let i = 0; i < layer1quantity; i++){
        layer1[i] = layerWeights0[i][quantity*quantity]; //данный вес на самом деле bias
        for(let j = 0; j < quantity*quantity; j++){
            layer1[i] += pixelsValues[j]*layerWeights0[i][j];
        }
        layer1[i] = sigmoid(layer1[i]);
    }
    console.log(layer1);
    
    let layer2 = [];
    for(let i = 0; i < layer2quantity; i++){
        layer2[i] = layerWeights1[i][layer1quantity]; //аналогично
        for(let j = 0; j < layer1quantity; j++){
            layer2[i] += layer1[j]*layerWeights1[i][j];
        }
        layer2[i] = sigmoid(layer2[i]);
    }
    console.log(layer2);

    let layer3 = [];
    for(let i = 0; i < 10; i++){
        layer3[i] = layerWeights2[i][layer2quantity]; //то же самое
        for(let j = 0; j < layer2quantity; j++){
            layer3[i] += layer2[j]*layerWeights2[i][j];
        }
        layer3[i] = sigmoid(layer3[i]);
    }
    console.log(layer3);

    return layer3;
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

//----------Output и обучение------------------------
let noButton = document.getElementById("noButton");
let yesButton = document.getElementById("yesButton");
let readPictureButton = document.getElementById("readPictureButton");
let newDataBlock = document.getElementById("newDataBlock");
let sendButton = document.getElementById("sendButton");
let sanks = document.getElementById("sanks");
let ask = document.getElementById('ask');
let output = document.getElementById('output');
let newData = document.getElementById('newData');

let result;
let voided = [];
let best;

readPictureButton.onclick = function(){
    ask.hidden = false;
    sanks.hidden = true;
    results = neuralNetwork();
    best = getNumber_max(results);
    output.innerText = best;
}

yesButton.onclick = function(){
    ask.hidden = true;
    sanks.hidden = false;
    for(let i = 0; i < 10; i++){
        voided[i] = 0;
    }
    voided[best] = 1;
}

noButton.onclick = function(){
    newDataBlock.hidden = false;
    sanks.hidden = true;
}

function errorRate(voidedd){
    let error = 0;
    for (let i = 0; i < 10; i++){
        let difference = voidedd[i] - results[i];
        error += difference*difference;
    }
    console.log(error);
    return error;
}

sendButton.onclick = function(){
    ask.hidden = true;
    newDataBlock.hidden = true;
    sanks.hidden = false;
    for(let i = 0; i < 10; i++){
        voided[i] = 0;
    }
    voided[newData.value] = 1;
    errorRate(voided)
}

let gradient = [];