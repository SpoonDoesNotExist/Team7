/*
let backButton = document.getElementById("back");

backButton.onclick = function () {
    window.location.href="../index.html";
}



class Point
{
    constructor(i,j){
        this.i=i;
        this.j=j;
    }
}

class Cell{
    constructor(){
        this.F=null;
        this.G=null;
        this.H=null;
        this.parent=null;
    }
}

class Board
{
    constructor(m,n){
        this.m=m;
        this.n=n;

        this.board_matrix=new Array(m);  
        for(let i=0;i<m;i++){
            this.board_matrix[i]=new Array(n);
            for(let j=0;j<n;j++){
                this.board_matrix[i][j]=new Cell();
            }
        }
    }
}





let currBoard=new Board(5,5);

const form_rows=document.getElementById("form_rows");
const form_cols=document.getElementById("form_cols");
const form_button=document.getElementById("form_button");

function checkSizeValues(rows,cols){
    if(rows<=0||cols<=0){

        console.log(`Invalid size values ${rows} ${cols}`);

        form_rows.value="";
        form_cols.value="";

        form_rows.placeholder="Invalid size";
        form_cols.placeholder="Invalid size";

        return false;
    }
    return true;
}

form_button.onclick=()=>{
    if(checkSizeValues(form_rows.value,form_cols.value)){

        console.log(`Size changed to ${form_rows.value}x${form_cols.value}`);

        currBoard= new Board(form_rows.value,form_cols.value);
        //Draw_new_board();
    }
}




const algButton = document.getElementById("alg");

algButton.onclick=function(){
    //console.log("Before for");
    for(let i=0;i<currBoard.m;i++)
    {
        for(let j=0;j<currBoard.n;j++)
        {
            console.log(currBoard.board_matrix[i][j]);
        }
        console.log("|");
    }

    
}
*/

"use strict"

class Point
{
    constructor(i,j){
        this.i=i;
        this.j=j;
    }
}

class Cell{
    constructor(){
        this.F=5;
        this.G=0;
        this.H=0;
        this.parent=new Point(0,0);
    }
}

class Board
{
    constructor(m,n){
        this.m=m;
        this.n=n;

        this.board_matrix=new Array(m);  
        for(let i=0;i<m;i++){
            this.board_matrix[i]=new Array(n);
            for(let j=0;j<n;j++){
                this.board_matrix[i][j]=new Cell();
            }
        }
    }
}




//Выбор размера доски.
let size = document.getElementById("size")

//Валидация введенного размера.
function checkSizeValue(size_value){
    if(size_value<=0){                                      

        console.log(`Invalid size value ${size_value}`);

        size.value="";
        size.placeholder="Invalid size";

        return false;
    }
    return true;
}



//Состояния для элементов доски.
let states=["empty","start","finish","wall"];

//Цвета для состояний.
let stateColors = new Map();
stateColors.set("empty","#a49582");
stateColors.set("start","#bc7837");
stateColors.set("finish","#3f0d16");
stateColors.set("wall","#2d2f28");

//Начальное состояние доски - empty.
let currentState=states[0];


//Уникальные состояния - start и finish.
let uniqueStates=new Map();
uniqueStates.set(
    "start",{
        isDefined: false,   //Есть ли на доске start.
        element: false,     //Если есть, то храним этот элемент.
    }
);
uniqueStates.set(
    "finish",{
        isDefined: false,   //Есть ли на доске finish.
        element: false,     //Если есть, то храним этот элемент.
    }
);



