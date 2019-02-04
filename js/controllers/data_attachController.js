angular
.module('blankapp').controller("data_attachController", function($scope, $rootScope, $timeout, $mdToast, $mdDialog,cfpLoadingBar){
  ctrl = this;
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

  ctrl.select_data_button_text = "Select A Dataset From Database"
  ctrl.upload_data_button_text = "Upload A Dataset"
  ctrl.use_example_data_button_text = "Use The Example Dataset"
  ctrl.submit_button_text = "Attach"
  ctrl.download_button_text = "Download Result"
  ctrl.save_button_text = "Save Result To Database"
  ctrl.upload_data_from_input_text = "submit"
  ctrl.input_data_button_text = "Upload A Dataset By Copy & Paste"
  ctrl.load_data_from_input_show = false
  ctrl.data_source = null


  // !!!! add other ctrl initials.
  ctrl.attach_sample_info_text = "Attach Sample Information"
  ctrl.attach_compound_info_text = "Attach Compound Information"


  ctrl.make_data_read_here = function(obj){
    make_data_ready(obj)
    // !!!! make all the parameters ready here.
    ctrl.parameters.sample_infos = []
    ctrl.parameters.compound_infos = []
  }

  ctrl.attach_sample_info_fun = function(obj,attachment_data_id,node_id){
    oo = obj
    ii = attachment_data_id
    iii = node_id
    ctrl.parameters.sample_infos.push({
      column_options:unpack(obj.p,"label"),
      column:unpack(obj.p,"label"),
      dataSet:oo.data_matrix,
      attachment_data_id:attachment_data_id,
      node_id:node_id
    })
  }

  ctrl.view_sample_info = function(ev,index){
    xxx = index
    function view_sample_infoController($scope, $mdDialog, dataSet, node_id) {
      ddd = dataSet
      var db = new PouchDB('https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/project');
      db.get(mainctrl.activated_project_id).then(function(project_doc){
        $("#view_sample_info_tree").jstree('destroy');
        var node_index = unpack(project_doc.tree_structure,"id").indexOf(node_id)
        project_doc.tree_structure[node_index].state = {'opened':true, "selected" : true}
        $("#view_sample_info_tree").jstree({ 'core' : {
            'data' : project_doc.tree_structure
        }});
        //$('#view_sample_info_tree').jstree('select_node',node_id);
        if(typeof(viewSampleInfoData)!=='undefined'){
          viewSampleInfoData.destroy();
          $('#'+'view_sample_info_data').empty();
        }
        viewSampleInfoData = $('#view_sample_info_data').DataTable({
          data: dataSet.splice(1),
          columns: dataSet[0].map(function(x, index){return {title:x}}),
          "ordering": false,
          "scrollX": true,
          "scrollY":"500px",
          "scrollCollapse": true,
          "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]]
        });
      })

      $scope.cancel = function() {
        $mdDialog.cancel();
      };
    }

    $mdDialog.show({
      locals:{dataSet: JSON.parse(JSON.stringify(ctrl.parameters.sample_infos[index].dataSet)), node_id:ctrl.parameters.sample_infos[index].node_id},
      controller: view_sample_infoController,
      templateUrl: 'view_sample_info.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    })
  }
  ctrl.delete_sample_info = function(index){
    ctrl.parameters.sample_infos.splice(index, 1);
  }

  ctrl.attach_sample_info = function(module){
    mainctrl.the_waiting_module = module
    mainctrl.toggleLeft('right',true,"attach_sample_info_fun")
  }






  ctrl.attach_compound_info_fun = function(obj,attachment_data_id,node_id){
        oo = obj
       ii = attachment_data_id
       iii = node_id
    ctrl.parameters.compound_infos.push({
      column_options:unpack(obj.p,"label"),
      column:unpack(obj.p,"label"),
      dataSet:oo.data_matrix,
      attachment_data_id:attachment_data_id,
      node_id:node_id
    })
  }

  ctrl.view_compound_info = function(ev,index){
    xxx = index
    function view_compound_infoController($scope, $mdDialog, dataSet, node_id) {
      ddd = dataSet
      var db = new PouchDB('https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/project');
      db.get(mainctrl.activated_project_id).then(function(project_doc){
        $("#view_compound_info_tree").jstree('destroy');
        var node_index = unpack(project_doc.tree_structure,"id").indexOf(node_id)
        project_doc.tree_structure[node_index].state = {'opened':true, "selected" : true}
        $("#view_compound_info_tree").jstree({ 'core' : {
            'data' : project_doc.tree_structure
        }});
        //$('#view_compound_info_tree').jstree('select_node',node_id);
        if(typeof(viewCompoundInfoData)!=='undefined'){
          viewCompoundInfoData.destroy();
          $('#'+'view_compound_info_data').empty();
        }
        viewCompoundInfoData = $('#view_compound_info_data').DataTable({
          data: dataSet.splice(1),
          columns: dataSet[0].map(function(x, index){return {title:x}}),
          "ordering": false,
          "scrollX": true,
          "scrollY":"500px",
          "scrollCollapse": true,
          "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]]
        });
      })

      $scope.cancel = function() {
        $mdDialog.cancel();
      };
    }

    $mdDialog.show({
      locals:{dataSet: JSON.parse(JSON.stringify(ctrl.parameters.compound_infos[index].dataSet)), node_id:ctrl.parameters.compound_infos[index].node_id},
      controller: view_compound_infoController,
      templateUrl: 'view_compound_info.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    })
  }
  ctrl.delete_compound_info = function(index){
    ctrl.parameters.compound_infos.splice(index, 1);
  }

  ctrl.attach_compound_info = function(module){
    mainctrl.the_waiting_module = module
    mainctrl.toggleLeft('right',true,"attach_compound_info_fun")
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
    ctrl.submit_button_text = "Attaching"
    ctrl.parameters.fun_name = "data_attach_fun"
    var req = ocpu.call("call_fun",{parameters:ctrl.parameters},function(session){
      sss = session
      session.getObject(function(obj){
        oo = obj
        ctrl.report = oo.report_html[0]

        // !!!! modify how to display the results.

        dataSet = oo.data_matrix
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



        ctrl.enable_editing_text = false
        ctrl.enable_editing = function(){
          ctrl.enable_editing_text = true
          $('#result_datatable tbody').on( 'click', 'td', function () {
              column_index = result_DataTable.cell( this ).index().columnVisible
          });
          $('#result_datatable tbody').on( 'click', 'tr', function () {
              row_index = result_DataTable.row( this ).index()

              console.log(dataSet[row_index][column_index])
              if(dataSet[row_index][column_index]==='label'){
                alert("You cannot change 'label'. You can change anything else except 'label' because 'label' is used as indicator connecting files.")
                return;
              }

              var new_name = prompt("Change the '"+dataSet[row_index][column_index]+"' to?");
              console.log(new_name)
              if(new_name === null){
                console.log("canceled.")
              }else if(new_name.length==0){
                console.log("canceled.")
              }else if(new_name===dataSet[row_index][column_index]){
                console.log("canceled.")
              }else{
                dataSet[row_index][column_index] = new_name
                if(typeof(result_DataTable)!=='undefined'){
                  result_DataTable.destroy();
                  $('#'+'result_datatable').empty();
                }
                result_DataTable = $('#result_datatable').DataTable({
                  data: dataSet,
                  columns: dataSet[0].map(function(x, index){return {title:""}}),
                  "ordering": false,
                  "scrollX": true,
                  "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]]
                });
                ctrl.enable_editing();// continue enabling the user to edit the datatable.

              }
          });
        }



        ctrl.report = "<b>The "
        if(ctrl.parameters.sample_infos.length > 0){
          ctrl.report = ctrl.report + "samples information "
          for(var i = 0; i < ctrl.parameters.sample_infos.length; i++){
            ctrl.report = ctrl.report + "<code>"
            ctrl.report = ctrl.report + ctrl.parameters.sample_infos[i].column.join(", ")
            ctrl.report = ctrl.report + "<em>(from "+ctrl.parameters.compound_infos[0].node_id+")</em></code>"
          }
          if(i!==(ctrl.parameters.sample_infos.length-1)){
             ctrl.report = ctrl.report + ", "
           }
           if(ctrl.parameters.sample_infos.length > 0){
             ctrl.report = ctrl.report + " and the "
           }
        }

        if(ctrl.parameters.compound_infos.length > 0){
          ctrl.report = ctrl.report + "compounds information "
          for(var i = 0; i < ctrl.parameters.compound_infos.length; i++){
            ctrl.report = ctrl.report + "<code>"
            ctrl.report = ctrl.report + ctrl.parameters.compound_infos[i].column.join(", ")
            ctrl.report = ctrl.report + "<em>(from "+ctrl.parameters.compound_infos[0].node_id+")</em></code>"
          }
          if(i!==(ctrl.parameters.compound_infos.length-1)){
             ctrl.report = ctrl.report + ", "
           }
        }
        ctrl.report = ctrl.report + " were attached to the original dataset.</b>"
        ctrl.submit_button_text = "Attach"
        $scope.$apply();
      })
    }).done(function(){
      console.log("Calculation done.")
    }).fail(function(){
      alert("Error: " + req.responseText)
    })
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
      saveAs(blob, "Data Attaching - Plots.zip");
    });*/

      download_csv(Papa.unparse(dataSet), "Data Attached.csv")
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
    "id":"data_attach_dataset_"+time_stamp,
    "parent":undefined,
    "text":"Data Attaching",
    "icon":"fa fa-folder",
    "main":true,
    "analysis_type":"data_attach",
    "parameters":to_be_saved_parameters
    },{
    "id":"data_attach_dataset_"+time_stamp+".csv",
    "parent":"data_attach_dataset_"+time_stamp,
    "text":"Data Attaching.csv",
    "icon":"fa fa-file-excel-o",
    "attachment_id":"data_attach_dataset_"+time_stamp+".csv",
    "saving_content":btoa(unescape(encodeURIComponent(Papa.unparse(dataSet)))),
    "content_type":"application/vnd.ms-excel"
    }]

    mainctrl.save_result_modal(to_be_saved)

  }
})






























