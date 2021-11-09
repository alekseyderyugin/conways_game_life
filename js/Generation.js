class Generation{
    /**
     * @param {Grid} grid
     */
    constructor(grid) {
        this.generation = this._generateGenerationByGrid(grid.getGridCoords());
    }

    getGeneration(){
        return this.generation;
    }

    getGenerationCopy(originGeneration){
        let newGeneration = [];
        for(let i = 0; i < originGeneration.length; i++){
            newGeneration[i] = new Array(originGeneration[i].length);
            for(let j = 0; j < originGeneration[i].length; j++){
                newGeneration[i][j] = originGeneration[i][j];
            }
        }

        return newGeneration;
    }

    _generateGenerationByGrid(gridCoords){
        let length = gridCoords.length;
        let lines = new Array(length);

        for(let i = 0; i < length; i++){
            lines[i] = new Array(gridCoords[i].length);
            lines[i].fill(0);
        }

        return lines;
    }
}