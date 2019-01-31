angular
    .module('blankapp').controller("loess_normalizationController", function($state, $scope, $rootScope, Upload, $timeout, $mdToast){
      ctrl = this;
      ctrl.initScope = function() {
          $state.go('serrf_normalization_state');
          mainctrl.tabIndex = 1; mainctrl.module_label = 'SERRF';
      }

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
             var req=ocpu.call("upload_loess_normalization_dataset",{
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


      var final_normalized_data = []
      ctrl.submit = function(){
        t0 = performance.now();

        pca_plot_url = {}


        ctrl.submit_button_text = "Calculating"
        ctrl.progress = 0;
        final_normalized_data = []
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

  var sample_labels = unpack(ooo.p,"label")
  var compound_labels = unpack(ooo.f,"label")
  // find best spans using QC
  var full_index = Array.apply(null, {length: ooo.e[0].length}).map(Number.call, Number)
  var qc_index = getAllIndexes(unpack(ooo.p,ctrl.parameters.type), ctrl.parameters.qc)
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
  var loess_line_for_each_batch = {}
  var normalized_data_for_each_batch = {}



for(var batch_i=0;batch_i<batch_index.filter(unique).length;batch_i++){

    var current_batch = batch_index.filter(unique)[batch_i]
    loess_line_for_each_batch[current_batch] = []
    normalized_data_for_each_batch[current_batch] = []


    p = new Parallel(_.cloneDeep(ooo.e), {maxWorkers:8,env: {
     // e:ooo.e,
      batch_qc:batch_qc,
      full_index:full_index,
      current_batch:current_batch,
      qc_index:qc_index,
      full_time:full_time,
      batch_full:batch_full
      },evalPath: 'js/eval.js' });

         //p.require('gpu.js')
         p.require('myJS.js')
         p.require('jStat.js')
         //CPU
         p.require('loess GPU.js')
         //p.require('loess GPU2.js')
         p.require('https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js')

      p.map( function (ind) {
        //var gpu = new GPU();
       var qc_index_batch = getAllIndexes(global.env.batch_qc,global.env.current_batch)
      var cv_x = global.env.qc_index.map(x=>global.env.full_index[x])
      cv_x = qc_index_batch.map(x=>cv_x[x])
      cv_x = cv_x.map(x=>global.env.full_time[x]);

      var cv_y = global.env.qc_index.map(x=>global.env.full_index[x])
      cv_y = qc_index_batch.map(x=>cv_y[x])
      cv_y = cv_y.map(x=>ind[x])
      // CPU
      var best_span = loess_wrapper_extrapolate(cv_x,cv_y, _.range(0.01, 1, 0.01), 5, 2, 2,ratio=0.8)
      /*try{
        var best_span = loess_wrapper_extrapolate_GPU(cv_x,cv_y, _.range(0.01, 1, 0.01), 5, 2, 1,ratio=0.8)
      }
      catch(err){
        var best_span = err.message
      }*/

      //spans_for_each_batch[batch_index.filter(unique)[batch_i]].push(best_span)

      // ok the best span is selected, now need to use all the qc to fit curve.
      var index_batch = getAllIndexes(global.env.batch_full,global.env.current_batch)
      var x = index_batch.map(x=>global.env.full_time[x])
      var y = index_batch.map(x=>ind[x])

      // CPU
      var loess2 = loess();
      loess2.bandwidth(best_span)
      //.robustnessIterations(iter).accuracy(acy);

      var weights_in_thi_batch = index_batch.map((x,ii)=>global.env.qc_index.indexOf(x)==-1? 0:1)

      // CPU
      var yValuesSmoothed = loess2(x, y, weights_in_thi_batch)
      //var yValuesSmoothed = LOESS_GPU(best_span, 2, 1e-12, x, y, weights_in_thi_batch)


      var target_median = jStat.median(y)

      var diff = (yValuesSmoothed.map((x,ii)=>x/target_median))

      var normalized = y.map((x,ii)=>x / diff[ii])


      return ({yValuesSmoothed:yValuesSmoothed, current_batch:global.env.current_batch, normalized:normalized});
      //return(best_span)

    }).then(function(result){
      console.log("calculation finished!")
      console.log("Calcuation Time: "+(performance.now() - t0))
      rrr = result
      loess_line_for_each_batch[rrr[0].current_batch] = rrr.map(x=>x.yValuesSmoothed)
      normalized_data_for_each_batch[rrr[0].current_batch] = rrr.map(x=>x.normalized)
    })
      }


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




      var normalization_done_checking = setInterval(function(){
        var batch_numbers = []
        for(var batch_i=0;batch_i<batch_index.filter(unique).length;batch_i++){
          batch_numbers[batch_i] = normalized_data_for_each_batch[batch_index.filter(unique)[batch_i]].length
        }

        if(batch_numbers.filter(unique).length === 1 && batch_numbers[0]!==0){// this means all the batches have the same number of observations, indicating that the normalization for each batch is done.

          clearInterval(normalization_done_checking);
          // when calculation is done. Need to put all the normalized dataset into the same level, i.e. batch normalization.
          console.log("Calculation Time: "+ (performance.now() - t0))
          console.log("done!");


          //$scope.$apply(function(){

result_normalized_data = []
var index = 0;
plot_url = []


after_score_plot = []


var plot_data = [
               {x:sample_time,y:sample_time, mode: 'markers', name:'samples', legendgroup:"sample",xaxis:"x",yaxis:"y",marker:{color:"black"},text:'text'},
               {x:qc_time,y:qc_time, mode: 'markers',name:'QCs', legendgroup:"qc",xaxis:"x",yaxis:"y",marker:{color:"red"},text:""},
               {x:full_time,y:full_time,mode:'lines',name:'fitted curve', legendgroup:"fitted_line",xaxis:"x",yaxis:"y",marker:{color:"red"},line:{dash:"dot"}},
               {x:sample_time,y:sample_time,mode:'markers',name:"", legendgroup:"sample",xaxis:"x2",yaxis:"y",marker:{color:"black"},showlegend:false,text:''},
               {x:qc_time,y:qc_time,mode:'markers',name:"", legendgroup:"qc",xaxis:"x2",yaxis:"y",marker:{color:"red"},showlegend:false,text:0}
               ]

var layout = {
                 xaxis:{
                   range:[0, ooo.e[0].length],
                   domain:[0,0.4842788]
                 },
                 yaxis:{
                   range: [0,100],
                   domain:[0,1.0000000]
                 },
                 xaxis2:{
                   range:[0, ooo.e[0].length],
                   domain:[0.5157212,1.0000000]
                 },
                 title:compound_labels[index]
               }
Plotly.newPlot(scatter_plot, plot_data, layout)
.then(function(){
  var normalize_loop = setInterval(function(){
      if(index==ooo.e.length){
        console.log("!")
        //normalized_data
        // after_plot_pca
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



        $scope.$apply(function(){ctrl.show_save_result = true;ctrl.calculating = false;console.log("done")})
        clearInterval(normalize_loop);
      }else{
              var averages = {}
              for(var batch_i=0;batch_i<batch_index.filter(unique).length;batch_i++){
                var current_batch = batch_index.filter(unique)[batch_i]
                averages[current_batch] = jStat.median(normalized_data_for_each_batch[current_batch][index])
              }
              var global_average = jStat.mean(Object.values(averages))
              var factor = {}
              for(var batch_i=0;batch_i<batch_index.filter(unique).length;batch_i++){
                var current_batch = batch_index.filter(unique)[batch_i]
                var rep_average = Array.apply(null, Array(normalized_data_for_each_batch[current_batch][index].length)).map(Number.prototype.valueOf,averages[current_batch]);
                factor[batch_index.filter(unique)[batch_i]] = rep_average.map(x => x/global_average)
              }
              // after getting the factor, normalize each sample.
              normalized_data = {}

              for(var batch_i=0;batch_i<batch_index.filter(unique).length;batch_i++){
                var current_batch = batch_index.filter(unique)[batch_i]
                normalized_data[current_batch] = _.cloneDeep(normalized_data_for_each_batch[current_batch][index])
              }


              for(var batch_i=0;batch_i<batch_index.filter(unique).length;batch_i++){
                var current_batch = batch_index.filter(unique)[batch_i]
                normalized_data[current_batch] = normalized_data[current_batch].map((x,ii) => x/factor[current_batch][ii])
              }

              final_normalized_data[index] = normalized_data

              normalized_value= flatten(Object.values(normalized_data))
              after_score_plot.push(normalized_value)

              result_normalized_data.push(Object.assign({}, [compound_labels[0]].concat(normalized_value)))

              raw_value = ooo.e[index]


        layout.title =  compound_labels[index]
        layout.yaxis.range = [jStat.min([jStat.min(raw_value), jStat.min(normalized_value)]),jStat.max([jStat.max(raw_value), jStat.max(normalized_value)])]

        //layout.title = label
        Plotly.relayout(scatter_plot,layout)


        Plotly.restyle(scatter_plot, {y:[sample_index.map(x=>ooo.e[index][x]),qc_index.map(x=>ooo.e[index][x]),loess_line_for_each_batch.A[index].concat(loess_line_for_each_batch.B[index], loess_line_for_each_batch.C[index], loess_line_for_each_batch.D[index]),sample_index.map(x=>normalized_value[x]),qc_index.map(x=>normalized_value[x])]},[0,1,2,3,4]).then(
          function(gd)
           {
            Plotly.toImage(gd,{format:'svg', width: 1600, height: 600})
               .then(
                  function(url)
                   {
                     uuu = url
                     uuu = uuu.replace(/^data:image\/svg\+xml,/, '');
                     uuu = decodeURIComponent(uuu);
                     plot_url.push(btoa(unescape(encodeURIComponent(uuu))))
                     $scope.$apply(function(){
                        ctrl.progress = index/ooo.e.length * 100
                      })
                   }
                )
          });
        index++;
      }
    },1)
})

            ctrl.submit_button_text = "Calculate"
          //})

        }

      }, 1000);

      }



      ctrl.download = function(){
        ctrl.download_button_text = "DOWNLOADING"

        oldKeys = Object.keys(result_normalized_data[0])
        keysMap = {}
        newKeys = ["label"].concat(unpack(ooo.p,"label"))
        for(var i=0; i<oldKeys.length;i++){
          keysMap[oldKeys[i]] = gsub(".","_",[newKeys[i]])[0]
        }


    p = new Parallel(result_normalized_data, {maxWorkers:6,env: {
     // e:ooo.e,
      keysMap:keysMap
      },evalPath: 'js/eval.js' });
        p.require('myJS.js')
        p.require('jStat.js')
        p.require('science.v1.min.js')
        p.require('https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js')
        p.map( function (ind) {
          renameKeys = (keysMap, obj) => Object
                      .keys(obj)
                      .reduce((acc, key) => ({
                          ...acc,
                          ...{ [keysMap[key] || key]: obj[key] }
                      }), {});
          var result = []
          result = renameKeys(global.env.keysMap, ind);
          return (result);
        }).then(function(result){
          rr = result



          $scope.$apply(function(){
            ctrl.download_button_text = "DOWNLOAD RESULT"

                var zip = new JSZip();
                var scatter_plots = zip.folder("scatter_plots");
                for(var i=0;i<plot_url.length;i++){
                  scatter_plots.file(i+"th compound.svg", plot_url[i], {base64: true});
                }

                var PCA = zip.folder("PCA");
                for(var i=0;i<Object.keys(pca_plot_url).length;i++){
                  PCA.file(Object.keys(pca_plot_url)[i]+".svg", pca_plot_url[Object.keys(pca_plot_url)[i]], {base64: true});
                }

                zip.file("LOESS Normalized Data.csv", Papa.unparse(result))


                //pca_plot_url

                zip.generateAsync({type:"blob"})
                .then(function (blob) {
                    saveAs(blob, "LOESS Compound Scatter Plots.zip");
                });

            //download_csv(Papa.unparse(result), "LOESS Normalized Data.csv")
          })
        })


      }

	})




/*



    p = new Parallel([0,1,2], {maxWorkers:6,env: {
     // e:ooo.e,
      keysMap:"test"
      },evalPath: 'js/eval.js' });
        p.require('myJS.js')
        p.require('jStat.js')
        p.require('science.v1.min.js')
        p.require('https://cdn.plot.ly/plotly-latest.min.js')


        p.map( function (ind) {
return(3)
        }).then(function(result){r = result})



*/


