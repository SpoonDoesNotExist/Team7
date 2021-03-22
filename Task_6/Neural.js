//------------------Константы поля----------------------
const quantity = 5;
const size = 500;

let drawingArea = document.getElementById("drawingArea")
drawingArea.style.height = size + "px";
drawingArea.style.width = size + "px";
drawingArea.style.minWidth = size + "px";
drawingArea.style.minHeight = size + "px";


//------------------Кнопки управления цветом------------
let currentColor = "black";
let whiteButton = document.getElementById("whiteButton")
whiteButton.onclick = function(){
    currentColor = "white";
}
let blackButton = document.getElementById("blackButton")
blackButton.onclick = function(){
    currentColor = "black";
}

//----------mousedown+mousemove для пикселей-------------
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
        pixel.onmousemove = function(){
            changePixelState(pixel);
        }
        drawingArea.append(pixel);
    }
}

//------------------Кнопки полной закраски---------------
let currentPaintAllColor = "white";
function paintAll(){
    for (let i = 0; i < quantity; i++){
        for (let j = 0; j < quantity; j++){
            let pixel = document.getElementById(i*quantity+j)
            pixel.className = "pixel "+currentPaintAllColor;
        }
    }
}
let allWhiteButton = document.getElementById("allWhiteButton")
allWhiteButton.onclick = function(){
    currentPaintAllColor = "white";
    paintAll();
}
let allBlackButton = document.getElementById("allBlackButton")
allBlackButton.onclick = function(){
    currentPaintAllColor = "black";
    paintAll();
}

//----------Output и обучение------------------------
let noButton = document.getElementById("noButton");
let yesButton = document.getElementById("yesButton");
let readPictureButton = document.getElementById("readPictureButton");
let newDataBlock = document.getElementById("newDataBlock");
let sendButton = document.getElementById("sendButton");
let sanks = document.getElementById("sanks");

readPictureButton.onclick = function(){
    sanks.hidden = true;
}

yesButton.onclick = function(){
    sanks.hidden = false;
}

noButton.onclick = function(){
    newDataBlock.hidden = false;
    sanks.hidden = true;
}

sendButton.onclick = function(){
    newDataBlock.hidden = true;
    sanks.hidden = false;
}
