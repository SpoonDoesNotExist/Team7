"use strict"

function generateField(n){
    //block2.remove()
    n = n%100;
    //let div = document.createElement('div')
    //block1.after(div)
    for (let i = 0; i < n; i++){
        for (let j = 0; j < n; j++){
            let pict = document.createElement('img')
            pict.src = "pictures/texture1.png"
            pict.id = i*n + j
            pict.height = 500/n
            pict.width = 500/n
            document.body.append(pict)
            document.body.append(' ')
        }
        let br = document.createElement('br')
        document.body.append(br)
    }
}


let button = document.getElementById("button")
let size = document.getElementById("size")
let div = document.
button.onclick = () => {
    generateField(size.value)
}