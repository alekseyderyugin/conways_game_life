let canvas = document.getElementById('game');

context = canvas.getContext('2d');

let startButton = document.getElementById('start');
let stopButton = document.getElementById('stop');
let resetButton = document.getElementById('next');
let clearButton = document.getElementById('clear');
let randomButton = document.getElementById('random');


let game = new Game();
let BODY_MARGIN = 8;

const grid = new Grid(1200, 600, 10, 0);

const gridCoords = grid.getGridCoords();
const generationInstance = new Generation(grid);
let generation = generationInstance.getGeneration();

startButton.addEventListener('click', function(event){
    game.start(startGeneration);
});

stopButton.addEventListener('click', function (event){
    game.stop();
});

resetButton.addEventListener('click', function (event){
    startGeneration();
});

clearButton.addEventListener('click', function (event){
    reduceGeneration(generation, function(rowI, colI){
        generation[rowI][colI] = 0;
    });

    grid.drawGrid(context, generation);
});

randomButton.addEventListener('click', function (event){
    reduceGeneration(generation, function(rowI, colI){
        generation[rowI][colI] = +(Math.random() < 0.5);
    });

    grid.drawGrid(context, generation);
});

(function(){
    let timeoutId;
    let lastHoveredCell;

    document.addEventListener('mousemove', function(event){
        timeoutId && clearTimeout(timeoutId);

        setTimeout(function(){

            let clientX = event.clientX - BODY_MARGIN;
            let clientY = event.clientY - BODY_MARGIN;
            let matchedCell = getGridCellCoordsByClientXY(clientX, clientY, gridCoords);

            if(matchedCell && !lastHoveredCell || lastHoveredCell && matchedCell && lastHoveredCell.id !== matchedCell.id){
                if(!generation[matchedCell.rowI][matchedCell.colI]){
                    grid.fillCellColored(context, matchedCell, '#EFD003FF');
                }

                if(lastHoveredCell && !generation[lastHoveredCell.rowI][lastHoveredCell.colI]){
                    grid.clearCell(context, lastHoveredCell.rowI, lastHoveredCell.colI);
                    lastHoveredCell = null;
                }

                lastHoveredCell = matchedCell;
            }

        }, 10);
    });
})();

canvas.addEventListener('click', function(event){
    let clientX = event.clientX - BODY_MARGIN;
    let clientY = event.clientY - BODY_MARGIN;

    let matchedCell = getGridCellCoordsByClientXY(clientX, clientY, gridCoords);

    if(matchedCell){
        let foundRow = matchedCell.rowI;
        let foundCol = matchedCell.colI;

        if(generation[foundRow][foundCol] == 1){
            generation[foundRow][foundCol] = 0;
            grid.clearCell(context, foundRow, foundCol);
        }else{
            generation[foundRow][foundCol] = 1;
            grid.fillCell(context, foundRow, foundCol);
        }
    }
});

grid.drawGrid(context, generation);

function startGeneration(){

    let nextGeneration = generationInstance.getGenerationCopy(generation);

    for(let rowI = 0; rowI < generation.length; rowI++){
        for(let colI = 0; colI < generation[rowI].length; colI++){
            let neighborsCount = 0;

            if(colI == (generation[rowI].length - 1)){
                neighborsCount += generation[rowI][0];
            }

            if(colI == 0){
                neighborsCount += generation[rowI][(generation[rowI].length - 1)];
            }

            if(rowI == 0){
                neighborsCount += generation[(generation.length - 1)][colI];
            }

            if(rowI == (generation.length - 1)){
                neighborsCount += generation[0][colI];
            }



            if(colI + 1 < generation[rowI].length){//colI не последний, право
                neighborsCount += generation[rowI][colI + 1];
            }

            if(colI - 1 >= 0){ // лево
                neighborsCount += generation[rowI][colI - 1];
            }

            if(rowI - 1 >= 0){//rowI не первый, верх
                neighborsCount += generation[rowI - 1][colI];

                if(colI + 1 < generation[rowI - 1].length){//colI не последний, верх право
                    neighborsCount += generation[rowI - 1][colI + 1];
                }

                if(colI - 1 >= 0){ //rowI и colI не первые, верх лево
                    neighborsCount += generation[rowI - 1][colI - 1];
                }
            }

            if(rowI + 1 < generation.length){
                neighborsCount += generation[rowI + 1][colI]; // низ

                if(colI - 1 >= 0){ // лево низ
                    neighborsCount += generation[rowI + 1][colI - 1];
                }

                if(colI + 1 < generation[rowI + 1].length){ // право низ
                    neighborsCount += generation[rowI + 1][colI + 1];
                }
            }

            if(generation[rowI][colI] == 1){
                if(neighborsCount < 2){
                    nextGeneration[rowI][colI] = 0;
                }else if(neighborsCount == 2 || neighborsCount == 3){
                    nextGeneration[rowI][colI] = 1;
                }else if(neighborsCount > 3) {
                    nextGeneration[rowI][colI] = 0;
                }
            }else if(neighborsCount == 3){
                nextGeneration[rowI][colI] = 1;
            }
        }
    }

    grid.drawGrid(context, nextGeneration);
    generation = nextGeneration;
}

/**
 *
 * @param clientX
 * @param clientY
 * @param gridCoords
 * @returns {null|CellCoords}
 */
function getGridCellCoordsByClientXY(clientX, clientY, gridCoords){
    let foundRow;
    let foundCol = foundRow = false;

    for(let lineIndex = 0; lineIndex < gridCoords.length; lineIndex++) {
        let colIndex = 0;
        let cell = gridCoords[lineIndex][colIndex];

        if (foundRow === false && clientY >= cell.y) {
            if (lineIndex + 1 < gridCoords.length) {
                foundRow = clientY < gridCoords[lineIndex + 1][colIndex].y ? lineIndex : false;
            } else {
                foundRow = lineIndex;
            }
        }

        for (; colIndex < gridCoords[lineIndex].length; colIndex++) {
            cell = gridCoords[lineIndex][colIndex];

            if (clientX >= cell.x) {
                if (colIndex + 1 < gridCoords[lineIndex].length) {
                    if(clientX < gridCoords[lineIndex][colIndex + 1].x){
                        foundCol = colIndex;
                        break;
                    }
                } else {
                    foundCol = colIndex;
                    break;
                }
            }
        }

        if(foundRow !== false && foundCol !== false){
            return gridCoords[foundRow][foundCol];
        }
    }

    return null;
}


