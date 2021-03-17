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

let size = document.getElementById("size")

function checkSizeValue(size_value){
    if(size_value<=0){

        console.log(`Invalid size value ${size_value}`);

        size.value="";
        size.placeholder="Invalid size";

        return false;
    }
    return true;
}



let states=["empty","start","finish","wall"];

let stateColors = new Map();
stateColors.set("empty","#009091");
stateColors.set("start","#75FF33");
stateColors.set("finish","#FF5733");
stateColors.set("wall","#AE33FF");

let currentState=states[0];


let uniqueStates=new Map();
uniqueStates.set(
    "start",{
        isDefined: false,
        element: false,
    }
);
uniqueStates.set(
    "finish",{
        isDefined: false,
        element: false,
    }
);



function handleUniqueStates(element)
{
    console.log(element.name);
    console.log( uniqueStates.get(currentState));

    switch(currentState){
        case "start":
        case "finish":{
            if(uniqueStates.get(currentState).isDefined){
                if(uniqueStates.get(currentState).element==element){
                    uniqueStates.get(currentState).isDefined=false;
                    uniqueStates.get(currentState).element=false;
                }
                else{
                    uniqueStates.get(currentState).element.style.backgroundColor=stateColors.get("empty");
                    uniqueStates.get(currentState).element.name="empty";
                    uniqueStates.get(currentState).element=element;
                    
                }
            }
            else{
                uniqueStates.get(currentState).isDefined=true;
                uniqueStates.get(currentState).element=element;
            }
            break;
        }
    }

    console.log(uniqueStates.get(currentState));
    console.log(`HandleUniqueStates processed`);
}




function boardElementClickHandler(){

    console.log(`BoardElementClickHandler. Processing element ${this.id}`);

    handleUniqueStates(this);

    if(this.name==currentState){
        this.name="empty";
        this.style.backgroundColor=stateColors.get("empty");
    }
    else{
        this.name=currentState;
        this.style.backgroundColor=stateColors.get(currentState);
    }

    console.log(this.name);
    console.log(`BoardElementClickHandler processed`);
}



const board_block= document.getElementById("board_block")

function generateField(n){
    board_block.innerHTML="";
    board_block.width="100%";

    n = n%100;

    for (let i = 0; i < n; i++){
        let board_row= document.createElement("tr");

        for (let j = 0; j < n; j++){
            let board_elem= document.createElement('td');

            board_elem.class="board_elem";
            board_elem.name="empty";
            board_elem.id = i*n + j;
            board_elem.onclick=boardElementClickHandler;
            
            board_elem.textContent="0";
            board_elem.style.backgroundColor="#009091";
            board_elem.style.border="3px solid black";

            board_row.append(board_elem);
        }
        board_block.append(board_row);
    }
}



let button = document.getElementById("size_button")

button.onclick = () => {
    if(checkSizeValue(size.value)){

        console.log(`Size value is: ${size.value}`);
        
        generateField(size.value);
    }
    
}



function changeState(){
    currentState= this.name;

    console.log(`Current state: ${currentState}`);
}

let state1=document.getElementById("state1");
let state2=document.getElementById("state2");
let state3=document.getElementById("state3");
let state4 = document.getElementById("state4");

state1.onclick =changeState;
state2.onclick =changeState;
state3.onclick =changeState;
state4.onclick =changeState;
