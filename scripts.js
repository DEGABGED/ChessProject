var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

function makeBoard() {
    var cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    for(var r=0; r<8; r++){
        for(var c=0; c<8; c++){
            if(r%2 ? !(c%2) : c%2){ //brown
                ctx.fillStyle = "#DBBB84";
            } else { //grey
                ctx.fillStyle = "#DBDBDB";
            }
            ctx.fillRect(c*80, r*80, 80, 80);
            ctx.font = "15px Droid Sans";
            ctx.fillStyle =  "#000000";
            if(r==7){
                ctx.fillText(cols[c],c*80 + 35,7*80 + 75);
            }
            if(!c){
                ctx.fillText(8-r,5,r*80 + 40);
            }
        }
    }
}

function setPieces() {
    var img;
    for(var r=0; r<8; r++){
        for(var c=0; c<8; c++){
            if(r==0 || r==7){ //pieces
                switch(c){
                    case 0: //rook
                    case 7: img = document.getElementById(!r ? "rookblack" : "rookwhite"); break;
                    case 1: //knight
                    case 6: img = document.getElementById(!r ? "knightblack" : "knightwhite"); break;
                    case 2: //bishop
                    case 5: img = document.getElementById(!r ? "bishopblack" : "bishopwhite"); break;
                    case 3: img = document.getElementById(!r ? "queenblack" : "queenwhite"); break; //queen
                    case 4: img = document.getElementById(!r ? "kingblack" : "kingwhite"); break; //king
                }
                ctx.drawImage(img, c*80 + 10, r*80 + 10);
            } else if(r==1 || r==6){ //pawns
                img = document.getElementById(r-1 ? "pawnwhite" : "pawnblack");
                ctx.drawImage(img, c*80 + 10, r*80 + 10);
            }
        }
    }
}

function getNotation(){
    var notation = document.getElementById("notation-id").value;
    console.log(notation);
}

function previousMove(){
    //var notation = document.getElementById("notation-id").value;
    console.log("Previous");
}

function nextMove(){
    //var notation = document.getElementById("notation-id").value;
    console.log("Next");
}

window.onload = function() {
    makeBoard();
    setPieces();
}

console.clear();
