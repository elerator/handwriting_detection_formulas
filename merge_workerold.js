/* Imports */
importScripts('https://cdn.jsdelivr.net/npm/setimmediate@1.0.5/setImmediate.min.js')
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@0.10.3')
tf.setBackend('cpu')

importScripts('http://localhost:1234/input_symbol.js');
/* End of imports*/

self.addEventListener('message', function(symbol1,symbol2) {
        self.postMessage(overlap(symbol1.data,symbol2.data));
}, false);


/* Computes the region where both merged snippets overlap
    and returns upper left coordinte for both images (reference the respective coordinate system of the symbol)
    as well as width and height*/
function region_of_intersect(symbol1,symbol2){
        var xmin1 = symbol1.coordinates[0];
        var ymin1 = symbol1.coordinates[1];
        var xmax1 = symbol1.coordinates[2];
        var ymax1 = symbol1.coordinates[3];

        var xmin2 = symbol2.coordinates[0];
        var ymin2 = symbol2.coordinates[1];
        var xmax2 = symbol2.coordinates[2];
        var ymax2 = symbol2.coordinates[3];

        var xmin = Math.max(xmin1,xmin2);
        var xmax = Math.min(xmin1,xmin2);
        var ymin = Math.max(ymin1,ymin2);
        var ymax = Math.min(ymin1,ymin2);

        var left1 = Math.abs(xmin1 - xmin);
        var top1 = Math.abs(ymin1 - ymin);

        var left2 = Math.abs(xmin2 - xmin);
        var top2 = Math.abs(ymin2 - ymin);

        var width = Math.min(xmax1,xmax2)-Math.max(xmin1,xmin2);
        var height = Math.min(ymax1,ymax2)-Math.max(ymin1,ymin2);
        return [top1,left1,top2,left2,width,height];
}

/*Checks if bounding boxes defined by two symbols coordinates overlap*/
function box_overlap(symbol1,symbol2){
    var xmin1 = symbol1.coordinates[0];
    var ymin1 = symbol1.coordinates[1];
    var xmax1 = symbol1.coordinates[2];
    var ymax1 = symbol1.coordinates[3];

    var xmin2 = symbol2.coordinates[0];
    var ymin2 = symbol2.coordinates[1];
    var xmax2 = symbol2.coordinates[2];
    var ymax2 = symbol2.coordinates[3];

    return (xmax1 > xmin2) && (xmax2 > xmin1) && (ymax1 > ymin2) && (ymax2 > ymin1)
}

/* Checks if pixels of two symbols overlap*/
function overlap(symbol1,symbol2){
    if(box_overlap(symbol1,symbol2)){//check overlap efficiently by checking coordinates first
        //then find intersection to avoid checking an unnecessary large patch
        var intersect = region_of_intersect(symbol1,symbol2);
        var top1 = intersect[0];
        var left1 = intersect[1];
        var top2 = intersect[2];
        var left2 = intersect[3];
        var width = intersect[4];
        var height = intersect[5];


        var patch1 = symbol1.merged.slice([top1,left1],[height,width]);//Y then X!!
        var patch2 = symbol2.merged.slice([top2,left2],[height,width]);

        var array = tf.add(patch1, patch2);


        var overlap = tf.any(tf.equal(tf.add(patch1, patch2),510));//After adding up is there any pixel with value 2*255?
        return Boolean(Array.from(overlap.dataSync())[0])

    } return false;
}
