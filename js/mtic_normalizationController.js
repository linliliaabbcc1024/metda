angular
    .module('blankapp').controller("mtic_normalizationController", function($scope, $rootScope, Upload, $timeout, $mdToast){
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
            console.log(file)
             var req=ocpu.call("upload_mtic_normalization",{
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

                 ctrl.column_options = [Object.keys(ooo.f[0])[1]]
                 ctrl.parameters.column = Object.keys(ooo.f[0])[1]

                 $scope.$watch("ctrl.parameters.column", function(newValue, oldValue){
                   ctrl.level_options = unpack(ooo.f, ctrl.parameters.column).filter(unique)
                   ctrl.parameters.level = ctrl.level_options[0]
                 })

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
        ctrl.submit_button_text = "Calculating"

        var req = ocpu.call("mtic_normalization",ctrl.parameters,function(session){
          sss = session
          session.getObject(function(obj){
            oo = obj
            ctrl.report = oo.report_html[0]

           var dataSet = oo.result.map(x => Object.values(x))
           if(typeof(result_DataTable)!=='undefined'){
             result_DataTable.destroy();
           }
           result_DataTable = $('#result_datatable').DataTable({
              data: dataSet,
              columns: Object.keys(oo.result[0]).map(function(x){return({title:x})}),
              "ordering": true,
              "scrollX": true,
               "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]]
           });

           // draw
           plot_url = {}
           var compound_labels = unpack(ooo.f, "label")
           var sample_labels = unpack(ooo.p, "label")
           /*dta = oo.result
           intensity_for_each_sample_plot = function(dta){
             var sample_label = Object.keys(dta[0])
             sample_label.shift()
             var colors_index = Array.apply(null, {length: sample_label.length}).map(Number.call, Number)
             var colors_perc = colors_index.map(x => x/sample_label.length*100*3.6)
             var rainbow_colors = colors_perc.map(x => tinycolor("hsv("+x+" 100% 100%)"))
             var reds = unpack(rainbow_colors, "_r")
             var greens = unpack(rainbow_colors, "_g")
             var blues = unpack(rainbow_colors, "_b")
             var alphas = unpack(rainbow_colors, "_a")

             var data = []
             for(var i=0; i<sample_label.length;i++){
               var y = unpack(dta,sample_label[i])
               data.push({
                 x:Array(sample_label.length).fill(i),
                 y:y,
                 hoverinfo:"text",
                 text:"sample label: "+sample_label[i]+"<br>mean: "+jStat.mean(y)+"<br>median: "+jStat.median(y)+"<br>stdev: "+jStat.stdev(y),
                 type:"box",
                 fillcolor:"rgba("+reds[i]+","+greens[i]+","+blues[i]+","+alphas[i]+")",
                 marker:{
                   outliercolor:"rgba(0,0,0,1)",
                   line:{
                     width:1.5,
                     color:"rgba(0,0,0,1)"
                   },
                   size:5
                 },
                line:{
                  color:"rgba(51,51,51,1)",
                  width:1.5
                },
                name:sample_label[i],
                showlegend:false,
                xaxis:"x",
                yaxis:"y"
               })
             }
             var layout = {
               margin:{
                 t:40.27294,
                 r:17.305936,
                 b:64.22727,
                 l:47.26027
               },
               plot_bgcolor:"rgba(255,255,255,1)",
               paper_bgcolor:"rgba(255,255,255,1)",
               font:{
                 color:"rgba(0,0,0,1)",
                 family:"Dorid Sans",
                 size:15
               },
               xaxis:{
                 type:"linear",
                 autorange:true,
                 ticktext:sample_label,
                 tickvals:Array.apply(null, {length: sample_label.length}).map(Number.call, Number),
                 categoryorder:"array",
                 categoryarray:sample_label,
                 tickcolor:"rgba(0,0,0,1)",
                 tickfont:{
                   color:"rgba(0,0,0,1)",
                   family:"Dorid Sans",
                   size:12
                 },
                 tickangle:90,
                 showline:true,
                 showgrid:true,
                 anchor:"y",
                 title:"Sample Labels",
                 titlefont:{
                   family:"Dorid Sans",
                   size:15
                 }
               },
               yaxis:{
                 type:"log",
                 autorange:true,
                 tickcolor:"rgba(0,0,0,1)",
                 tickfont:{
                   color:"rgba(0,0,0,1)",
                   family:"Dorid Sans",
                   size:12
                 },
                 tickangle:90,
                 showline:true,
                 showgrid:true,
                 anchor:"x",
                 title:"Log (Intensity)",
                 titlefont:{
                   family:"Dorid Sans",
                   size:15
                 }
               },
               shapes:[
                 {
                   type:"rect",
                   fillcolor:"transparent",
                   line:{
                     color:"rgba(0,0,0,1)",
                     width:1,
                     linetype:"solid"
                   },
                     yref:"paper",
                     xref:"paper",
                     x0:0,x1:1,y0:0,y1:1
                 }
               ],
               showlegend:false,
               hovermode:"closest",
               barmode:"relative",
               titlefont:{
                 family:"Dorid Sans",
                 size:20,
                 color:"rgba(0,0,0,1)"
               }
             }

             return({data:data, layout:layout})
           }*/
           after_plot = intensity_for_each_sample_plot(oo.result)
           after_plot.layout.title = "<b>Intensity After mTIC Normalization</b>"
           Plotly.newPlot('after', after_plot.data, after_plot.layout).then(function(gd){
              Plotly.toImage(gd,{format:'svg'})
              .then(
                function(url)
                 {
                   uuu = url
                   uuu = uuu.replace(/^data:image\/svg\+xml,/, '');
                   uuu = decodeURIComponent(uuu);
                   plot_url.after_mTIC_plot = btoa(unescape(encodeURIComponent(uuu)))
                 }
             )
            });


           before_object = []
           for(var i=0;i<ooo.e.length;i++){
            var temp_obj = {}
            temp_obj.label = gsub(".","_",[compound_labels[i]])[0]

            for(var j=0;j<sample_labels.length;j++){
              temp_obj[gsub(".","_",[sample_labels[j]])[0]] = ooo.e[i][j]
            }
            before_object.push(temp_obj)
          }
          before_plot = intensity_for_each_sample_plot(before_object)
          before_plot.layout.title = "<b>Intensity Before mTIC Normalization</b>"
          Plotly.newPlot('before', before_plot.data, before_plot.layout).then(function(gd){
            Plotly.toImage(gd,{format:'svg'})
            .then(
              function(url)
               {
                 uuu = url
                 uuu = uuu.replace(/^data:image\/svg\+xml,/, '');
                 uuu = decodeURIComponent(uuu);
                 plot_url.before_mTIC_plot = btoa(unescape(encodeURIComponent(uuu)))
               }
           )
          });

           $scope.$apply();
          })
        }).done(function(){
          console.log("Calculation done.")
        }).fail(function(){
          alert("Error: " + req.responseText)
        }).always(function(){
          $scope.$apply(function(){ctrl.submit_button_text = "Calculate"})
        });
      }


      ctrl.download = function(){
        var zip = new JSZip();
        for(var i=0;i<Object.keys(plot_url).length;i++){
          zip.file(Object.keys(plot_url)[i]+".svg", Object.values(plot_url)[i], {base64: true});
        }
        zip.file("mTIC Normalized Data.csv", Papa.unparse(oo.result))
        zip.generateAsync({type:"blob"})
        .then(function (blob) {
            saveAs(blob, "mTIC Normalization Results.zip");
        });
      }

	})






























