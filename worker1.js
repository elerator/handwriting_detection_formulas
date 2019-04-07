self.addEventListener('message', function(e) {
    var value = 0;
    while(value <= e.data){
        self.postMessage(value);
        value++;
    }
}, false);
