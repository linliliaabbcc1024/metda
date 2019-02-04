angular
.module('blankapp').controller("fdr_correctionController", function($scope, $rootScope, $timeout, $mdToast){
  ctrl = this;
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

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
  ctrl.FDR_options = FDR_options

  var parameters;
  ctrl.make_data_read_here = function(obj){
    make_data_ready(obj)
    parameters = JSON.parse(localStorage.getItem('parameters'));
    ctrl.parameters.FDR = parameters.FDR
    ctrl.column_options = unpack(ooo.p,'label')
    ctrl.parameters.column = ctrl.column_options.includes(parameters.fdr_correction.column)?parameters.fdr_correction.column:ctrl.column_options[0]

    $scope.$watch("ctrl.parameters",function(newValue, oldValue){
      parameters.FDR = ctrl.parameters.FDR
      parameters.fdr_correction.column = ctrl.parameters.column
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
        ctrl.upload_data_button_text = 'uploading'
        // when user simply upload a dataset,create a temp project.
        var project_db = new PouchDB('https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/project');
        var time_stamp = get_time_string()
        var temp_project_id = "temp"+time_stamp
        var new_project = {
          _id:temp_project_id
        }
        project_db.put(new_project).then(function(doc){
          ctrl.f = file;
          ctrl.errFile = errFiles && errFiles[0];
          if (file) {
            console.log(file)
             var req=ocpu.call("upload_dataset",{
               path:file,
               project_id:temp_project_id
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
        })


      }



  ctrl.submit = function(){

    ctrl.submit_button_text = "Calculating"
    ctrl.parameters.fun_name = "fdr_correction_fun"
    var req = ocpu.call("call_fun",{parameters:ctrl.parameters},function(session){
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
          "scrollX": false,
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
    var time_stamp = get_time_string()
    // !!!! modify how to download the results.

    /*var zip = new JSZip();
    for(var i=0;i<Object.keys(plot_url).length;i++){
      zip.file(Object.keys(plot_url)[i]+".svg", Object.values(plot_url)[i], {base64: true});
    }

    zip.generateAsync({type:"blob"})
    .then(function (blob) {
      saveAs(blob, "FDR Correction - Plots.zip");
    });*/

      download_csv(Papa.unparse(oo.result), "FDR Correction"+time_stamp+".csv")
  }

  ctrl.save_result = function(){
    // trying to save result. The result must be in a form of [{},{},{}], which is a folder of the tree. In one of the {}, there is a main key indicating that this is the folder node. If the main is not found, then everything will be added to the user clicked node. For all the nodes that are not folder node, must have 'saving_content' and 'content_type' for adding the attachments. Also, these nodes's parent is to be determined by the user click.
    // !!!! modify what to save in the database.
    to_be_saved_parameters = _.clone(ctrl.parameters)
    to_be_saved_parameters.e = null
    to_be_saved_parameters.f = null
    to_be_saved_parameters.p = null
    var time_stamp = get_time_string()
    var to_be_saved =
    [{
          "id":"fdr_correction_result_"+time_stamp,
          "parent":undefined,
          "text":"FDR Correction",
          "icon":"fa fa-folder",
          "main":true,
          "analysis_type":"fdr_correction",
          "parameters":to_be_saved_parameters
        },{
    "id":"fdr_correction_result_"+time_stamp+".csv",
    "parent":"fdr_correction_result_"+time_stamp,
    "text":"FDR Correction result.csv",
    "icon":"fa fa-file-excel-o",
    "attachment_id":"fdr_correction_dataset_"+time_stamp+".csv",
    "saving_content":btoa(unescape(encodeURIComponent(Papa.unparse(oo.result)))),
    "content_type":"application/vnd.ms-excel"
    }]

    mainctrl.save_result_modal(to_be_saved)

  }
})






























