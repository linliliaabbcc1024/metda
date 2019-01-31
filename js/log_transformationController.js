angular
    .module('blankapp').controller("log_transformationController", function($scope, $rootScope, Upload, $timeout, $mdToast){
      ctrl = this;
      MathJax.Hub.Queue(["Typeset",MathJax.Hub]);


var lnorm_x=[0.0,0.2,0.4,0.6,0.8,1.0,1.2,1.4,1.6,1.8,2.0,2.2,2.4,2.6,2.8,3.0,3.2,3.4,3.6,3.8,4.0,4.2,4.4,4.6,4.8,5.0,5.2,5.4,5.6,5.8,6.0,6.2,6.4,6.6,6.8,7.0,7.2,7.4,7.6,7.8,8.0,8.2,8.4,8.6,8.8,9.0,9.2,9.4,9.6,9.8,10.0,10.2,10.4,10.6,10.8,11.0,11.2,11.4,11.6,11.8,12.0,12.2,12.4,12.6,12.8,13.0,13.2,13.4,13.6,13.8,14.0,14.2,14.4,14.6,14.8,15.0,15.2,15.4,15.6,15.8,16.0,16.2,16.4,16.6,16.8,17.0,17.2,17.4,17.6,17.8,18.0,18.2,18.4,18.6,18.8,19.0,19.2,19.4,19.6,19.8,20.0,20.2,20.4,20.6,20.8,21.0,21.2,21.4]
var lnorm_counts=[56,120,125,109,77,72,56,51,41,39,32,30,24,19,11,10,13, 9, 8, 6, 9, 7, 5, 4, 2, 3, 4, 3, 2, 2,8, 4, 0, 3, 2, 2, 2, 0, 1, 1, 2, 1, 1, 1, 0, 1, 1, 1, 3, 2, 0, 2, 1, 0, 0, 2, 1, 1, 0, 0,0, 1, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]

var norm_x=[-1.24,-1.22,-1.20,-1.18,-1.16,-1.14,-1.12,-1.10,-1.08,-1.06,-1.04,-1.02,-1.00,-0.98,-0.96,-0.94,-0.92,-0.90,-0.88,-0.86,-0.84,-0.82,-0.80,-0.78,-0.76,-0.74,-0.72,-0.70,-0.68,-0.66,-0.64,-0.62,-0.60,-0.58,-0.56,-0.54,-0.52,-0.50,-0.48,-0.46,-0.44,-0.42,-0.40,-0.38,-0.36,-0.34,-0.32,-0.30,-0.28,-0.26,-0.24,-0.22,-0.20,-0.18,-0.16,-0.14,-0.12,-0.10,-0.08,-0.06,-0.04,-0.02,0.00,0.02,0.04,0.06,0.08,0.10,0.12,0.14,0.16,0.18,0.20,0.22,0.24,0.26,0.28,0.30,0.32,0.34,0.36,0.38,0.40,0.42,0.44,0.46,0.48,0.50,0.52,0.54,0.56,0.58,0.60,0.62,0.64,0.66,0.68,0.70,0.72,0.74,0.76,0.78,0.80,0.82,0.84,0.86,0.88,0.90,0.92,0.94,0.96,0.98,1.00,1.02,1.04,1.06,1.08,1.10,1.12,1.14,1.16,1.18,1.20,1.22,1.24,1.26,1.28,1.30,1.32,1.34]
var norm_counts=[1,1,1,0,0,1,0,1,2,0,2,3,0,3,1,1,2,1,1,3,4,3,4,3,4,7,7,2,8,4,8,11,5,4,5,13,11,13,6,9,9,12,20,9,8,14,15,18,16,13,14,16,15,9,18,23,22,19,11,15,18,18,14,24,20,14,16,16,18,22,13,21,10,19,17,17,16,18,14,17,15,17,11,12,6,9,6,9,12,5,7,5,9,7,6,3,4,2,4,5,4,8,2,5,2,2,1,4,1,2,2,5,3,0,4,0,1,2,1,0,0,1,1,0,0,1,0,0,1]

var lnorm_base=Array(lnorm_x.length).fill(0)
var lnorm_width=Array(lnorm_x.length).fill(0.5)

var norm_base=Array(norm_x.length).fill(0)
var norm_width=Array(norm_x.length).fill(0.5)

var lnorm_norm_data = [{
  x:lnorm_x,
  width:lnorm_width,
  base:lnorm_base,
  orientation:"v",
  y:lnorm_counts,
  type:"bar",
  marker:{
    autocolorscale:false,
    color:"rgba(0,191,196,0.1)",
    line:{
      width:1.89,
      color:"transparent"
    }
  },
  name:"Before",
  showlegend:true,
  xaxis:"x",
  yaxis:"y",
  hoverinfo:"text"
},{
  x:norm_x,
  width:norm_width,
  base:norm_base,
  orientation:"v",
  y:norm_counts,
  type:"bar",
  marker:{
    autocolorscale:false,
    color:"rgba(248,118,109,0.1)",
    line:{
      width:1.89,
      color:"transparent"
    }
  },
  name:"After",
  showlegend:true,
  xaxis:"x",
  yaxis:"y",
  hoverinfo:"text"
}]
var layout = {
  margin:{
    t:35
  },
  plot_bgcolor:"white",
  paper_bgcolor:"white",
  font:{
    color:"rgba(0,0,0,1)",
    family:"Dorid Sans",
    size:15
  },
  xaxis:{
    type:"linear",
    tickfont:{
      color:"black",
      family:"Dorid Sans",
      size:15
    },
    showline:false,
    showgrid:true,
    zeroline:false,
    anchor:'y',
    title:"variable value",
    titlefont:{
      color:"black",
      family:"Dorid Sans",
      size:15
    }
  },
  yaxis:{
    type:"linear",
    tickfont:{
      color:"black",
      family:"Dorid Sans",
      size:15
    },
    showline:false,
    showgrid:true,
    zeroline:false,
    anchor:'x',
    title:"Frequency",
    titlefont:{
      color:"black",
      family:"Dorid Sans",
      size:15
    }
  },
  shapes:[{
    type:"rect",
    fillcolor:null,
    line:{
      color:'black',
      width:1
    },
    xref:'paper',
    yref:'paper',
    x0:0,
    x1:1,
    y0:0,
    y1:1
  }],
  showlegend:true,
  hovermode:"closest",
  barmode:'relative',
  autosize:true,
  title:"Distribution Before/After Log10 Transformaion",
  titlefont:{
    color:'black',
    family:"Dorid Sans",
    size:20
  }
}
//Plotly.newPlot('lognorm', lnorm_norm_data, layout)

      ctrl.select_data_button_text = "Select A Dataset From Database"
      ctrl.upload_data_button_text = "Upload A Dataset"
      ctrl.use_example_data_button_text = "Use The Example Dataset"
      ctrl.submit_button_text = "Calculate"
      ctrl.download_button_text = "Download Result"
      ctrl.save_button_text = "Save Result To Database"
      ctrl.upload_data_from_input_text = "submit"
      ctrl.input_data_button_text = "Upload A Dataset By Copy & Paste"
      ctrl.load_data_from_input_show = false
      ctrl.data_source = null
      ctrl.method_options = ['log10',"log2"]


      var parameters;
      ctrl.make_data_read_here = function(obj){
        make_data_ready(obj)
        parameters = JSON.parse(localStorage.getItem('parameters'));
        ctrl.parameters.method = parameters.log_transformation.method

        $scope.$watch("ctrl.parameters",function(newValue, oldValue){
          parameters.log_transformation.method= ctrl.parameters.method
          localStorage.setItem('parameters', JSON.stringify(parameters));
        },true)

      }


      ctrl.upload_data_from_input = function(){
        ctrl.upload_data_from_input_text = "uploading"
        var req=ocpu.call("upload_data_from_input",{
               txt:document.getElementById("dataset_input").value
             },function(session){
               ctrl.data_source = null
               sss = session
               session.getObject(function(obj){
                 ooo = obj
                 ctrl.make_data_read_here(obj)
                 $scope.$apply()
               })
             }).done(function(){
               console.log("Data read from the textarea.")
             }).fail(function(){
               alert("Error: " + req.responseText)
             }).always(function(){
               ctrl.upload_data_from_input_text = "submit"
             })
      }

      ctrl.load_data_from_database = function(module){
        mainctrl.the_waiting_module = module
        mainctrl.toggleLeft('right',true)
      }

      ctrl.uploadFiles = function(file, errFiles) {
          ctrl.f = file;
          ctrl.errFile = errFiles && errFiles[0];
          if (file) {
            ctrl.upload_data_button_text = 'uploading'
            console.log(file)
             var req=ocpu.call("upload_dataset",{
               path:file
             },function(session){
               sss = session
               session.getObject(function(obj){
                 ctrl.data_source = null
                 ooo = obj
                 ctrl.make_data_read_here(obj)
                 $scope.$apply();
               })
             }).done(function(){
               $scope.$apply(function(){file.progress = 100;})
             }).fail(function(){
               alert("Error: " + req.responseText)
             }).always(function(){
               ctrl.upload_data_button_text = "Upload A Dataset"
             });

          }
      }

      ctrl.submit = function(){
        ctrl.submit_button_text = "Calculating"
        var req = ocpu.call("log_transformation",ctrl.parameters,function(session){
          sss = session
          session.getObject(function(obj){
            oo = obj
            ctrl.report = oo.report_html[0]
            var dataSet = oo.data_matrix
           if(typeof(result_DataTable)!=='undefined'){
             result_DataTable.destroy();
             $('#'+'result_datatable').empty();
           }
           result_DataTable = $('#result_datatable').DataTable({
              data: dataSet,
              columns: oo.data_matrix[0].map(function(x, index){return {title:""}}),
              "ordering": false,
              "scrollX": true,
               "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]]
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
        /*var zip = new JSZip();
        for(var i=0;i<Object.keys(plot_url).length;i++){
          zip.file(Object.keys(plot_url)[i]+".svg", Object.values(plot_url)[i], {base64: true});
        }
        zip.file("Log Tranformed Data.csv", Papa.unparse(oo.result))
        zip.generateAsync({type:"blob"})
        .then(function (blob) {
            saveAs(blob, "Log Transformation Results.zip");
        });*/

        download_csv(Papa.unparse(oo.data_matrix), ctrl.parameters.method+" Transformed Dataset.csv")
      }


      ctrl.save_result = function(){
        // trying to save result. The result must be in a form of [{},{},{}], which is a folder of the tree. In one of the {}, there is a main key indicating that this is the folder node. If the main is not found, then everything will be added to the user clicked node. For all the nodes that are not folder node, must have 'saving_content' and 'content_type' for adding the attachments. Also, these nodes's parent is to be determined by the user click.
        // !!!! modify what to save in the database.
        var time_stamp = get_time_string()
    to_be_saved_parameters = _.clone(ctrl.parameters)
    to_be_saved_parameters.e = null
    to_be_saved_parameters.f = null
    to_be_saved_parameters.p = null
        var to_be_saved =
        [{
          "id":"log_transformation_dataset_"+time_stamp,
          "parent":undefined,
          "text":"Log Transformation",
          "icon":"fa fa-folder",
          "main":true,
          "analysis_type":"log_transformation",
          "parameters":to_be_saved_parameters
        },{
          "id":"log_transformation_dataset_"+time_stamp+".csv",
          "parent":"log_transformation_dataset_"+time_stamp,
          "text":"Log Transformation.csv",
          "icon":"fa fa-file-excel-o",
          "attachment_id":"log_transformation_dataset_"+time_stamp+".csv",
          "saving_content":btoa(unescape(encodeURIComponent(Papa.unparse(oo.data_matrix)))),
          "content_type":"application/vnd.ms-excel",
          "efp":true
        }]

        mainctrl.save_result_modal(to_be_saved)

      }

	})






