/*Обработчик для уникальных состояний.
    Если на доске уже есть start(finish), то сначала делаем старый empty, 
    потом создаем новый start(finish). 
*/
function handleUniqueStates(element)
{
    console.log(element.name);
    console.log( uniqueStates.get(currentState));

    //Если находимся в состоянии start(finish)
    switch(currentState){
        case "start":
        case "finish":{
            if(uniqueStates.get(currentState).isDefined){               //Если на доске уже есть start(finish).
                if(uniqueStates.get(currentState).element==element){    //Если мы нажимаем на этот самый start(finish).
                    uniqueStates.get(currentState).isDefined=false;     //Тогда больше на доске нет start(finish). (т.к. повторное нажатие делает клетку empty) 
                    uniqueStates.get(currentState).element=false;       
                }
                else{                                                                                       //Если это другая клетка.
                    uniqueStates.get(currentState).element.style.backgroundColor=stateColors.get("empty");  //Делаем старую empty.
                    uniqueStates.get(currentState).element.name="empty";                                    
                    uniqueStates.get(currentState).element=element;                                         //Записываем текущую клетку в качестве start(finish).
                    
                }
            }
            else{                                                       //Если еще нет start(finish).
                uniqueStates.get(currentState).isDefined=true;          //Записываем текущую клетку в качестве start(finish).
                uniqueStates.get(currentState).element=element;
            }
            break;
        }
    }

    /*
    
        СДЕЛАТЬ НОРМАЛЬНУЮ ОБРАБОТКУ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
    */
    if(currentState!="start" &&uniqueStates.get("start").element==element){
        uniqueStates.get("start").isDefined=false;
        uniqueStates.get("start").element=false;
    }
    if(currentState!="finish" &&uniqueStates.get("finish").element==element){
        uniqueStates.get("finish").isDefined=false;
        uniqueStates.get("finish").element=false;
    }

    console.log(uniqueStates.get(currentState));
    console.log(`HandleUniqueStates processed`);
}



//Обработчик нажатий на элементы доски.
function boardElementClickHandler(){

    console.log(`BoardElementClickHandler. Processing element ${this.id}`);

    //Проверяем уникальность start(finish).
    handleUniqueStates(this);

    if(this.name==currentState){                                //Если текщее состояние совпадает с состоянием клетки.
        this.name="empty";                                      //Делаем ее empty. (своего рода отмена).
        this.style.backgroundColor=stateColors.get("empty");
    }
    else{                                                       //Иначе изменим состояние текущей клетки.
        this.name=currentState;                                 
        this.style.backgroundColor=stateColors.get(currentState);
    }

    console.log(this.name);
    console.log(`BoardElementClickHandler processed`);
}



//Доска, на которой находятся элементы. (является table).
const board_block= document.getElementById("board_block")

//Создает доску нужного размера.
function generateField(n){
    board_block.innerHTML="";
    board_block.width="100%";

    n = n%100;

    for (let i = 0; i < n; i++){
        let board_row= document.createElement("tr");            //Создаем строку.

        for (let j = 0; j < n; j++){
            let board_elem= document.createElement('td');       //Создаем элемент стороки.

            board_elem.class="board_elem";
            board_elem.name="empty";
            board_elem.id = i*n + j;
            board_elem.onclick=boardElementClickHandler;        //Обработчик нажатия на элемент.
            
            board_elem.textContent="0";
            board_elem.style.backgroundColor=stateColors.get("empty");
            board_elem.style.border="3px solid black";

            board_row.append(board_elem);                       //Добавляем элемент в строку.
        }
        board_block.append(board_row);                          //Добавляем всю строку в таблицу.
    }
}


//Задержка.
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


//Матрица для текущей доски.
let currBoard=null;


function boardIsCreated(){
    if(currBoard==null){
        alert("Please create the board");
        return false;
    }
    return true;
}


//Кнопка для запуска алгоритма.
let startAlgorithmButton=document.getElementById("start_alg");


startAlgorithmButton.onclick=async function(){
    if(boardIsCreated())
    {
        if(true){///Если на доске есть начало и конец/

            for(let i=0;i<currBoard.m;i++)
            {
                for(let j=0;j<currBoard.n;j++)
                {
                    //console.log(currBoard.board_matrix[i][j]);

                    await sleep(500);
                    board_block.rows[i].cells[j].style.backgroundColor=stateColors.get("start");
                }
            console.log("|");
            }        
        }
    }
}




//Кнопка ввода размера доски.
let button = document.getElementById("size_button")

button.onclick = () => {
    if(checkSizeValue(size.value)){

        console.log(`Size value is: ${size.value}`);
        
        currBoard=new Board(size.value,size.value);
        generateField(size.value);          
    }
}



//Изменяет текущее состояние.
function changeState(){
    currentState= this.name;

    console.log(`Current state: ${currentState}`);
}

//Кнопки выбора состояния.
let state1=document.getElementById("state1");
let state2=document.getElementById("state2");
let state3=document.getElementById("state3");
let state4 = document.getElementById("state4");

state1.onclick =changeState;
state2.onclick =changeState;
state3.onclick =changeState;
state4.onclick =changeState;
