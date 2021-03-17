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


form_button.onclick=()=>{
    console.log(`Size changed to ${form_rows.value}x${form_cols.value}`);

    //check values
    currBoard= new Board(form_rows.value,form_cols.value);
    //Draw_new_board();
}




const algButton = document.getElementById("alg");

algButton.onclick=function(){
    console.log("Before for");
    for(let i=0;i<currBoard.m;i++)
    {
        for(let j=0;j<currBoard.n;j++)
        {
            console.log(currBoard.board_matrix[i][j]);
        }
        console.log("|");
    }
}
