angular
    .module('blankapp').controller("chemrichController", function($scope, $rootScope, $timeout, $mdToast){
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

      var parameters;
      ctrl.make_data_read_here = function(obj){
        make_data_ready(obj)
        // !!!! make all the parameters ready here.
        parameters = JSON.parse(localStorage.getItem('parameters'));
        ctrl.column_options = Object.keys(ooo.f[0])
        ctrl.parameters.compound_label = ctrl.column_options.includes(parameters.chemrich.compound_label)?parameters.chemrich.compound_label:'label'
        ctrl.parameters.pubchemid = ctrl.column_options.includes(parameters.chemrich.pubchemid) ? parameters.chemrich.pubchemid : Object.keys(ooo.f[0])[0]
        ctrl.parameters.inchikey = ctrl.column_options.includes(parameters.chemrich.inchikey)?parameters.chemrich.inchikey:Object.keys(ooo.f[0])[1]
        ctrl.parameters.smiles = ctrl.column_options.includes(parameters.chemrich.smiles)?parameters.chemrich.smiles:Object.keys(ooo.f[0])[2]
        ctrl.parameters.pvalue = ctrl.column_options.includes(parameters.chemrich.pvalue)?parameters.chemrich.pvalue:Object.keys(ooo.f[0])[3]
        ctrl.parameters.foldchange = ctrl.column_options.includes(parameters.chemrich.foldchange)?parameters.chemrich.foldchange:Object.keys(ooo.f[0])[4]
        ctrl.parameters.fold_change_critical = parameters.chemrich.fold_change_critical



        $scope.$watch("ctrl.parameters",function(){
          parameters.chemrich.compound_label = ctrl.parameters.compound_label
          parameters.chemrich.pubchemid = ctrl.parameters.pubchemid
          parameters.chemrich.inchikey = ctrl.parameters.inchikey
          parameters.chemrich.smiles = ctrl.parameters.smiles
          parameters.chemrich.pvalue = ctrl.parameters.pvalue
          parameters.chemrich.foldchange = ctrl.parameters.foldchange
          parameters.chemrich.fold_change_critical = ctrl.parameters.fold_change_critical
          localStorage.setItem('parameters', JSON.stringify(parameters));


          data_f = ooo.f
          dataSet = data_f.map(x=>_.pick(x, [ctrl.parameters.pubchemid, ctrl.parameters.inchikey, ctrl.parameters.smiles, ctrl.parameters.compound_label, ctrl.parameters.pvalue, ctrl.parameters.foldchange]))


          if(typeof(result_DataTable)!=='undefined'){
           result_DataTable.destroy();
           $('#'+'result_datatable').empty();
          }
          result_DataTable = $('#result_datatable').DataTable({
            data: dataSet.map(x => Object.values(x)),
            columns: Object.keys(dataSet[0]).map(function(x, index){return {title:x.replace(".","_")}}),
            "ordering": false,
            "scrollX": true,
             "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]]
          });
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

        var req = ocpu.call("chemrich_fun",ctrl.parameters,function(session){
          sss = session
          session.getObject(function(obj){
            oo = obj
            ctrl.report = oo.report_html[0]



            if(oo.session_id[0].indexOf("replacement has 2 rows, data has 0")!==-1){
              console.log("There is no cluster enriched in your dataset. ")
            }else{
              var impace_plot = "http://chemrich.fiehnlab.ucdavis.edu/" + oo.session_id[0] + "/files/chemrich_impact_plot.pptx"
              var result_file = "http://chemrich.fiehnlab.ucdavis.edu/" + oo.session_id[0] + "/files/ChemRICH_results.xlsx"

              UrltoBase64(impace_plot, function(the_impact_plot_base64){
                impact_plot_base64 = the_impact_plot_base64
              })

              UrltoBase64(result_file, function(the_result_file_base64){
                result_file_base64 = the_result_file_base64
              })
            }


            // !!!! modify how to display the results.
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

        var zip = new JSZip();
        for(var i=0;i<Object.keys(plot_url).length;i++){
          zip.file(Object.keys(plot_url)[i]+".svg", Object.values(plot_url)[i], {base64: true});
        }

        zip.generateAsync({type:"blob"})
        .then(function (blob) {
            saveAs(blob, "ChemRICH - Plots.zip");
        });

        //download_csv(Papa.unparse(oo.result), "ChemRICH Input.csv")
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
          "id":"chemrich_dataset_"+time_stamp,
          "parent":undefined,
          "text":"ChemRICH",
          "icon":"fa fa-folder",
          "main":true,
          "analysis_type":"chemrich",
          "parameters":to_be_saved_parameters
        },{
          "id":"chemrich_plot_"+time_stamp+".pptx",
          "parent":"chemrich_dataset_"+time_stamp,
          "text":"ChemRICH Cluster Impact Plot.pptx",
          "icon":"fa fa-file-powerpoint-o",
          "attachment_id":"chemrich_plot_"+time_stamp+".pptx",
          "saving_content":impact_plot_base64.split("base64,")[1],
          "content_type":"application/vnd.openxmlformats-officedocument.presentationml.presentation"
        },{
          "id":"chemrich_node_attributes_"+time_stamp+".xlsx",
          "parent":"chemrich_dataset_"+time_stamp,
          "text":"ChemRICH Cluster Statistics.xlsx",
          "icon":"fa fa-file-excel-o",
          "attachment_id":"chemrich_node_attributes_"+time_stamp+".xlsx",
          "saving_content":result_file_base64.split("base64,")[1],
          "content_type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }]
        /*var to_be_saved =
        [{
          "id":"chemrich_dataset_"+time_stamp,
          "parent":undefined,
          "text":"ChemRICH Input",
          "icon":"fa fa-folder",
          "main":true,
          "analysis_type":"chemrich",
          "parameters":to_be_saved_parameters
        },{
          "id":"chemrich_plot_"+time_stamp+".csv",
          "parent":"chemrich_dataset_"+time_stamp,
          "text":"ChemRICH Input.csv",
          "icon":"fa fa-file-excel-o",
          "attachment_id":"chemrich_plot_"+time_stamp+".csv",
          "saving_content":btoa(unescape(encodeURIComponent(Papa.unparse(oo.result)))),
          "content_type":"application/vnd.ms-excel"
        }]*/

        mainctrl.save_result_modal(to_be_saved)

      }
	})






























