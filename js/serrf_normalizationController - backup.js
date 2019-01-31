angular
    .module('blankapp').controller("serrf_normalizationController", function($scope, $rootScope, Upload, $timeout, $mdToast){
      ctrl = this;


      ctrl.select_data_button_text = "Select A Dataset From Database"
      ctrl.upload_data_button_text = "Upload A Dataset"
      ctrl.use_example_data_button_text = "Use The Example Dataset"
      ctrl.submit_button_text = "Calculate"
      ctrl.download_button_text = "Download Result"
      ctrl.save_button_text = "Save Result To Database"


      ctrl.uploadFiles = function(file, errFiles) {
          ctrl.f = file;
          ctrl.errFile = errFiles && errFiles[0];
          if (file) {
             var req=ocpu.call("upload_serrf_normalization_dataset",{
               path:file
             },function(session){
               sss = session
               session.getObject(function(obj){
                 ooo = obj
                 var dataSet = ooo.data_matrix

                 if(typeof(preview_DataTable)!=='undefined'){
                   preview_DataTable.destroy();
                   $('#preview_datatable').empty();
                 }
                 preview_DataTable = $('#preview_datatable').DataTable({
                    data: dataSet,
                    columns: ooo.data_matrix[0].map(function(x, index){return {title:""}}),
                    "ordering": false,
                    "scrollX": true
                 });

                 ctrl.parameters = {}
                 ctrl.parameters.e = ooo.e
                 ctrl.parameters.f = ooo.f
                 ctrl.parameters.p = ooo.p


                 ctrl.groups_options = delete_element_from_array(Object.keys(ooo.p[0]),'label')
                 ctrl.parameters.type = ctrl.groups_options[ctrl.groups_options.length-2]
                 $scope.$watch("ctrl.parameters.type",function(newValue){
                   ctrl.parameters.qc_options = unpack(ooo.p, ctrl.parameters.type).filter(unique)
                   ctrl.parameters.qc = ctrl.parameters.qc_options[0]
                 },true)

                 ctrl.parameters.time = ctrl.groups_options[ctrl.groups_options.length-1]

                 ctrl.parameters.batch_check = ctrl.groups_options.length>2

                 ctrl.parameters.batch = ctrl.groups_options[ctrl.groups_options.length-3]

                 ctrl.parameters.cross_validated_span = true
                 ctrl.parameters.span = 0.75


                 $scope.$apply();
               })
             }).done(function(){
               $scope.$apply(function(){file.progress = 100;})
             }).fail(function(){
               alert("Error: " + req.responseText)
             });

          }
      }


      ctrl.submit = function(){
        t0 = performance.now();
        pca_plot_url = {}


        ctrl.submit_button_text = "Calculating"
        ctrl.progress = 0;


        before_pca = new ML.PCA(jStat.transpose(ooo.e),{scale:true})
        before_pca_scores = before_pca.predict(jStat.transpose(ooo.e))

        var before_x = before_pca_scores.map(x=>x[0])
        var before_y = before_pca_scores.map(x=>x[1])

        var before_x_lab_text = "PC 1 ("+(before_pca.getExplainedVariance()[0] * 100).toFixed(2)+"%)"
        var before_y_lab_text = "PC 2 ("+(before_pca.getExplainedVariance()[1] * 100).toFixed(2)+"%)"

        var before_color_by = unpack(ooo.p,ctrl.parameters.type).map(x => x===ctrl.parameters.qc? "QC":"Sample")
        var before_shape_by = Array.apply(null, Array(before_color_by.length)).map(Number.prototype.valueOf,0)

        var before_color_option = ["red","rgba(0, 0, 0, 0.26)"]
        var before_shape_option = ["circle"]
        var before_color_level = ["QC","Sample"]
        var before_shape_level = [""]
        var before_labels = unpack(ooo.p, "label")
        var before_scatter_size = 6
        var before_add_center = false
        var before_ellipse_color = false
        var before_ellipse_shape = false

        before_score_plot_dta = score_plot(before_x,before_y,before_x_lab_text, before_y_lab_text, null,  before_color_by, before_shape_by, before_color_option, before_shape_option, before_color_level, before_shape_level, before_labels, before_scatter_size, before_add_center, before_ellipse_color, before_ellipse_shape)
        before_score_plot_dta.layout.title = "PCA Score Plot - BEFORE"
        Plotly.newPlot('before_pca', before_score_plot_dta.data, before_score_plot_dta.layout).then(function(gd){
                    Plotly.toImage(gd,{format:'svg'})
                    .then(
                      function(url)
                      {
                         uuu = url
                         uuu = uuu.replace(/^data:image\/svg\+xml,/, '');
                         uuu = decodeURIComponent(uuu);
                         pca_plot_url.before_score_plot = btoa(unescape(encodeURIComponent(uuu)))
                       }
                   )
                  })


        if($("#before_pca_loading").length>0){
        before_pca_loadings = before_pca.getLoadings()
        //var before_x_loadings = before_pca_loadings.map(x=>x[0])
        //var before_y_loadings = before_pca_loadings.map(x=>x[1])
        var before_x_loadings = before_pca_loadings[0]
        var before_y_loadings = before_pca_loadings[1]
        var before_x_loadings_lab_text = "PC 1 ("+(before_pca.getExplainedVariance()[0] * 100).toFixed(2)+"%)"
        var before_y_loadings_lab_text = "PC 2 ("+(before_pca.getExplainedVariance()[1] * 100).toFixed(2)+"%)"


        before_loadings_plot_dta = loading_plot(before_x_loadings,before_y_loadings,before_x_loadings_lab_text,before_y_loadings_lab_text,null, Array.apply(null, Array(before_x_loadings.length)).map(Number.prototype.valueOf,1), Array.apply(null, Array(before_x_loadings.length)).map(Number.prototype.valueOf,1), ["black"], ["circle"], [1], [1], unpack(ooo.f, 'label'), 6, false, false, false)
        var before_pca_loading = document.getElementById('before_pca_loading')
        Plotly.newPlot('before_pca_loading', before_loadings_plot_dta.data, before_loadings_plot_dta.layout).then(function(gd){
          Plotly.toImage(gd,{format:'svg'})
          .then(
            function(url)
             {
               uuu = url
               uuu = uuu.replace(/^data:image\/svg\+xml,/, '');
               uuu = decodeURIComponent(uuu);
               pca_plot_url.before_loading_plot = btoa(unescape(encodeURIComponent(uuu)))
             }
         )
        })
        }







        // ctrl.parameters.type
        // ctrl.parameters.qc
        // ctrl.parameters.time
        // ctrl.parameters.batch_check
        // ctrl.parameters.batch
        // ctrl.parameters.cross_validated_span
        // ctrl.parameters.span

        // y = [0.07019306,0.21945284,-2.55545793,1.71277803, 2.30785163,-0.74824972,0.33511972,-1.51899673,1.48711059,1.50603550]
        // x = [-0.67095903,-0.42832105,-0.28572887,0.02362506,0.18857902,0.34971617,0.47584602,0.66884508,0.83475130,1.67507935]

      // var x = Array.apply(null, {length: y.length}).map(Number.call, Number)




/*
data = _.cloneDeep(ooo.e); p_data=ooo.p; f_data = ooo.f; type_column = ctrl.parameters.type;qc_level = ctrl.parameters.qc; time_column = ctrl.parameters.time; batch_check = ctrl.parameters.batch_check; batch_column=ctrl.parameters.batch;cross_validated_span = ctrl.parameters.cross_validated_span;span = ctrl.parameters.span

a
*/






result_normalized_data = [];
var full_index = Array.apply(null, {length: ooo.e[0].length}).map(Number.call, Number)
qc_index = getAllIndexes(unpack(ooo.p,ctrl.parameters.type), ctrl.parameters.qc)
/*var qc_time = qc_index.map(i => Number(unpack(ooo.p,ctrl.parameters.time)[i]))
var sample_index = full_index.filter( function( el ) { return qc_index.indexOf( el ) < 0;});
var sample_time = sample_index.map(i => Number(unpack(ooo.p,ctrl.parameters.time)[i]))
var full_time = full_index.map(i => Number(unpack(ooo.p,ctrl.parameters.time)[i]))
if(ctrl.parameters.batch_check){
  var batch_index = unpack(ooo.p,ctrl.parameters.batch)
}else{
  var batch_index = Array.apply(null, {length: y.length}).map(Number.call, Number)
  batch_index.fill("A")
}*/



// prepare QC samples for normalization
transpose_data = jStat.transpose(ooo.e)
qc_only_data = jStat.transpose(ooo.e.map(x=>qc_index.map(ii => x[ii])))

t0=performance.now();
var options = {
  seed: 3,
  maxFeatures: 20,
  //Number((qc_only_data[0].length/3).toFixed(0)),
  replacement: true,
  nEstimators: 3,
  useSampleBagging:false,
  treeOptions:{
    minNumSamples:Number((qc_only_data.length*0.1).toFixed(0)),
    maxDepth:5
  }
};
p = new Parallel(Array.apply(null, {length: ooo.f.length}).map(Number.call, Number), {maxWorkers:8,env: {
    qc_only_data:_.cloneDeep(qc_only_data),
    options:options
  },
  evalPath: 'js/eval.js' });
p.require('myJS.js')
p.require('jStat.js')
p.require('loess GPU.js')
p.require('https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js')
p.require('ml.js')

p.map(function(i){
  var current_compound_index = Array.apply(null, {length: global.env.qc_only_data[0].length}).map(Number.call, Number)
  current_compound_index.splice(i,1)

  var fullSet = global.env.qc_only_data.map(x => current_compound_index.map(i=>x[i]))
  var full_response = global.env.qc_only_data.map(x => x[i])
  var fullSet_index = Array.apply(null, {length: fullSet.length}).map(Number.call, Number)

  var cv_RSD = []
  for(var k=0;k<5;k++){
    var random_split_index = shuffle(fullSet_index );
    var trainingSet_index = random_split_index.slice(0, Math.floor(fullSet.length * 0.8));
    var testingSet_index = random_split_index.filter( function( el ) { return trainingSet_index.indexOf( el ) < 0;});
    //var testingSet_index = trainingSet_index
    var trainingSet = trainingSet_index.map(x=>fullSet[x])
    var testingSet = testingSet_index.map(x=>fullSet[x])

    var training_response = trainingSet_index.map(x=>full_response[x])
    var testing_response = testingSet_index.map(x=>full_response[x])

    var regression = new ML.RandomForestRegression(global.env.options);
    regression.train(trainingSet, training_response)
    var predicted = regression.predict(testingSet);
    var corrected = testing_response.map((x,i)=>x/predicted[i]).map(x=>x*jStat.median(testing_response))

    var corrected_outlier_rm = filterOutliers(corrected)

    cv_RSD.push(jStat.stdev(corrected_outlier_rm)/jStat.mean(corrected_outlier_rm))
  }

  var regression = new ML.RandomForestRegression(global.env.options);
  regression.train(fullSet, full_response)
  var final_predicted = regression.predict(fullSet);
  var final_corrected = full_response.map((x,i)=>x/final_predicted[i]).map(x=>x*jStat.median(full_response))


  return({cvRSD:jStat.mean(cv_RSD), final_corrected:final_corrected})

}).then(function(result){

  console.log("cv_RSD finished. Time: "+ (performance.now() - t0))

  r = result
  cv_RSD_performance = jStat.median(r.map(r=>r.cvRSD))
  console.log("Performance: "+ cv_RSD_performance)




  var sample_labels = unpack(ooo.p,"label")
  var compound_labels = unpack(ooo.f,"label")
  // find best spans using QC
  var full_index = Array.apply(null, {length: ooo.e[0].length}).map(Number.call, Number)
  qc_index = getAllIndexes(unpack(ooo.p,ctrl.parameters.type), ctrl.parameters.qc)
  var sample_index = full_index.filter( function( el ) { return qc_index.indexOf( el ) < 0;});
  var qc_time = qc_index.map(i => Number(unpack(ooo.p,ctrl.parameters.time)[i]))
  var sample_time = sample_index.map(i => Number(unpack(ooo.p,ctrl.parameters.time)[i]))
  var full_time = full_index.map(i => Number(unpack(ooo.p,ctrl.parameters.time)[i]))
  var full_weight = Array.apply(null, Array(ooo.e[0].length)).map(Number.prototype.valueOf,1);




  if(ctrl.parameters.batch_check){
    var batch_index = unpack(ooo.p,ctrl.parameters.batch)
  }else{
    var batch_index = Array.apply(null, {length: y.length}).map(Number.call, Number)
    batch_index.fill("A")
  }

  var batch_full = full_index.map(x=>batch_index[x])
  var batch_qc = qc_index.map(x=>batch_index[x])

  var batch_sample = sample_index.map(x=>batch_index[x])

  if(ctrl.parameters.cross_validated_span){
    var span_vals = _.range(0.01, 0.5, 0.01)
  }else{
    var span_vals = ctrl.parameters.span
  }

  var spans_for_each_batch = {}
  var serrf_line_for_each_batch = {}
  var normalized_data_for_each_batch = {}

  function serrf_normalization_get_normalized_samples(data = _.cloneDeep(ooo.e), p_data=ooo.p, f_data = ooo.f,
  full_index,
  sample_index,
  qc_index,
  qc_time,
  sample_time,
  full_time,
  batch_index,
  cross_validated_span = ctrl.parameters.cross_validated_span,
  span = ctrl.parameters.span
  ){

    //var full_index = Array.apply(null, {length: data[0].length}).map(Number.call, Number)
    //var qc_index = getAllIndexes(unpack(p_data,type_column), qc_level)
    //var sample_index = full_index.filter( function( el ) { return qc_index.indexOf( el ) < 0;});
    //var qc_time = qc_index.map(i => Number(unpack(p_data,time_column)[i]))
    //var sample_time = sample_index.map(i => Number(unpack(p_data,time_column)[i]))
    //var full_time = full_index.map(i => Number(unpack(p_data,time_column)[i]))
    var full_weight = Array.apply(null, Array(data[0].length)).map(Number.prototype.valueOf,1);
    /*if(batch_check){
        var batch_index = unpack(p_data,batch_column)
      }else{
        var batch_index = Array.apply(null, {length: y.length}).map(Number.call, Number)
        batch_index.fill("A")
      }*/

    var batch_full = full_index.map(x=>batch_index[x])
    var batch_qc = qc_index.map(x=>batch_index[x])

    var batch_sample = sample_index.map(x=>batch_index[x])

    if(cross_validated_span){
      var span_vals = _.range(0.01, 0.5, 0.01)
    }else{
      var span_vals = span
    }

    var sample_labels = unpack(p_data,"label")
    var compound_labels = unpack(f_data,"label")

    var batch_levels = batch_full.filter(unique)

    var spans_for_each_batch = {}
    var serrf_line_for_each_batch = {}
    /*var normalized_data_for_each_batch = {}*/

    t0=performance.now();
    for(var batch_i=0;batch_i<batch_levels.length;batch_i++){
      var current_batch = batch_levels[batch_i]
      serrf_line_for_each_batch[current_batch] = []
      normalized_data_for_each_batch[current_batch] = []

      p = new Parallel(_.cloneDeep(data), {maxWorkers:8,env: {
          batch_qc:batch_qc,
          full_index:full_index,
          current_batch:current_batch,
          qc_index:qc_index,
          full_time:full_time,
          batch_full:batch_full
        },
        evalPath: 'js/eval.js' });
      p.require('myJS.js')
      p.require('jStat.js')
      p.require('loess GPU.js')
      p.require('https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js')

      p.map( function (ind) {
        var qc_index_batch = getAllIndexes(global.env.batch_qc,global.env.current_batch)
        var cv_x = global.env.qc_index.map(x=>global.env.full_index[x])
        cv_x = qc_index_batch.map(x=>cv_x[x])
        cv_x = cv_x.map(x=>global.env.full_time[x]);

        var cv_y = global.env.qc_index.map(x=>global.env.full_index[x])
        cv_y = qc_index_batch.map(x=>cv_y[x])
        cv_y = cv_y.map(x=>ind[x])
        var best_span = serrf_wrapper_extrapolate(cv_x,cv_y, _.range(0.05, 1, 0.05), 5, 2, 2,0.8)
        //spans_for_each_batch[batch_levels[batch_i]].push(best_span)

        // ok the best span is selected, now need to use all the qc to fit curve.
        var index_batch = getAllIndexes(global.env.batch_full,global.env.current_batch)
        var x = index_batch.map(x=>global.env.full_time[x])
        var y = index_batch.map(x=>ind[x])
        var serrf2 = loess();
        serrf2.bandwidth(best_span)
        //.robustnessIterations(iter).accuracy(acy);
        var weights_in_thi_batch = index_batch.map((x,ii)=>global.env.qc_index.indexOf(x)==-1? 0:1)
        var yValuesSmoothed = serrf2(x, y, weights_in_thi_batch)
        var target_median = jStat.median(y)
        var diff = (yValuesSmoothed.map((x,ii)=>x/target_median))
        var normalized = y.map((x,ii)=>x / diff[ii])

        return ({yValuesSmoothed:yValuesSmoothed, current_batch:global.env.current_batch, normalized:normalized});
      }).then(function(result){
        console.log("!!")
        //$scope.$apply(function(){
          console.log("calculation finished!")
          rrr = result
          serrf_line_for_each_batch[rrr[0].current_batch] = rrr.map(x=>x.yValuesSmoothed)
          normalized_data_for_each_batch[rrr[0].current_batch] = rrr.map(x=>x.normalized)


          // now I need to adjust the standard deviation.

        //})
      })
    }
  }

  //result_normalized_data = []
  serrf_normalization_get_normalized_samples(_.cloneDeep(ooo.e), ooo.p, ooo.f,
  full_index,
  qc_index,
  sample_index,
  sample_time,
  qc_time,
  full_time,
  batch_index,
  ctrl.parameters.cross_validated_span,
  ctrl.parameters.span)


  var check_get_normalized_samples_interval = setInterval(function(){
    var length_checking = Object.values(normalized_data_for_each_batch).map(x=>x.length)
    if(length_checking.filter(unique).length === 1 && length_checking[0]!==0 && length_checking.length == batch_index.filter(unique).length){
      clearInterval(check_get_normalized_samples_interval)

      var unique_batches = Object.keys(normalized_data_for_each_batch)
      var sd_ratio = {}
      for(var batch_i=0;batch_i<unique_batches.length;batch_i++){
        var current_batch_data = normalized_data_for_each_batch[unique_batches[batch_i]]
        var current_batch_index = getAllIndexes(batch_index, unique_batches[batch_i])
        var current_qc_batch_index = []
        for(var i=0;i<qc_index.length;i++){
          if(current_batch_index.indexOf(qc_index[i])!==-1){
            current_qc_batch_index.push(i)
          }
        }
        var current_sample_batch_index = []
        for(var i=0;i<current_batch_index.length;i++){
          if(qc_index.indexOf(current_batch_index[i])===-1){
            current_sample_batch_index.push(i)
          }
        }



        var current_x_val = current_qc_batch_index.map(x=>qc_index[x]).map(x=>full_time[x])
        sd_ratio[unique_batches[batch_i]] = []
        for(var row_i=0;row_i<current_batch_data.length;row_i++){

          var current_y_val = current_qc_batch_index.map(x=>qc_index[x]).map(x=>ooo.e[row_i][x])

          var lm_for_qc = new ML.PolynomialRegression(current_x_val, current_y_val, 2);
          var qc_value_trend = lm_for_qc.predict(current_x_val)
          var qc_value_removed_trend = current_y_val.map((x,i)=>x/qc_value_trend[i])
          /*var qc_loess = loess();
          qc_value_trend = qc_loess = (current_x_val, current_y_val)
          qc_value_removed_trend = current_y_val.map((x,i)=>x/qc_value_trend[i]).map(x => jStat.mean(current_y_val))*/
          var qc_sd_before = jStat.stdev(qc_value_removed_trend)*jStat.mean(current_y_val)
          var current_qc_value = current_qc_batch_index.map(x=>r[row_i].final_corrected[x])
          var qc_sd_after = jStat.stdev(current_qc_value)
           sd_ratio[unique_batches[batch_i]].push(qc_sd_before/qc_sd_after)
          var sd_diff = jStat.max([qc_sd_before-qc_sd_after,0])

          var current_normalized_sample_val = current_sample_batch_index.map(x=>normalized_data_for_each_batch[unique_batches[batch_i]][row_i][x])

          var sd_sample = jStat.stdev(current_normalized_sample_val)
          var corrected_sample_value = normalized_data_for_each_batch[unique_batches[batch_i]][row_i].map(x=>x*((sd_sample - sd_diff) / sd_sample))

          normalized_data_for_each_batch[unique_batches[batch_i]][row_i] = corrected_sample_value
        }
      }

      result_normalized_data = [];
      for(var index=0;index<ooo.e.length;index++){
        var averages = {}
        for(var batch_ii=0;batch_ii<batch_index.filter(unique).length;batch_ii++){
          var current_batch = batch_index.filter(unique)[batch_ii]
          var current_sample_batch_index = []
          var current_batch_index = getAllIndexes(batch_index, current_batch)
          for(var i=0;i<current_batch_index.length;i++){
            if(qc_index.indexOf(current_batch_index[i])===-1){
              current_sample_batch_index.push(i)
            }
          }
          averages[current_batch] = jStat.median(current_sample_batch_index.map(x=>normalized_data_for_each_batch[current_batch][index][x]))
        }
        var global_average = jStat.mean(Object.values(averages))
        /*for(var batch_ii=0;batch_ii<batch_index.filter(unique).length;batch_ii++){
          var current_batch = batch_index.filter(unique)[batch_ii]
          var current_sample_batch_index = []
          var current_batch_index = getAllIndexes(batch_index, current_batch)
          for(var i=0;i<current_batch_index.length;i++){
            if(qc_index.indexOf(current_batch_index[i])===-1){
              current_sample_batch_index.push(i)
            }
          }

          var rep_average = Array.apply(null, Array(current_sample_batch_index.map(x=>normalized_data_for_each_batch[current_batch][index][x]).length)).map(Number.prototype.valueOf,averages[current_batch]);
          factor[batch_index.filter(unique)[batch_ii]] = rep_average.map(x => x/global_average)
        }*/
        var factor = {}
        for(var batch_ii=0;batch_ii<batch_index.filter(unique).length;batch_ii++){
          var current_batch = batch_index.filter(unique)[batch_ii]
          factor[current_batch] = averages[current_batch]/global_average
        }

        // after getting the factor, normalize each sample.
        normalized_data = {}
        for(var batch_ii=0;batch_ii<batch_index.filter(unique).length;batch_ii++){
          var current_batch = batch_index.filter(unique)[batch_ii]
          normalized_data[current_batch] = _.cloneDeep(normalized_data_for_each_batch[current_batch][index])
        }
        for(var batch_ii=0;batch_ii<batch_index.filter(unique).length;batch_ii++){
          var current_batch = batch_index.filter(unique)[batch_ii]
          normalized_data[current_batch] = normalized_data[current_batch].map((x,ii) => x/factor[current_batch])
        }
        // correct for the mean difference
        normalized_value = flatten(Object.values(normalized_data))
        normalized_value = normalized_value.map((x,i) => qc_index.indexOf(i)!==-1 ? r[index].final_corrected[qc_index.indexOf(i)]:x)
        var old_ratio = jStat.median(qc_index.map(x => ooo.e[index][x]))/jStat.median(sample_index.map(x => ooo.e[index][x]))
        var current_ratio = jStat.median(qc_index.map(x => normalized_value[x]))/jStat.median(sample_index.map(x => normalized_value[x]))
        var ratio = old_ratio/current_ratio

        normalized_value = normalized_value.map((x,i) => qc_index.indexOf(i)!==-1 ? normalized_value[i]*ratio:x)

        var final_ratio = jStat.mean(normalized_value)/jStat.mean(ooo.e[index])
        normalized_value = normalized_value.map(x => x/final_ratio)

        //var sd_ratio = mean_ratio< 1? jStat.max(Object.values(sd_ratio).map(x => x[index]))
        //var mean_diff_adjusted = jStat.min(mean_diff/sd_diff,mean_diff)


        //result_normalized_data.push(Object.assign({}, [compound_labels[0]].concat(normalized_value)))
        result_normalized_data.push(normalized_value)
        ctrl.progress = index/ooo.e.length * 100
        //console.log(ctrl.progress)

        // make all qc the normalized qc.
          //corrected_sample_value = corrected_sample_value.map((x,i) => current_sample_batch_index.indexOf(i)===-1?r[row_i].final_corrected[i]:x)
        }
        result_datatable = []
        qc_only_data_transpose = jStat.transpose(qc_only_data)
        for(var i=0;i<ooo.e.length;i++){
          var corrected_outlier_rm = filterOutliers(qc_only_data_transpose[i])
          result_datatable.push({
            index:i,
            label:compound_labels[i],
            before_QC_RSD:((jStat.stdev(corrected_outlier_rm)/jStat.mean(corrected_outlier_rm)).toFixed(3)*100).toFixed(1),
            after_QC_RSD:(r[i].cvRSD.toFixed(3)*100).toFixed(1)
          })
        }
        if(typeof(result_DataTable)!=='undefined'){
         result_DataTable.destroy();
        }
        var dataSet = result_datatable.map(x => Object.values(x))
        result_DataTable = $('#result_datatable').DataTable({
          data: dataSet,
          columns: Object.keys(result_datatable[0]).map(function(x){return({title:x})}),
          "ordering": true,
          "scrollX": false,
           "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
           initComplete:function(){
             var api = this.api();
             var CurrentRow = api.row({ order: 'current' }, 0);
             CurrentRow.$('tr:first').addClass('selected');
           }
        });
       var before_color_option = ["red","rgba(0, 0, 0, 0.26)"]
        var before_shape_option = ["circle"]
         var old_sample_trace = {
           x:sample_time,
           y:sample_index.map(x=>ooo.e[0][x]),
           text:sample_index.map(x=>sample_labels[x]),
           mode:'markers',name:'samples',legendgroup:"sample",xaxis:"x",yaxis:"y",marker:{color:"rgba(0, 0, 0, 0.26)",symbol:"circle",line:{
                width:1,
                color:"rgba(0,0,0,1)"
              }},text:""
         }
         var old_qc_trace = {
           x:qc_time,
           y:qc_index.map(x=>ooo.e[0][x]),
           text:qc_index.map(x=>sample_labels[x]),
           mode:'markers',name:'QCs',legendgroup:"qc",xaxis:"x",yaxis:"y",marker:{color:"red",line:{
                width:1,
                color:"rgba(0,0,0,1)"
              }},text:""
         }
         var new_sample_trace = {
           x:sample_time,
           y:sample_index.map(x=>result_normalized_data[0][x]),
           text:sample_index.map(x=>sample_labels[x]),
           mode:'markers',name:'samples',legendgroup:"sample",xaxis:"x2",yaxis:"y",marker:{color:"rgba(0, 0, 0, 0.26)",symbol:"circle",line:{
                width:1,
                color:"rgba(0,0,0,1)"
              }},text:"",showlegend:false
         }
         var new_qc_trace = {
           x:qc_time,
           y:qc_index.map(x=>result_normalized_data[0][x]),
           text:qc_index.map(x=>sample_labels[x]),
           mode:'markers',name:'QCs',legendgroup:"qc",xaxis:"x2",yaxis:"y",marker:{color:"red",line:{
                width:1,
                color:"rgba(0,0,0,1)"
              }},text:"text",showlegend:false
         }
         var plot_data = [old_sample_trace, old_qc_trace, new_sample_trace, new_qc_trace]
         var layout = {
                 xaxis:{
                   range:[0, ooo.e[0].length],
                   domain:[0,0.4842788]
                 },
                 yaxis:{
                   range: [jStat.min([jStat.min(ooo.e[0]), jStat.min(result_normalized_data[0])]),jStat.max([jStat.max(ooo.e[0]), jStat.max(result_normalized_data[0])])],
                   domain:[0,1.0000000]
                 },
                 xaxis2:{
                   range:[0, ooo.e[0].length],
                   domain:[0.5157212,1.0000000]
                 },
                 title:compound_labels[0]
               }
        Plotly.newPlot(scatter_plot, plot_data, layout)


        var after_score_plot = result_normalized_data
        after_pca = new ML.PCA(jStat.transpose(after_score_plot),{scale:true})
        after_pca_scores = after_pca.predict(jStat.transpose(after_score_plot))

        var after_x = after_pca_scores.map(x=>x[0])
        var after_y = after_pca_scores.map(x=>x[1])

        var after_x_lab_text = "PC 1 ("+(after_pca.getExplainedVariance()[0] * 100).toFixed(2)+"%)"
        var after_y_lab_text = "PC 2 ("+(after_pca.getExplainedVariance()[1] * 100).toFixed(2)+"%)"

        var after_color_by = unpack(ooo.p,ctrl.parameters.type).map(x => x===ctrl.parameters.qc? "QC":"Sample")
        var after_shape_by = Array.apply(null, Array(after_color_by.length)).map(Number.prototype.valueOf,0)

        var after_color_option = ["red","rgba(0, 0, 0, 0.26)"]
        var after_shape_option = ["circle"]
        var after_color_level = ["QC","Sample"]
        var after_shape_level = [""]
        var after_labels = unpack(ooo.p, "label")
        var after_scatter_size = 6
        var after_add_center = false
        var after_ellipse_color = false
        var after_ellipse_shape = false

        after_score_plot_dta = score_plot(after_x,after_y,after_x_lab_text, after_y_lab_text, null,  after_color_by, after_shape_by, after_color_option, after_shape_option, after_color_level, after_shape_level, after_labels, after_scatter_size, after_add_center, after_ellipse_color, after_ellipse_shape)
        after_score_plot_dta.layout.title = "PCA Score Plot - AFTER"
        Plotly.newPlot('after_pca', after_score_plot_dta.data, after_score_plot_dta.layout).then(function(gd){
                    Plotly.toImage(gd,{format:'svg'})
                    .then(
                      function(url)
                      {
                         uuu = url
                         uuu = uuu.replace(/^data:image\/svg\+xml,/, '');
                         uuu = decodeURIComponent(uuu);
                         pca_plot_url.after_score_plot = btoa(unescape(encodeURIComponent(uuu)))
                       }
                   )
                  })



if($("#after_pca_loading").length>0){

        after_pca_loadings = after_pca.getLoadings()
        //var after_x_loadings = after_pca_loadings.map(x=>x[0])
        //var after_y_loadings = after_pca_loadings.map(x=>x[1])
        var after_x_loadings = after_pca_loadings[0]
        var after_y_loadings = after_pca_loadings[1]
        var after_x_loadings_lab_text = "PC 1 ("+(after_pca.getExplainedVariance()[0] * 100).toFixed(2)+"%)"
        var after_y_loadings_lab_text = "PC 2 ("+(after_pca.getExplainedVariance()[1] * 100).toFixed(2)+"%)"


        after_loadings_plot_dta = loading_plot(after_x_loadings,after_y_loadings,after_x_loadings_lab_text,after_y_loadings_lab_text,null, Array.apply(null, Array(after_x_loadings.length)).map(Number.prototype.valueOf,1), Array.apply(null, Array(after_x_loadings.length)).map(Number.prototype.valueOf,1), ["black"], ["circle"], [1], [1], unpack(ooo.f, 'label'), 6, false, false, false)
          var after_pca_loading = document.getElementById('after_pca_loading')
        Plotly.newPlot('after_pca_loading', after_loadings_plot_dta.data, after_loadings_plot_dta.layout).then(function(gd){
          Plotly.toImage(gd,{format:'svg'})
          .then(
            function(url)
             {
               uuu = url
               uuu = uuu.replace(/^data:image\/svg\+xml,/, '');
               uuu = decodeURIComponent(uuu);
               pca_plot_url.after_loading_plot = btoa(unescape(encodeURIComponent(uuu)))
             }
         )
        })
}




         $('#result_datatable').on( 'click', 'tr', function (row) {

           var row_index = result_DataTable.row( this ).index()
           layout.title =  compound_labels[row_index]
           var raw_value = ooo.e[row_index]
           var normalized_value = result_normalized_data[row_index]
           layout.yaxis.range = [jStat.min([jStat.min(raw_value), jStat.min(normalized_value)]),jStat.max([jStat.max(raw_value), jStat.max(normalized_value)])]
           Plotly.relayout(scatter_plot,layout)
           Plotly.restyle(scatter_plot, {y:[sample_index.map(x=>ooo.e[row_index][x]),qc_index.map(x=>ooo.e[row_index][x]),sample_index.map(x=>result_normalized_data[row_index][x]),qc_index.map(x=>result_normalized_data[row_index][x])]},Array.apply(null, {length: batch_qc.filter(unique).length}).map(Number.call, Number)).then(
          function(gd)
           {
            console.log("GOOD")
          })
          if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
          }else {
              result_DataTable.$('tr.selected').removeClass('selected');
              $(this).addClass('selected');
          }

         })
         if($("#before_pca_loading").length>0){

         before_pca_loading.on('plotly_click', function(data){
          console.log(data)
          ddd = data
          var row_index = ddd.points[0].pointIndex
           layout.title =  compound_labels[row_index]
           var raw_value = ooo.e[row_index]
           var normalized_value = result_normalized_data[row_index]
           layout.yaxis.range = [jStat.min([jStat.min(raw_value), jStat.min(normalized_value)]),jStat.max([jStat.max(raw_value), jStat.max(normalized_value)])]
           Plotly.relayout(scatter_plot,layout)
           Plotly.restyle(scatter_plot, {y:[sample_index.map(x=>ooo.e[row_index][x]),qc_index.map(x=>ooo.e[row_index][x]),sample_index.map(x=>result_normalized_data[row_index][x]),qc_index.map(x=>result_normalized_data[row_index][x])]},Array.apply(null, {length: batch_qc.filter(unique).length}).map(Number.call, Number)).then(
          function(gd)
           {
            console.log("GOOD")
          })

        });
         }





      if($("#after_pca_loading").length>0){
           after_pca_loading.on('plotly_click', function(data){
            console.log(data)
            ddd = data
            var row_index = ddd.points[0].pointIndex
             layout.title =  compound_labels[row_index]
             var raw_value = ooo.e[row_index]
             var normalized_value = result_normalized_data[row_index]
             layout.yaxis.range = [jStat.min([jStat.min(raw_value), jStat.min(normalized_value)]),jStat.max([jStat.max(raw_value), jStat.max(normalized_value)])]
             Plotly.relayout(scatter_plot,layout)
             Plotly.restyle(scatter_plot, {y:[sample_index.map(x=>ooo.e[row_index][x]),qc_index.map(x=>ooo.e[row_index][x]),sample_index.map(x=>result_normalized_data[row_index][x]),qc_index.map(x=>result_normalized_data[row_index][x])]},Array.apply(null, {length: batch_qc.filter(unique).length}).map(Number.call, Number)).then(
            function(gd)
             {
              console.log("GOOD")
            })

          });
      }



















        console.log("Calculation Time: "+(performance.now()-t0));
        ctrl.submit_button_text = "Calculate"
        $scope.$apply();


    }else{
      console.log("Waiting results...")
    }
  }, 100);


  console.log("Done!")
})

      }



      ctrl.download = function(){
        ctrl.download_button_text = "DOWNLOADING"
        var zip = new JSZip();

        for(var i=0;i<Object.keys(pca_plot_url).length;i++){
          zip.file(Object.keys(pca_plot_url)[i]+".svg", Object.values(pca_plot_url)[i], {base64: true});
        }

        zip.file("LOESS Normalized Data.csv", Papa.unparse(result))

        zip.generateAsync({type:"blob"})
        .then(function (blob) {
            saveAs(blob, "SERRF Normalization.zip");
        });



      }

	})






























