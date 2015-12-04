var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var turns, moves = [], moveNum = 0;

//board[0][0] = a8 (topright)
//board[1][2] = b6 ([file][rank])
var file = "abcdefgh";
var cols = "ABCDEFGH";
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

function drawPieces() {
    var img;
    for(var r=0; r<piecePos.length; r++){
        if(piecePos[r][0] < 0 && piecePos[r][1] < 0){ //eaten
            continue;
        }
        if(r < 16){ //piecePos
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
            ctx.drawImage(img, piecePos[r][0]*80 + 10, piecePos[r][1]*80 + 10);
        } else { //pawns
            img = document.getElementById(r < 24 ? "pawnwhite" : "pawnblack");
            ctx.drawImage(img, piecePos[r][0]*80 + 10, piecePos[r][1]*80 + 10);
        }
    }
}
/*f4 e5
fxe5 d6
exd6 Bxd6
g3 Qg5
Nf3 Qxg3+
hxg3 Bxg3#*/
function resetBoard() {
    for(var x=0; x<piecePos.length; x++){
        piecePos[x][0] = piecePosOrig[x][0];
        piecePos[x][1] = piecePosOrig[x][1];
    }
    makeBoard();
    drawPieces();
    moveNum = 0;
}

resetBoard();
window.onload = resetBoard();

function clearSquare(c, r){
    if(r%2 ? !(c%2) : c%2){ //brown
        ctx.fillStyle = "#DBBB84";
    } else { //grey
        ctx.fillStyle = "#DBDBDB";
    }
    console.log("Clearing ("+(c*80)+", "+(r*80)+")");
    ctx.clearRect(c*80, r*80, 80, 80);
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

function getPiece(piece, src, destFile, destRank, isEaten){ //returns index in piecePos
    var upper, lower, x;
    //get list of possible pieces to move [lower, upper)
    switch(piece){
        case 0: lower = 0; upper = 2; break; //king
        case 1: lower = 2; upper = 4; break; //queen
        case 2: lower = 4; upper = 8; break; //rook
        case 3: lower = 8; upper = 12; break; //bishop
        case 4: lower = 12; upper = 16; break; //knight
        case 5: lower = 16; upper = 32; break; //pawn
    }

    //filter out color
    if(moveNum % 2){ //black
        lower += (upper-lower)/2;
    } else {
        upper -= (upper-lower)/2;
    }

    console.log("lower:"+lower+" upper:"+upper+" piece:"+piece);
    console.log("dest:"+[destFile, destRank]+" lower:"+piecePos[lower]+" upper:"+piecePos[upper-1]);
    //if a src is given
    if(src[0] >= 0){ //file
        for(x=lower; x<upper; x++){
            if(piecePos[x][0] == src[0]) return x;
        }
    } else if(src[1] >= 0){ //rank
        for(x=lower; x<upper; x++){
            if(piecePos[x][1] == src[1]) return x;
        }
    }

    switch(piece){
        case 0: //king
        case 1: return lower; //queen
        case 2: //rook
            for(x=lower; x<upper; x++){
                if(piecePos[x][0] == destFile ? piecePos[x][1] != destRank : piecePos[x][1] != destRank){
                    return x;
                }
            }
            break;
        case 3: //bishop
            for(x=lower; x<upper; x++){
                if(Math.abs(piecePos[x][0] - destFile) == Math.abs(piecePos[x][1] - destRank)){
                    return x;
                }
            }
            break;
        case 4: //knight
            for(x=lower; x<upper; x++){
                if((Math.abs(piecePos[x][0] - destFile) == 2 && Math.abs(piecePos[x][1] - destRank) == 1)
                    || (Math.abs(piecePos[x][0] - destFile) == 1 && Math.abs(piecePos[x][1] - destRank) == 2)){
                    return x;
                }
            }
            break;
        case 5: //pawn
            for(var x=lower; x<upper; x++){
                if(isEaten){ //diagonal
                    if(Math.abs(piecePos[x][1] - destRank) == 1 && Math.abs(piecePos[x][0] - destFile) == 1){
                        return x;
                    }
                } else {
                    if(piecePos[x][1] == moveNum%2 ? 1 : 6){
                        //first move
                        if((destRank - piecePos[x][1] < moveNum%2 ? 3 : -3) && (piecePos[x][0] == destFile)){
                            return x;
                        }
                    } else {
                        if((destRank - piecePos[x][1] == moveNum%2 ? 1 : -1) && (piecePos[x][0] == destFile)){
                            return x;
                        }
                    }
                }
            }
    }

    return -1;
}

function getNotation(){
    resetBoard();
    moves.splice(0,moves.length); //reset
    var notation = document.getElementById("notation-id").value;
    turns = notation.split("\n");
    console.log(turns);
    var tmp;
    for(var i=0; i<turns.length; i++){
        tmp = turns[i].split(" ");
        if(tmp.length == 3) tmp.shift();
        moves = moves.concat(tmp);
    }
    console.log(moves);
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
                if(x < piecePos.length){
                    piecePos[x][0] = -1;
                    piecePos[x][1] = -1;

                    console.log(piecePos[x]);
                    //clear the box
                    clearSquare(destFile, 7-destRank);
                } else {
                    console.log('No piece');
                }
            }

            //get the exact piece to move (-1 if invalid move)
            var piecetomove = getPiece(piece, [srcFile, srcRank], destFile, 7-destRank, isEaten);
            console.log(piecetomove);
            console.log(piecePos[piecetomove]);
            if(piecetomove < 0){
                console.log("Invalid move");
            } else {
                piecePos[piecetomove][0] = destFile;
                piecePos[piecetomove][1] = 7-destRank;
            }
        } else { //castle
            console.log("castle");
            if((moves[moveNum].split("-")).length == 2){ //kingside
                piecePos[moveNum%2][0] += 2;
                piecePos[5 + (moveNum%2)*2][0] -= 2;
            } else { //queenside
                piecePos[moveNum%2][0] -= 2;
                piecePos[4 + (moveNum%2)*2][0] += 3;
            }
        }
    }
    moveNum++;
    ctx.clearRect(0,0,640,640);
    makeBoard();
    drawPieces();
}

console.clear();
