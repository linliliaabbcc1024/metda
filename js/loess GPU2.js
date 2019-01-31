function science_stats_loessUpdateBandwidthInterval(
  xval, weights, i, bandwidthInterval) {

  var left = bandwidthInterval[0],
      right = bandwidthInterval[1];

  // The right edge should be adjusted if the next point to the right
  // is closer to xval[i] than the leftmost point of the current interval
  var nextRight = science_stats_loessNextNonzero(weights, right);
  if ((nextRight < xval.length) && (xval[nextRight] - xval[i]) < (xval[i] - xval[left])) {
    var nextLeft = science_stats_loessNextNonzero(weights, left);
    bandwidthInterval[0] = nextLeft;
    bandwidthInterval[1] = nextRight;
  }
}

function science_stats_loessNextNonzero(weights, i) {
  var j = i + 1;
  while (j < weights.length && weights[j] === 0) j++;
  return j;
}

/*bandwidthInPoints = 129
xval = Array.apply(null, {length: ooo.e[0].length}).map(Number.call, Number)
weights = Array.apply(null, Array(ooo.e[0].length)).map(Number.prototype.valueOf,1);
n = xval.length
accuracy = 1e-12
robustnessWeights = weights
*/



  /*var bandwidthInterval = [0, bandwidthInPoints - 1];
	var edge_seq = [],
	bandwidthInterval_seq=[],
	denom_seq = [];
	i = -1; while (++i < n) {
		x = xval[i];

		// Find out the interval of source points on which
		// a regression is to be made.
		if (i > 0) {
		  science_stats_loessUpdateBandwidthInterval(xval, weights, i, bandwidthInterval);
		}

		var ileft = bandwidthInterval[0],
			iright = bandwidthInterval[1];
		edge_seq.push((xval[i] - xval[ileft]) > (xval[iright] - xval[i]) ? ileft : iright);
		bandwidthInterval_seq.push([ileft, iright])


    denom = Math.abs(1 / (xval[edge_seq[i]] - x));
		denom_seq.push(denom)
    }*/



var gpu = new GPU();
var LOESS_GPU_core = gpu.createKernel(function(xval,yval, weights,bandwidthInterval_seq, edge_seq, robustnessWeights, denom_seq) {

	var i = this.thread.x
	var j = this.thread.y

	var x = xval[i]
	var ileft = bandwidthInterval_seq[i][0]
	var iright = bandwidthInterval_seq[i][1]

	var sumWeights = 0,
		sumX = 0,
		sumXSquared = 0,
		sumY = 0,
		sumXY = 0,
		denom = denom_seq[i]

	for (var k = ileft; k <= iright; ++k) {
	  var xk   = xval[k];
		  var yk   = yval[k];
		  var dist = (x - xk) * Math.sign(i-k);
		  var temp_x = dist * denom;
		  temp_x =  1 - temp_x * temp_x * temp_x
		  temp_x = temp_x * temp_x * temp_x;
		  var w  = temp_x * robustnessWeights[k] * weights[k];

		  var xkw  = xk * w;

	  sumWeights += w;
	  sumX += xkw;
	  sumXSquared += xk * xkw;
	  sumY += yk * w;
	  sumXY += yk * xkw;
	}


	var meanX = sumX / sumWeights,
            meanY = sumY / sumWeights,
            meanXY = sumXY / sumWeights,
            meanXSquared = sumXSquared / sumWeights;
	var temp_accuracy = Math.sqrt(Math.abs(meanXSquared - meanX * meanX))

	var beta = (Math.sign(this.constants.accuracy - temp_accuracy)-1) * (-0.5*((meanXY - meanX * meanY) / (meanXSquared - meanX * meanX)))

	var alpha = meanY - beta * meanX;

	var res = beta * x + alpha;
	var residuals = Math.abs(yval[i] - res);

	var result = -1;

	if(j === 0){
	  result = res
	}
	if(j === 1){
	  result = residuals
	}

	//return(xval[edge_seq[i]])
	return(result)

},{
  constants: { weights_length: 1299 ,accuracy : 1e-12},
  output: [1299,2]
})


var LOESS_GPU = function(bandwidth=0.3, robustnessIters = 2, accuracy = 1e-12, xval, yval, weights){
  var n = xval.length,i;
  var bandwidthInPoints = Math.floor(bandwidth * n)
  if (bandwidthInPoints < 2) throw {error: "Bandwidth too small."};
  var robustnessWeights = [];
  i = -1; while (++i < n) {
    robustnessWeights[i] = 1;
  }
  var bandwidthInterval = [0, bandwidthInPoints - 1];
	var edge_seq = [],
	bandwidthInterval_seq=[],
	denom_seq = [];
	i = -1; while (++i < n) {
		x = xval[i];
		// Find out the interval of source points on which
		// a regression is to be made.
		if (i > 0) {
		  science_stats_loessUpdateBandwidthInterval(xval, weights, i, bandwidthInterval);
		}
		var ileft = bandwidthInterval[0],
			iright = bandwidthInterval[1];
		edge_seq.push((xval[i] - xval[ileft]) > (xval[iright] - xval[i]) ? ileft : iright);
		bandwidthInterval_seq.push([ileft, iright])
    denom = Math.abs(1 / (xval[edge_seq[i]] - x));
		denom_seq.push(denom)
    }


  var iter = -1;
  while (++iter <= robustnessIters) {
    o = LOESS_GPU_core(xval,yval,weights,bandwidthInterval_seq, edge_seq, robustnessWeights, denom_seq)
    if (iter === robustnessIters) {
      break;
    }
    var medianResidual = jStat.median(o[1]);
    if (Math.abs(medianResidual) < accuracy){
      break;
    }
    var arg,w;
    i = -1;
    while (++i < n) {
      arg = o[1][i] / (6 * medianResidual);
      robustnessWeights[i] = (arg >= 1) ? 0 : ((w = 1 - arg * arg) * w);
    }

  }
  return(o[0])
}

/*t0 = performance.now();
xval = Array.apply(null, {length: ooo.e[0].length}).map(Number.call, Number)
weights = Array.apply(null, Array(ooo.e[0].length)).map(Number.prototype.valueOf,1);
for(var i=0;i<ooo.e.length;i++){
  yval = ooo.e[i]
  o = LOESS_GPU(0.3, 2, 1e-12, xval, yval, weights)
}

performance.now() - t0;*/



