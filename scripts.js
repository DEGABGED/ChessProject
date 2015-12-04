var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var turns, moves = [], moveNum = 0;

//board[0][0] = a8 (topright)
//board[1][2] = b6 ([file][rank])
var file = "abcdefgh";
var rank = "12345678";

//white then black
var pieceOrder = "KQRBNp";
var castle = "0Oo";

//[file][rank] or [col][row]
//[0, 0] = Ra8
var piecePos = [[4,7], [4,0], [3,7], [3,0],
                [0,7], [7,7], [0,0], [7,0],
                [2,7], [5,7], [2,0], [5,0],
                [1,7], [6,7], [1,0], [6,0],
                [0,6], [1,6], [2,6], [3,6],
                [4,6], [5,6], [6,6], [7,6],
                [0,1], [1,1], [2,1], [3,1],
                [4,1], [5,1], [6,1], [7,1]];

var piecePosOrig = [[4,7], [4,0], [3,7], [3,0],
                [0,7], [7,7], [0,0], [7,0],
                [2,7], [5,7], [2,0], [5,0],
                [1,7], [6,7], [1,0], [6,0],
                [0,6], [1,6], [2,6], [3,6],
                [4,6], [5,6], [6,6], [7,6],
                [0,1], [1,1], [2,1], [3,1],
                [4,1], [5,1], [6,1], [7,1]];

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

function drawPieces(pieces) {
    var img;
    for(var r=0; r<pieces.length; r++){
        if(pieces[r].length > 2){ //eaten
            continue;
        }
        if(r < 16){ //pieces
            switch(Math.floor(r/4)){
                case 0: //queen / king
                    if(r < 2){ //king
                        img = document.getElementById(r ? "kingblack" : "kingwhite");
                    } else { //queen
                        img = document.getElementById((r-2) ? "queenblack" : "queenwhite");
                    }
                    break;
                case 1: //rook
                    img = document.getElementById(r < 6 ? "rookwhite" : "rookblack");
                    break;
                case 2: //bishop
                    img = document.getElementById(r < 10 ? "bishopwhite" : "bishopblack");
                    break;
                case 3: //knight
                    img = document.getElementById(r < 14 ? "knightwhite" : "knightblack");
                    break;
            }
            ctx.drawImage(img, pieces[r][0]*80 + 10, pieces[r][1]*80 + 10);
        } else { //pawns
            img = document.getElementById(r < 24 ? "pawnwhite" : "pawnblack");
            ctx.drawImage(img, pieces[r][0]*80 + 10, pieces[r][1]*80 + 10);
        }
    }
}

function resetBoard() {
    makeBoard();
    drawPieces(piecePosOrig);
    moveNum = 0;
}

function clearSquare(c, r){
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

fuction getPiece(piece, src, dest){ //returns index in piecePos

}

function getNotation(){
    moves.splice(0,moves.length);
    var notation = document.getElementById("notation-id").value;
    turns = notation.split("\n");
    console.log(turns);
    for(var i=0; i<turns.length; i++){
        moves = moves.concat(turns[i].split(" "));
    }
    console.log(moves);
    resetBoard();
}

function previousMove(){
    //var notation = document.getElementById("notation-id").value;
    console.log("Previous");
}

function nextMove(){
    //var notation = document.getElementById("notation-id").value;
    if(moveNum >= moves.length){
        //stop
        return;
    } else {
        if(castle.indexOf(moves[moveNum][0]) < 0){
            //get the piece moved and if a piece was eaten
            var ndx = 0
            var isEaten = 0;
            var piece = pieceOrder.indexOf(moves[moveNum][ndx]);
            if(piece < 0){ //pawn move
                piece = 5;
                if(moves[moveNum][ndx] == 'x'){
                    isEaten = 1;
                    ndx++;
                }
            } else { //piece move
                ndx++;
                if(moves[moveNum][ndx] == 'x'){
                    isEaten = 1;
                    ndx++;
                }
            }

            //get the file to move to (and the file of the piece to move if indicated)
            var srcFile = -1, destFile = -1, srcRank = -1, destRank = -1;
            destFile = file.indexOf(moves[moveNum][ndx]);
            if(rank.indexOf(moves[moveNum][ndx+1]) < 0){ //src file or rank indicated
                if(destFile < 0){ //srcrank
                    srcRank = rank.indexOf(moves[moveNum][ndx]);
                } else { //srcfile
                    srcFile = destFile;
                }
                ndx++;
            }
            destFile = file.indexOf(moves[moveNum][ndx]);
            ndx++;
            destRank = rank.indexOf(moves[moveNum][ndx]);
            ndx++;
            console.log("ndx:"+ndx+" isEaten:"+isEaten+" piece:"+piece+" dest:"+file[destFile]+rank[destRank]);

            //clear the dest. square if piece was eaten
            if(isEaten){
                console.log([destFile, 7-destRank])
                for(var x=0; x<piecePos.length; x++){
                    if(piecePos[x][0] == destFile && piecePos[x][1] == 7-destRank) break;
                }
                piecePos[x].push(1);
                console.log(piecePos[x]);
                //clear the box
                clearSquare(piecePos[x][0], piecePos[x][1]);
            }

            //get the exact piece to move (-1 if invalid move)
            var piecetomove = getPiece(piece, [srcFile, srcRank], [destFile, destRank]);
        } else { //castle
            console.log("castle");
        }
    }
    moveNum++;
    drawPieces(piecePos);
}

window.onload = resetBoard();

console.clear();
