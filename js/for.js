// for.js


self.onmessage = function(event) {
  console.log(event)
	var t0= performance.now();



	                            function fib(n) {
                                    return n < 2 ? 1 : fib(n - 1) + fib(n - 2);
                                };
							//;fib(41)	;fib(42)

						for(var i=0;i<event.data;i++){
						  fib(40)
						}

    /*var i = 0;
                                while (++i < 100000 * 100000) {}

	var x = 0;
    for (var i = 0; i < 2000000000; i++) {
        x = x + i;
    }
    self.postMessage(x);

	importScripts('../js/index.js', '../js/jStat.js');

	console.log(event)

	loess_wrapper_extrapolate = function(x, y, span_vals = [0.5,0.6,0.7,0.8,0.9,1,1.1,1.2,1.3,1.4,1.5], folds = 5, options = {span:0.7,band:0,degree:"quadratic"}){

    function getRandom(arr, n) {
        var result = new Array(n),
            len = arr.length,
            taken = new Array(len);
        if (n > len)
            throw new RangeError("getRandom: more elements taken than available");
        while (n--) {
            var x = Math.floor(Math.random() * len);
            result[n] = arr[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
    }
    function indexOfSmallest(a) {
     var lowest = 0;
     for (var i = 1; i < a.length; i++) {
      if (a[i] < a[lowest]) lowest = i;
     }
     return lowest;
    }




     var mean_abs_error = Array.apply(null, Array(span_vals.length)).map(Number.prototype.valueOf,0);

     var index = Array.apply(null, {length: x.length}).map(Number.call, Number)



     for(var i=0; i<mean_abs_error.length;i++){

       //for(var k=0;k<folds;k++){
         index_train = getRandom(index, Math.floor(0.8 * x.length))
         index_test = index.filter( function( el ) { return index_train.indexOf( el ) < 0;});
       //}


       var modelRe = new loess.default({ y: index_train.map(i=>y[i]), x: index_train.map(i=>x[i]) }, {span:span_vals[i],band:options.band,degree:options.degree});
       var fitRe = modelRe.predict({x:index_test.map(i=>x[i]), x_cut:index_test.map(i=>x[i])});

       var fitted = fitRe.fitted

       mean_abs_error[i] = jStat.mean(jStat.abs(index_test.map(i=>y[i]).map((v,i) => v-fitted[i])))

     }

     best_span = span_vals[indexOfSmallest(mean_abs_error)]

     best_model = new loess.default({ y: y, x: x }, {span:best_span,band:options.band,degree:options.degree});

     return({best_model:best_model,best_span:best_span})
  }


	var result = loess_wrapper_extrapolate(event.data.index,event.data.value, [0.6,0.7,0.8,0.9,1,1.1,1.2,1.3,1.4,1.5], folds = 5, {span:0.7,band:0,degree:"quadratic"})
	console.log(result)*/
	var t1= performance.now();


	self.postMessage(t1-t0);

	//self.close();
}
