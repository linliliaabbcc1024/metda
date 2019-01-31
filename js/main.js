// main.js
var workerFor = new Worker('../js/for.js');
// listen to message event of worker
workerFor.onmessage = function(event){
    var div = document.getElementById('result');
    div.innerHTML = 'message received => ' + event.data;
};
// listen to error event of worker
workerFor.onerror = function(event) {
    console.error('error received from workerFor => ', event);
    var div = document.getElementById('result');
    div.innerHTML = 'Error!';
	// workerFor.terminate();
};
// load results from web worker
function loadResult() {
    // add loading text until `message` event listener replaces it
    var div = document.getElementById('result');
    div.innerHTML = 'loading...';
    // emit message event to worker
    workerFor.postMessage(45); // we don't need payload here
	// {index:Array.apply(null, {length: ooo.e[1].length}).map(Number.call, Number), value:ooo.e[1]}
};


/*
// create blob from JavaScript code (ES6 template literal)
var blob = new Blob([`
    self.onmessage = function(e) {
    var x = 0;
    for (var i = 0; i < 20000000000; i++) {
        x = x + i;
    }
    self.postMessage(x);
    }
`]);
// create blob url from blob
var blobURL = window.URL.createObjectURL(blob);
// create web worker from blob url
var worker = new Worker(blobURL);
// send event to web worker
worker.postMessage(null);
// listen to message event from web worker
worker.onmessage = function (event) {
    console.log(event.data);
};

*/
