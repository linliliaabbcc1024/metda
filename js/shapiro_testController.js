angular
    .module('blankapp').controller("shapiro_testController", function($scope, $rootScope, Upload, $timeout, $mdToast){
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
             var req=ocpu.call("upload_shapiro_test_dataset",{
               path:file
             },function(session){
               sss = session
               session.getObject(function(obj){
                 ooo = obj
                 var dataSet = ooo.data_matrix

                 if(typeof(preview_DataTable)!=='undefined'){
                   preview_DataTable.destroy();
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
                 ctrl.parameters.groups = ctrl.groups_options[ctrl.groups_options.length-1]
                 $scope.$watch("ctrl.parameters.groups", function(newValue, oldValue){

                  ctrl.levels_options = unpack(ooo.p,ctrl.parameters.groups).filter(unique)
                  ctrl.parameters.levels = unpack(ooo.p,ctrl.parameters.groups).filter(unique)

                 })


                 ctrl.FDR_options = FDR_options
                 ctrl.parameters.FDR = 'fdr'
                 ctrl.parameters.QQ = false
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

        var req = ocpu.call("shapiro_test",ctrl.parameters,function(session){
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
        download_csv(Papa.unparse(oo.result), "Shapiro-Wilk Normality test Result.csv")
        if(ctrl.parameters.QQ){
          console.log("!")
          window.open(sss.loc+"files/Q-Q plots.zip");
        }
      }

	})






























