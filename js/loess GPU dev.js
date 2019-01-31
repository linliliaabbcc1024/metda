var gpu = new GPU();

var weights = Array.apply(null, Array(ooo.e[0].length)).map(Number.prototype.valueOf,1);

var science_stats_loessNextNonzero = gpu.createKernel(function(weights,i){
	
	var j = i+1;
	while (j < this.constants.weights_length && weights[j]===0) j++;
	
	return(j)

	
}, {
	output:[1],
	constants:{weights_length:1299}
})

science_stats_loessNextNonzero(weights,2)

















/*
t0=performance.now();
 var bandwidth = .1,
      robustnessIters = 2,
      accuracy = 1e-12;
o = loess();
o.bandwidth(bandwidth);o.robustnessIterations(robustnessIters);
xval = Array.apply(null, {length: ooo.e[0].length}).map(Number.call, Number)
yval = ooo.e[0]
o(x,y)
performance.now()-t0


t0=performance.now();
 var bandwidth = .1,
      robustnessIters = 2,
      accuracy = 1e-12;
o = loessGPU();
o.bandwidth(bandwidth);o.robustnessIterations(robustnessIters);
xval = Array.apply(null, {length: ooo.e[0].length}).map(Number.call, Number)
yval = ooo.e[0]
o(x,y)
performance.now()-t0


160202.42680722513







*/