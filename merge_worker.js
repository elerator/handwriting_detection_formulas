importScripts('https://cdn.jsdelivr.net/npm/setimmediate@1.0.5/setImmediate.min.js');
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@0.10.3');
tf.setBackend('cpu');

importScripts('http://localhost:1234/InputSymbol.js');
//--------------------------- End of imports ----------------------------------//


self.addEventListener('message', check, false);

/*Checks if symbols belong together and should be merged*/
function check(args) {
  var symbol1 = args.data[0];//get first argument
  //var arg2 = m1.data[1];//get second argument

  console.log('from web worker');
  //console.log(symbol1);//TODO typecast to InputSymbol .... copy constructor etc? https://stackoverflow.com/questions/8736886/can-we-cast-a-generic-object-to-a-custom-object-type-in-javascript
  var testsym = new InputSymbol(symbol1);
  console.log("testsym");
  console.log(testsym);

  //console.log(tf);

  //const res = tf.zeros([1, 2]).add(tf.ones([1, 2]));
  //self.postMessage({res: res.dataSync(), shape: res.shape})
  self.postMessage("here we go?");
}
