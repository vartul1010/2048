const boardSize = 4

const numberBlock = {
	2: '<span class="two">2</span>',
	4: '<span class="four">4</span>',
	8: '<span class="eight">8</span>',
	16: '<span class="sixteen">16</span>',
	32: '<span class="thirty-two">32</span>',
	64: '<span class="sixty-four">64</span>',
	128: '<span class="one-twenty-eight">128</span>',
	256: '<span class="two-fifty-six">256</span>',
	512: '<span class="five-hundred-twelve">512</span>',
	1024: '<span class="thousand-twenty-four">1024</span>',
	2048: '<span class="two-thousand-forty-eight">2048</span>',
	4096: '<span class="four-thousand-ninety-six">4096</span>',
};

var createBoard = function(){
	var board = new Array(boardSize);
	for(var i=0; i<boardSize; i++) {
		var cols = new Array(boardSize);
		cols.fill(0);
		board[i] = cols;
	}
	return board;
}

var initVacantPositions = function(){
	var arr = [];
	for (var i = 0; i < boardSize*boardSize; i++) {
		arr.push(i);
	}
	return arr;
}

var randomGenerator = function(num){
	return Math.floor(Math.random()*num);
}

var vacantFillerItem = function(){
	var arr = [2,4];
	var num = randomGenerator(arr.length);
	return arr[num];
}

var fillItems = function(){

	var val = positions[randomGenerator(positions.length)];
	var index = positions.indexOf(val);
	positions.splice(index,1);

	board[Math.floor(val/4)][val%4] = vacantFillerItem();
}

var initGame = function(){
	fillItems();
	fillItems();

	draw();
}

var draw = function(){
	var cells = document.querySelectorAll("td");
	for(var i=0; i<cells.length; i++){
		var number = board[Math.floor(i/4)][i%4];
		if(number !== 0){
			cells[i].innerHTML = numberBlock[number];

		} else {
			cells[i].textContent = "";
		}
	}
}

var firstValidPosition = function(num, isRow){
	var rv = {
		row: -1,
		col: -1
	};

	if(isRow){
		for(var col=0; col<boardSize; col++){
			if(board[num][col] !== 0){
				rv.row = num;
				rv.col = col;
				break;
			}
		}
	} else {
		for(var row=0; row<boardSize; row++){
			if(board[row][num] !== 0){
				rv.row = row;
				rv.col = num;
				break;
			}
		}
	}

	return rv;
}

var moveHorizontally = function(startingPosition, rowChange, colChange, isLeft){
	
	//logic for movement
	var isChanged = false;

	for(var row=0; row<boardSize; row++){
		var lastIndex = firstValidPosition(row, true);
		if(lastIndex.row !== -1){
			for(var col=lastIndex.col+colChange; col<boardSize; col++){
				if(board[row][col] !== 0){
					if(board[row][col] === board[lastIndex.row][lastIndex.col]){
						if(isLeft){
							board[row][col] = 0;
							board[lastIndex.row][lastIndex.col] = 2*board[lastIndex.row][lastIndex.col];
							if(board[lastIndex.row][lastIndex.col] === 2048){
								won = true;
							}
							positions.push(row*4 + col);
						} else {
							board[row][col] = 2*board[row][col];
							if(board[row][col] === 2048){
								won = true;
							}
							board[lastIndex.row][lastIndex.col] = 0;
							positions.push(lastIndex.row*4 + lastIndex.col);
						}
						isChanged = true;
					} else {
						lastIndex.row = row;
						lastIndex.col = col;
					}
				}
			}
		}
	}

	// move items to end
	if(isLeft){
		for(var row=boardSize-1; row>=0; row--){
			var index = {
				r: row,
				c: 0
			};
			while(index.c <= boardSize-1 && board[index.r][index.c] !== 0){
				index.c++;
			}
			for(var col=index.c; col<boardSize; col++){
				if(board[row][col] !== 0 && (row !== index.r || col !== index.c)){
					positions.push(4*row+col);
					var temp = {
						r: row,
						c: col
					};
					board[index.r][index.c] = board[row][col];
					positions.splice(positions.indexOf(4*index.r + index.c), 1);
					index.c++;
					board[temp.r][temp.c] = 0;
					isChanged = true;	
				}
			}
		}
	} else {
		for(var row=boardSize-1; row>=0; row--){
			var index = {
				r: row,
				c: boardSize-1
			};
			while(index.c >= 0 && board[index.r][index.c]){
				index.c--;
			}
			for(var col=index.c; col>=0; col--){
				if(board[row][col] !== 0 && (row !== index.r || col !== index.c)){
					positions.push(4*row+col);
					var temp = {
						r: row,
						c: col
					};
					board[index.r][index.c] = board[row][col];
					positions.splice(positions.indexOf(4*index.r + index.c), 1);
					index.c--;
					board[temp.r][temp.c] = 0;
					isChanged = true;	
				}
			}
		}
	}

	return isChanged;
}

