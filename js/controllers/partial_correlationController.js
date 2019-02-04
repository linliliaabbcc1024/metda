angular
    .module('blankapp').controller("partial_correlationController", function($scope, $rootScope, $timeout, $mdToast){
      ctrl = this;
      MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

      ctrl.select_data_button_text = "Select The First Dataset From Database"
      ctrl.upload_data_button_text = "Upload The First Dataset"
      ctrl.use_example_data_button_text = "Use The Example Dataset"

      ctrl.select_data_button_text2 = "Select The Second Dataset From Database"
      ctrl.upload_data_button_text2 = "Upload The Second Dataset"
      ctrl.use_example_data_button_text2 = "Use The Example Dataset"


      ctrl.submit_button_text = "Calculate"
      ctrl.download_button_text = "Download Result"
      ctrl.save_button_text = "Save Result To Database"
      ctrl.upload_data_from_input_text = "submit first dataset"
      ctrl.upload_data_from_input_text2 = "submit second dataset"
      ctrl.input_data_button_text = "Upload The First Dataset By Copy & Paste"
      ctrl.input_data_button_text2 = "Upload The Second By Copy & Paste"
      ctrl.load_data_from_input_show = false
      ctrl.load_data_from_input_show2 = false
      ctrl.data_source = null

      // !!!! add other ctrl initials.
      ctrl.method_options = ['spearman','pearson']


      var parameters;
      ctrl.make_data_read_here = function(obj){
        make_data_ready(obj)
        // !!!! make all the parameters ready here.

      }
      ctrl.make_data_read_here2 = function(obj){
        make_data_ready2(obj)
        ctrl.confounder_column_options = unpack(ooo2.f,"label")
        // !!!! make all the parameters ready here.
        parameters = JSON.parse(localStorage.getItem('parameters'));
        ctrl.parameters.method = parameters.partial_correlation.method
        ctrl.parameters.confounder_column = parameters.partial_correlation.confounder_column

        $scope.$watch("ctrl.parameters",function(newValue, oldValue){
          parameters.partial_correlation.method = ctrl.parameters.method
          parameters.partial_correlation.confounder_column = ctrl.parameters.confounder_column
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
               ctrl.upload_data_from_input_text = "submit first dataset"
             })
      }


      ctrl.upload_data_from_input2 = function(){
        ctrl.upload_data_from_input_text2 = "uploading"
        var req=ocpu.call("upload_data_from_input",{
               txt:document.getElementById("dataset_input2").value
             },function(session){
               ctrl.data_source = null
               sss = session
               session.getObject(function(obj){
                 ooo2 = obj
                 ctrl.make_data_read_here2(obj)
                 $scope.$apply()
               })
             }).done(function(){
               console.log("Data read from the textarea.")
             }).fail(function(){
               alert("Error: " + req.responseText)
             }).always(function(){
               ctrl.upload_data_from_input_text2 = "submit second dataset"
             })
      }

      ctrl.load_data_from_database = function(module){
        mainctrl.the_waiting_module = module
        mainctrl.toggleLeft('right',true)
      }

      ctrl.load_data_from_database2 = function(module){
        mainctrl.the_waiting_module = module
        mainctrl.toggleLeft('right',true,"",2)
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


      ctrl.uploadFiles2 = function(file, errFiles) {
        ctrl.upload_data_button_text2 = 'uploading'
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
                 ooo2 = obj
                 ctrl.make_data_read_here2(obj)
                 $scope.$apply();
               })
             }).done(function(){
               $scope.$apply(function(){file.progress = 100;})
             }).fail(function(){
               alert("Error: " + req.responseText)
             }).always(function(){
               ctrl.upload_data_button_text2 = "Upload A Dataset"
             });

          }
        })


      }


      ctrl.submit = function(){
        ctrl.submit_button_text = "Calculating"
ctrl.parameters.fun_name = "partial_correlation_fun"
        var req = ocpu.call("call_fun",{parameters:ctrl.parameters},function(session){
          sss = session
          session.getObject(function(obj){
            oo = obj;
            ctrl.report = oo.report_html[0]
            // !!!! modify how to display the results.
           var dataSet = oo.data_matrix.map(x => Object.values(x))
           if(typeof(result_DataTable)!=='undefined'){
             result_DataTable.destroy();
             $('#'+'result_datatable').empty();
           }
           result_DataTable = $('#result_datatable').DataTable({
              data: dataSet,
              columns: Object.keys(oo.data_matrix[0]).map(function(x, index){return {title:x}}),
              "ordering": false,
              "scrollX": true,
               "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]]
           });
           var dataSet2 = oo.data_matrix2.map(x => Object.values(x))
           if(typeof(result_DataTable2)!=='undefined'){
             result_DataTable2.destroy();
             $('#'+'result_datatable2').empty();
           }
           result_DataTable2 = $('#result_datatable2').DataTable({
              data: dataSet2,
              columns: Object.keys(oo.data_matrix2[0]).map(function(x, index){return {title:x}}),
              "ordering": false,
              "scrollX": true,
               "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]]
           });
           ctrl.submit_button_text = "Calculate"
           console.log(ctrl.submit_button_text)
           $scope.$apply();
          })
        }).done(function(){
          console.log("Calculation done.")
        }).fail(function(){
          alert("Error: " + req.responseText)
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
            saveAs(blob, "partial_correlations - Plots.zip");
        });*/

        var zip = new JSZip();
        zip.file("Partial Correlations "+time_stamp+".csv", Papa.unparse(oo.data_matrix))
        zip.file("Partial Correlations "+time_stamp+".csv", Papa.unparse(oo.data_matrix2))
        zip.generateAsync({type:"blob"})
        .then(function (blob) {
            saveAs(blob, "Partial Correlation Analysis.zip");
        });


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
          "id":"partial_correlation_dataset_"+time_stamp,
          "parent":undefined,
          "text":"Partial Correlations Analysis",
          "icon":"fa fa-folder",
          "main":true,
          "analysis_type":"partial_correlation",
          "parameters":to_be_saved_parameters
        },{
          "id":"partial_correlation_dataset_"+time_stamp+".csv",
          "parent":"partial_correlation_dataset_"+time_stamp,
          "text":"Partial Correlation Coefficient.csv",
          "icon":"fa fa-file-excel-o",
          "attachment_id":"partial_correlation_dataset_"+time_stamp+".csv",
          "saving_content":btoa(unescape(encodeURIComponent(Papa.unparse(oo.data_matrix)))),
          "content_type":"application/vnd.ms-excel"
        },{
          "id":"partial_correlation_dataset2_"+time_stamp+".csv",
          "parent":"partial_correlation_dataset_"+time_stamp,
          "text":"Partial Correlation p values.csv",
          "icon":"fa fa-file-excel-o",
          "attachment_id":"partial_correlation_dataset2_"+time_stamp+".csv",
          "saving_content":btoa(unescape(encodeURIComponent(Papa.unparse(oo.data_matrix2)))),
          "content_type":"application/vnd.ms-excel"
        }]

        mainctrl.save_result_modal(to_be_saved)

      }
	})






























