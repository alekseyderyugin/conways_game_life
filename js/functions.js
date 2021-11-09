
/**
 * Пройтись по поколению
 * @param generation
 * @param {function} callback
 */
function reduceGeneration(generation, callback){
    for(let rowI = 0; rowI < generation.length; rowI++){
        let row = generation[rowI];
        for(let colI = 0; colI < row.length; colI++){
            callback(rowI, colI);
        }
    }
}

/**
 * @deprecated
 * @param context
 * @param x
 * @param y
 * @param radius
 * @param fillStyle
 */
function drawCircle(context, x, y, radius, fillStyle){
    context.beginPath();
    context.arc (x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = fillStyle;
    context.fill();
}

/**
 * @constructor
 */
function Game(){
    let interval;

    /**
     *
     * @param {function} drawFnc
     */
    this.start = function(drawFnc) {
        if(!interval){
            interval = setInterval(drawFnc, 30);
        }
    }

    this.stop = function() {
        clearInterval(interval);
        interval = false;
    }
}