var moveVertically = function(startingPosition, rowChange, colChange, isUp){
	
	//logic for movement
	var isChanged = false;

	for(var col=0; col<boardSize; col++){
		var lastIndex = firstValidPosition(col, false);
		if(lastIndex.row !== -1){
			for(var row=lastIndex.row+rowChange; row<boardSize; row++){
				if(board[row][col] !== 0){
					if(board[row][col] === board[lastIndex.row][lastIndex.col]){
						if(isUp){
							board[row][col] = 0;
							board[lastIndex.row][lastIndex.col] = 2*board[lastIndex.row][lastIndex.col];
							if(board[lastIndex.row][lastIndex.col] === 2048){
								won = true;
							}
							positions.push(row*4 + col);
						} else {
							board[row][col] = 2*board[row][col];
							if(board[row][col] === 2048){
								won = true;
							}
							board[lastIndex.row][lastIndex.col] = 0;
							positions.push(lastIndex.row*4 + lastIndex.col);
						}
						isChanged = true;
					} else {
						lastIndex.row = row;
						lastIndex.col = col;
					}
				}
			}
		}
	}

	// move items to end
	if(isUp){
		for(var col=boardSize-1; col>=0; col--){
			var index = {
				r: 0,
				c: col
			};
			while(index.r <= boardSize-1 && board[index.r][index.c]){
				index.r++;
			}
			for(var row=index.r; row<boardSize; row++){
				if(board[row][col] !== 0 && (row !== index.r || col !== index.c)){
					positions.push(4*row+col);
					var temp = {
						r: row,
						c: col
					};
					board[index.r][index.c] = board[row][col];
					positions.splice(positions.indexOf(4*index.r + index.c), 1);
					index.r++;
					board[temp.r][temp.c] = 0;
					isChanged = true;	
				}
			}
		}
	} else {
		for(var col=boardSize-1; col>=0; col--){
			var index = {
				r: boardSize-1,
				c: col
			};
			while(index.r >= 0 && board[index.r][index.c] !== 0){
				index.r--;
			}
			for(var row=index.r; row>=0; row--){
				if(board[row][col] !== 0 && (row !== index.r || col !== index.c)){
					positions.push(4*row+col);
					var temp = {
						r: row,
						c: col
					};
					board[index.r][index.c] = board[row][col];
					positions.splice(positions.indexOf(4*index.r + index.c), 1);
					index.r--;
					board[temp.r][temp.c] = 0;
					isChanged = true;	
				}
			}
		}
	}

	return isChanged;
}



var moveHelper = function(baseRow, baseCol, currRow, currCol){
	if(currRow < 0 || currRow >= boardSize || currCol < 0 || currCol >= boardSize){
		return false;
	}

	if(board[baseRow][baseCol] === board[currRow][currCol]){
		return true;
	} 

	return false;

}

var isMovePossible = function(){
	// return true if move is possible
	for(var row=0; row<boardSize; row++){
		for(var col=0; col<boardSize; col++){
			if(moveHelper(row, col, row-1, col) || moveHelper(row, col, row+1, col) || 
				moveHelper(row, col, row, col-1) || moveHelper(row, col, row, col+1)) {
				return true;
			}
		}
	}

	return false;
}

var checkKey = function(e){
	e = e || window.event;

	if(e.keyCode == '37'){
        // left arrow
        if(moveHorizontally(0, 0, 1, true)){
        	fillItems();
        	draw();
        }
    } else if(e.keyCode == '38'){
        // up arrow
        if(moveVertically(0, 1, 0, true)){
        	fillItems();
        	draw();
        }
    } else if(e.keyCode == '39'){
       	// right arrow
       	if(moveHorizontally(0, 0, 1, false)){
       		fillItems();
       		draw();
       	}
    } else if(e.keyCode == '40'){
       	// down arrow
       	if(moveVertically(0, 1, 0, false)){
       		fillItems();
       		draw();
       	}
    }

    if(!decWon && won){
		setTimeout(function() {
			alert("Yayyy!! You did it.");
		}, 2);
		decWon = true;
	}

	if(positions.length === 0 && !isMovePossible()){
    	setTimeout(function() {
			alert("Game Over. Please refresh the web page to try again.");
		}, 2);
    }
}

var board = createBoard();
var positions = initVacantPositions();

initGame();

var won = false;
var decWon = false;

document.onkeydown = checkKey;

