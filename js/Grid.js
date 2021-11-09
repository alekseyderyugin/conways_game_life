

class Grid{

    FILLED_CELL_SIZE = 8;
    FILLED_CELL_PADDING = 1;

    isb = false;

    constructor(boxWidth, boxHeight, cellSize, gridPadding) {
        this.boxWidth = boxWidth;
        this.boxHeight = boxHeight;
        this.cellSize = cellSize;
        this.gridPadding = gridPadding;
        this.gridCoords = this._generateGridCoords();
    }

    /**
     * @returns {array<array<CellCoords>>}
     */
    getGridCoords(){
        return this.gridCoords;
    }

    /**
     * @param {CanvasRenderingContext2D} context
     * @param {Generation} generation
     */
    drawGrid(context, generation){
        //очистка canvas
        //context.clearRect(0, 0, canvas.width, canvas.height);

        let boxWidth = this.boxWidth;
        let boxHeight = this.boxHeight;
        let cellSize = this.cellSize;
        let padding = 0;

        if(!this.isb){
            for (let x = 0; x <= boxWidth; x += cellSize) {
                context.moveTo(padding + x, 0);
                context.lineTo(padding + x, boxHeight);
            }

            for (let x = 0; x <= boxHeight; x += cellSize) {
                context.moveTo(0, padding + x);
                context.lineTo(boxWidth , padding + x);
            }


            context.strokeStyle = "#c4c4c4";
            context.stroke();

            this.isb = true;
        }

        const thisGrid = this;
        reduceGeneration(generation, function(rowI, colI){
            if(generation[rowI][colI] == 1){
                thisGrid.fillCell(context, rowI, colI);
            }else{
                thisGrid.clearCell(context, rowI, colI);
            }
        });
    }

    /**
     * @param {RenderingContext} context
     * @param {int} rowI
     * @param {int} colI
     */
    fillCell(context, rowI, colI){
        let cellCoords = this.getGridCoords()[rowI][colI];
        context.fillRect(cellCoords.x, cellCoords.y, this.FILLED_CELL_SIZE, this.FILLED_CELL_SIZE);
    }

    fillCellColored(context, cellCoordinates, color){
        let lastFillStyle = context.fillStyle;
        context.fillStyle = color;
        context.fillRect(cellCoordinates.x, cellCoordinates.y, this.FILLED_CELL_SIZE, this.FILLED_CELL_SIZE);
        context.fillStyle = lastFillStyle;
    }

    /**
     * @param {RenderingContext} context
     * @param rowI
     * @param colI
     */
    clearCell(context, rowI, colI){
        let cellCoords = this.getGridCoords()[rowI][colI];
        context.clearRect(cellCoords.x, cellCoords.y, this.FILLED_CELL_SIZE, this.FILLED_CELL_SIZE);
    }

    /**
     * @returns {array<array<CellCoords>>}
     * @private
     */
    _generateGridCoords(){
        let gridCoords = [];
        let boxWidth = this.boxWidth;
        let boxHeight = this.boxHeight;
        let cellSize = this.cellSize;
        let padding = this.FILLED_CELL_PADDING;
        let id = 0;

        for(let y = 0, rowI = 0; y < boxHeight; y += cellSize, rowI++) {
            let gridLine = [];

            for (let x = 0, colI = 0; x < boxWidth; x += cellSize, colI++, id++) {

                let xCoord = padding + x;
                let yCoord = padding + y;

                if(x == boxWidth - padding){
                    xCoord += padding;
                }

                if(y == boxHeight - padding){
                    yCoord += padding;
                }

                gridLine.push(new CellCoords(xCoord, yCoord, rowI, colI, id));
            }
            gridCoords.push(gridLine);
        }

        return gridCoords;
    }
}

/**
 * @private
 */
class CellCoords{
    constructor(x, y, rowI, colI, id) {
        this.x = x;
        this.y = y;
        this.rowI = rowI;
        this.colI = colI;
        this.id = id;
    }
}