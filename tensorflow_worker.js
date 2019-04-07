importScripts('https://cdn.jsdelivr.net/npm/setimmediate@1.0.5/setImmediate.min.js')
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@0.10.3')
tf.setBackend('cpu')

self.addEventListener('message', function(e) {
  console.log('from web worker')
      //this.window = this

      const res = tf.zeros([1, 2]).add(tf.ones([1, 2]))
      res.print()

      console.log(res);
      self.postMessage({res: res.dataSync(), shape: res.shape})
}, false);
