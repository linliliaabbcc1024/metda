angular
    .module('blankapp').controller("rm_0_sdController", function($scope, $rootScope, $timeout, $mdToast){
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

      // !!!! add other ctrl initials.

      //var parameters;
      ctrl.make_data_read_here = function(obj){
        make_data_ready(obj)
        // !!!! make all the parameters ready here.
        /*parameters = JSON.parse(localStorage.getItem('parameters'));

        ctrl.parameters.by_group = parameters.rm_0_sd.by_group
        ctrl.column_options = delete_element_from_array(Object.keys(ooo.p[0]),'label')
        ctrl.parameters.column = ctrl.column_options.includes(parameters.rm_0_sd.column)?parameters.rm_0_sd.column:ctrl.column_options[0]

        $scope.$watch("ctrl.parameters",function(newValue, oldValue){
          console.log("!")
          parameters.rm_0_sd.by_group = ctrl.parameters.by_group
          parameters.rm_0_sd.column = ctrl.parameters.column
          localStorage.setItem('parameters', JSON.stringify(parameters));
        },true)*/

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
ctrl.parameters.fun_name = "rm_0_sd_fun"
        var req = ocpu.call("call_fun",{parameters:ctrl.parameters},function(session){
          sss = session
          session.getObject(function(obj){
            oo = obj
            ctrl.report = oo.report_html[0]

            // !!!! modify how to display the results.

           var dataSet = oo.sds.map(x => Object.values(x))
           if(typeof(result_DataTable)!=='undefined'){
             result_DataTable.destroy();
             $('#'+'result_datatable').empty();
           }
           result_DataTable = $('#result_datatable').DataTable({
              data: dataSet,
              columns: Object.keys(oo.sds[0]).map(function(x){return({title:x})}),
              "ordering": true,
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
            saveAs(blob, "remove zero standard deviation compound - Plots.zip");
        });*/

        download_csv(Papa.unparse(oo.data_matrix), "remove zero standard deviation compound "+time_stamp+".csv")
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
          "id":"rm_0_sd_dataset_"+time_stamp,
          "parent":undefined,
          "text":"no zero standard deviation compound.csv",
          "icon":"fa fa-folder",
          "main":true,
          "analysis_type":"rm_0_sd",
          "parameters":to_be_saved_parameters
        },{
          "id":"rm_0_sd_dataset_"+time_stamp+".csv",
          "parent":"rm_0_sd_dataset_"+time_stamp,
          "text":"remove zero standard deviation compound.csv",
          "icon":"fa fa-file-excel-o",
          "attachment_id":"rm_0_sd_dataset_"+time_stamp+".csv",
          "saving_content":btoa(unescape(encodeURIComponent(Papa.unparse(oo.result)))),
          "content_type":"application/vnd.ms-excel"
        },{
          "id":"rm_0_sd_sd_"+time_stamp+".csv",
          "parent":"rm_0_sd_dataset_"+time_stamp,
          "text":"Compound Standard Deviations.csv",
          "icon":"fa fa-file-excel-o",
          "attachment_id":"rm_0_sd_sd_"+time_stamp+".csv",
          "saving_content":btoa(unescape(encodeURIComponent(Papa.unparse(oo.sds)))),
          "content_type":"application/vnd.ms-excel"
        }]

        mainctrl.save_result_modal(to_be_saved)

      }
	})






























