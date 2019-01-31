angular
    .module('blankapp').controller("outlier_treatmentController", function($scope, $rootScope, $timeout, $mdToast){
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

      ctrl.method_options = ['median','mean','max/min']

      // !!!! add other ctrl initials.
      var parameters;
      ctrl.make_data_read_here = function(obj){
        make_data_ready(obj)
        // !!!! make all the parameters ready here.
        parameters = JSON.parse(localStorage.getItem('parameters'));
        ctrl.parameters.auto = parameters.outlier_treatment.auto
        ctrl.parameters.criterion = parameters.outlier_treatment.criterion
        ctrl.parameters.method = parameters.outlier_treatment.method

        ctrl.column_options = Object.keys(ooo.p[0])
        ctrl.parameters.column = ctrl.column_options.includes(parameters.outlier_treatment.column)?parameters.outlier_treatment.column:ctrl.column_options[0]

        $scope.$watch("ctrl.parameters",function(newValue, oldValue){
          parameters.outlier_treatment.column = ctrl.parameters.column
          parameters.outlier_treatment.auto = ctrl.parameters.auto
          parameters.outlier_treatment.criterion = ctrl.parameters.criterion
          parameters.outlier_treatment.method = ctrl.parameters.method
          localStorage.setItem('parameters', JSON.stringify(parameters));
        },true)

        $scope.$watch("ctrl.parameters.column",function(newValue,oldValue){
          ctrl.level_options = unpack(ooo.p, ctrl.parameters.column).filter(unique)
          ctrl.parameters.level = ctrl.level_options[0]
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

        var req = ocpu.call("outlier_treatment_fun",ctrl.parameters,function(session){
          sss = session
          session.getObject(function(obj){
            oo = obj
            ctrl.report = oo.report_html[0]

            // !!!! modify how to display the results.

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
        var time_stamp = get_time_string()
        // !!!! modify how to download the results.

        /*var zip = new JSZip();
        for(var i=0;i<Object.keys(plot_url).length;i++){
          zip.file(Object.keys(plot_url)[i]+".svg", Object.values(plot_url)[i], {base64: true});
        }

        zip.generateAsync({type:"blob"})
        .then(function (blob) {
            saveAs(blob, "Outlier Treatment - Plots.zip");
        });*/

        download_csv(Papa.unparse(oo.data_matrix), "Outlier Treatment "+time_stamp+".csv")
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
          "id":"outlier_treatment_dataset_"+time_stamp,
          "parent":undefined,
          "text":"Outlier Treatment",
          "icon":"fa fa-folder",
          "main":true,
          "analysis_type":"outlier_treatment",
          "parameters":to_be_saved_parameters
        },{
          "id":"outlier_treatment_dataset_"+time_stamp+".csv",
          "parent":"outlier_treatment_dataset_"+time_stamp,
          "text":"Outlier Treatment.csv",
          "icon":"fa fa-file-excel-o",
          "attachment_id":"outlier_treatment_dataset_"+time_stamp+".csv",
          "saving_content":btoa(unescape(encodeURIComponent(Papa.unparse(oo.data_matrix)))),
          "content_type":"application/vnd.ms-excel"
        },{
          "id":"outlier_treatment_flag_"+time_stamp+".csv",
          "parent":"outlier_treatment_dataset_"+time_stamp,
          "text":"Outlier flag.csv",
          "icon":"fa fa-file-excel-o",
          "attachment_id":"outlier_treatment_flag_"+time_stamp+".csv",
          "saving_content":btoa(unescape(encodeURIComponent(Papa.unparse(oo.data_out)))),
          "content_type":"application/vnd.ms-excel"
        }]

        mainctrl.save_result_modal(to_be_saved)

      }
	})






























