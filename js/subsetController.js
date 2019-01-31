angular
    .module('blankapp').controller("subsetController", function($scope, $rootScope, Upload, $timeout, $mdToast){
      ctrl = this;
      MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

      ctrl.select_data_button_text = "Select A Dataset From Database"
      ctrl.upload_data_button_text = "Upload A Dataset"
      ctrl.use_example_data_button_text = "Use The Example Dataset"
      ctrl.submit_button_text = "Subset"
      ctrl.download_button_text = "Download Result"
      ctrl.save_button_text = "Save Result To Database"
      ctrl.upload_data_from_input_text = "submit"
      ctrl.input_data_button_text = "Upload A Dataset By Copy & Paste"
      ctrl.load_data_from_input_show = false
      ctrl.data_source = null

      ctrl.make_data_read_here = function(obj){

        make_data_ready(obj)
        ctrl.sample_criterion_options = Object.keys(ooo.p[0])
        // these following variables are for ng-init for each input-container. However, the dynamic ng-init does not work. Things are kept here but the html files are deleted. !!
        ctrl.sample_level_options = {}
        for(var i=0; i<ctrl.sample_criterion_options.length;i++){
          ctrl.sample_level_options[ctrl.sample_criterion_options[i]] = unpack(ctrl.parameters.p,ctrl.sample_criterion_options[i]).filter(unique)
        }
        ctrl.sample_mins = {};ctrl.sample_maxs = {}
        for(var i=0; i<ctrl.sample_criterion_options.length;i++){
          ctrl.sample_mins[ctrl.sample_criterion_options[i]] = Number(jStat.min(unpack(ctrl.parameters.p,ctrl.sample_criterion_options[i])))
          ctrl.sample_maxs[ctrl.sample_criterion_options[i]] = Number(jStat.max(unpack(ctrl.parameters.p,ctrl.sample_criterion_options[i])))
        }
        ctrl.parameters.sample_criterions = []
        /*ctrl.sample_criterions = [{
          column:ctrl.sample_criterion_options[0],
          type:'character',
          level_options:unpack(ooo.p,ctrl.sample_criterion_options[0]).filter(unique),
          criterion:unpack(ooo.p,ctrl.sample_criterion_options[0]).filter(unique)
        }]*/


        ctrl.add_sample_criterion = function(){
          ctrl.parameters.sample_criterions.push({
            column:ctrl.sample_criterion_options[0],
            type:'character',
            criterion:[]
          })
        }

        ctrl.remove_sample_criterion = function(){
          ctrl.parameters.sample_criterions.pop()
        }


        ctrl.compound_criterion_options = Object.keys(ooo.f[0])
        // these following variables are for ng-init for each input-container. However, the dynamic ng-init does not work. Things are kept here but the html files are deleted. !!
        ctrl.compound_level_options = {}
        for(var i=0; i<ctrl.compound_criterion_options.length;i++){
          ctrl.compound_level_options[ctrl.compound_criterion_options[i]] = unpack(ctrl.parameters.f,ctrl.compound_criterion_options[i]).filter(unique)
        }
        ctrl.compound_mins = {};ctrl.compound_maxs = {}
        for(var i=0; i<ctrl.compound_criterion_options.length;i++){
          ctrl.compound_mins[ctrl.compound_criterion_options[i]] = Number(jStat.min(unpack(ctrl.parameters.f,ctrl.compound_criterion_options[i])))
          ctrl.compound_maxs[ctrl.compound_criterion_options[i]] = Number(jStat.max(unpack(ctrl.parameters.f,ctrl.compound_criterion_options[i])))
        }
        ctrl.parameters.compound_criterions = []
        /*ctrl.compound_criterions = [{
          column:ctrl.compound_criterion_options[0],
          type:'character',
          level_options:unpack(ooo.f,ctrl.compound_criterion_options[0]).filter(unique),
          criterion:unpack(ooo.f,ctrl.compound_criterion_options[0]).filter(unique)
        }]*/


        ctrl.add_compound_criterion = function(){
          ctrl.parameters.compound_criterions.push({
            column:ctrl.compound_criterion_options[0],
            type:'character',
            criterion:[]
          })
        }

        ctrl.remove_compound_criterion = function(){
          ctrl.parameters.compound_criterions.pop()
        }

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
             var req=ocpu.call("upload_subset_dataset",{
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
        if(ctrl.parameters.compound_criterions.length===0 && ctrl.parameters.sample_criterions.length===0){
          alert("You didn't select any sample or compound criterion. Please click the '+' to specify at least one criterion to subset your dataset.")
          return false;
        }
        ctrl.submit_button_text = "Subsetting"

        var req = ocpu.call("subset_fun",ctrl.parameters,function(session){
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


           ctrl.report = "<b>The original dataset contains " + ooo.p.length  + " samples and " +ooo.f.length+ " compounds. Then the dataset was subset according to "

           if(ctrl.parameters.sample_criterions.length > 0){
               ctrl.report = ctrl.report + "samples"
             for(var i=0; i<ctrl.parameters.sample_criterions.length;i++){
               if(ctrl.parameters.sample_criterions[i].type === 'character'){
                 ctrl.report = ctrl.report + " <code> "+ ctrl.parameters.sample_criterions[i].column+ " ("+ctrl.parameters.sample_criterions[i].criterion.join(", ")+")</code>"
               }else{
                 ctrl.report = ctrl.report + " <code> "+ ctrl.parameters.sample_criterions[i].column+ " ( between "+ctrl.parameters.sample_criterions[i].criterion.join(" and ")+")</code>"
               }
               if(i!==(ctrl.parameters.sample_criterions.length-1)){
                 ctrl.report = ctrl.report + ", "
               }
             }
             if(ctrl.parameters.compound_criterions.length > 0){
               ctrl.report = ctrl.report + " and "
             }
           }
           if(ctrl.parameters.compound_criterions.length > 0){
               ctrl.report = ctrl.report + "compounds"
             for(var i=0; i<ctrl.parameters.compound_criterions.length;i++){
               if(ctrl.parameters.compound_criterions[i].type === 'character'){
                 ctrl.report = ctrl.report + " <code> "+ ctrl.parameters.compound_criterions[i].column+ " ("+ctrl.parameters.compound_criterions[i].criterion.join(", ")+")</code>"
               }else{
                 ctrl.report = ctrl.report + " <code> "+ ctrl.parameters.compound_criterions[i].column+ " ( between "+ctrl.parameters.compound_criterions[i].criterion.join(" and ")+")</code>"
               }
               if(i!==(ctrl.parameters.compound_criterions.length-1)){
                 ctrl.report = ctrl.report + ", "
               }
             }
           }
           ctrl.report  = ctrl.report + ". The subset dataset contains " +oo.p.length+ " samples and "+oo.f.length+" compounds.</b>"
           $scope.$apply();
          })
        }).done(function(){
          console.log("Calculation done.")
        }).fail(function(){
          alert("Error: " + req.responseText)
        }).always(function(){
          $scope.$apply(function(){ctrl.submit_button_text = "Subset"})
        });
      }


      ctrl.download = function(){
        var time_stamp = get_time_string()
        /*var zip = new JSZip();
        for(var i=0;i<Object.keys(plot_url).length;i++){
          zip.file(Object.keys(plot_url)[i]+".svg", Object.values(plot_url)[i], {base64: true});
        }
        zip.file("mTIC Normalized Data.csv", Papa.unparse(oo.result))
        zip.generateAsync({type:"blob"})
        .then(function (blob) {
            saveAs(blob, "mTIC Normalization Results.zip");
        });*/

        download_csv(Papa.unparse(oo.data_matrix), "Subset Dataset "+time_stamp+".csv")
      }

      ctrl.save_result = function(){
        // trying to save result. The result must be in a form of [{},{},{}], which is a folder of the tree. In one of the {}, there is a main key indicating that this is the folder node. If the main is not found, then everything will be added to the user clicked node. For all the nodes that are not folder node, must have 'saving_content' and 'content_type' for adding the attachments. Also, these nodes's parent is to be determined by the user click.
        var time_stamp = get_time_string()
    to_be_saved_parameters = _.clone(ctrl.parameters)
    to_be_saved_parameters.e = null
    to_be_saved_parameters.f = null
    to_be_saved_parameters.p = null
        var to_be_saved =
        [{
          "id":"subset"+time_stamp,
          "parent":undefined,
          "text":"Subset Dataset",
          "icon":"fa fa-folder",
          "main":true,
          "analysis_type":"subset",
          "parameters":to_be_saved_parameters
        },{
          "id":"subset_dataset_"+time_stamp+".csv",
          "parent":"subset"+time_stamp,
          "text":"Subset Dataset.csv",
          "icon":"fa fa-file-excel-o",
          "attachment_id":"subset_dataset_"+time_stamp+".csv",
          "saving_content":btoa(unescape(encodeURIComponent(Papa.unparse(oo.data_matrix)))),
          "content_type":"application/vnd.ms-excel"
        }]

        mainctrl.save_result_modal(to_be_saved)
      }
	})






























