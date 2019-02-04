angular
.module('blankapp').controller("volcano_plotController", function($scope, $rootScope, $timeout, $mdToast,cfpLoadingBar){
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
    parameters = JSON.parse(localStorage.getItem('parameters'))
    ctrl.column_options = delete_element_from_array(Object.keys(ooo.f[0]),'label')
    ctrl.parameters.p_column = ctrl.column_options.includes(parameters.volcano_plot.p_column)?parameters.volcano_plot.p_column:ctrl.column_options[0]
    ctrl.parameters.fc_column = ctrl.column_options.includes(parameters.volcano_plot.fc_column)?parameters.volcano_plot.fc_column:ctrl.column_options[0]
    // !!!! make all the parameters ready here.

    $scope.$watch("ctrl.parameters",function(newValue, oldValue){
      parameters.volcano_plot.p_column = ctrl.parameters.p_column
      parameters.volcano_plot.fc_column = ctrl.parameters.fc_column
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


groups = ["not_sig + decrease", "not_sig + small_fc", "sig + small_fc", "sig + decrease", "not_sig + increase", "sig + increase"]
ctrl.plot_session_options =  ["not_sig + decrease", "not_sig + small_fc", "sig + small_fc", "sig + decrease", "not_sig + increase", "sig + increase", 'layout']


  ctrl.submit = function(){
    ctrl.submit_button_text = "Calculating"
    cfpLoadingBar.start();

    p_values = unpack(ooo.f,ctrl.parameters.p_column)
    p_values_log10 = p_values.map(x=>-Math.log10(x))
    fc_values = unpack(ooo.f,ctrl.parameters.fc_column)
    fc_values_log2 = fc_values.map(x=>Math.log2(x))
    labels = unpack(ooo.f,'label')



    ctrl.parameters["not_sig + decrease"] = parameters.volcano_plot["not_sig + decrease"]
    ctrl.parameters["not_sig + small_fc"] = parameters.volcano_plot["not_sig + small_fc"]
    ctrl.parameters["sig + small_fc"] = parameters.volcano_plot["sig + small_fc"]
    ctrl.parameters["sig + decrease"] = parameters.volcano_plot["sig + decrease"]
    ctrl.parameters["not_sig + increase"] = parameters.volcano_plot["not_sig + increase"]
    ctrl.parameters["sig + increase"] = parameters.volcano_plot["sig + increase"]
    ctrl.parameters["layout"] = parameters.volcano_plot["layout"]
    ctrl.plot_session = "not_sig + decrease"

    ctrl.parameters.p_criterion = 0.05
    ctrl.parameters.fc_criterion = 1.2

    $scope.$watch("ctrl.parameters",function(newValue,oldValue){
      draw_volcano_plot()
      parameters.volcano_plot["not_sig + decrease"] = ctrl.parameters["not_sig + decrease"]
      parameters.volcano_plot["not_sig + small_fc"] = ctrl.parameters["not_sig + small_fc"]
      parameters.volcano_plot["sig + small_fc"] = ctrl.parameters["sig + small_fc"]
      parameters.volcano_plot["sig + decrease"] = ctrl.parameters["sig + decrease"]
      parameters.volcano_plot["not_sig + increase"] = ctrl.parameters["not_sig + increase"]
      parameters.volcano_plot["sig + increase"] = ctrl.parameters["sig + increase"]
      parameters.volcano_plot["layout"] = ctrl.parameters["layout"]

      localStorage.setItem('parameters', JSON.stringify(parameters));
    },true)

    draw_volcano_plot = function(){

      sig_index = p_values.map(x=>x<ctrl.parameters.p_criterion?'sig':'not_sig')
      fc_index = fc_values.map(function(x){
        if(x>ctrl.parameters.fc_criterion){
          return("increase")
        }else if(x<(1/ctrl.parameters.fc_criterion)){
          return("decrease")
        }else{
          return("small_fc")
        }
      })
      group_index = sig_index.map((x,i) => x +" + "+ fc_index[i])

      grouped_fc_log2 = groupData(group_index, fc_values_log2)
      grouped_p_log10 = groupData(group_index, p_values_log10)
      grouped_fc = groupData(group_index, fc_values)
      grouped_p = groupData(group_index, p_values)
      grouped_label = groupData(group_index, labels)

      plot_data = []
      for(var i=0; i<groups.length; i++){
        plot_data[i] = {...{
          x:grouped_fc_log2[groups[i]],
          y:grouped_p_log10[groups[i]],
          text:grouped_label[groups[i]].map((x,j)=>"label: "+x+"; p_value: "+grouped_p[groups[i]][j] + "; fold_change: "+ grouped_fc[groups[i]][j]),
          mode:"markers",
          type:"scatter",
          hoverinfo:"text"
        },...ctrl.parameters[groups[i]]}
      }

      Plotly.newPlot('plot', plot_data, ctrl.parameters["layout"]);


   }


    cfpLoadingBar.complete();
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
      saveAs(blob, "Volcano Plot - Plots.zip");
    });*/

      download_csv(Papa.unparse(oo.data_matrix), "Volcano Plot "+time_stamp+".csv")
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
          "id":"volcano_plot_dataset_"+time_stamp,
          "parent":undefined,
          "text":"Volcano Plot",
          "icon":"fa fa-folder",
          "main":true,
          "analysis_type":"volcano_plot",
          "parameters":to_be_saved_parameters
        },{
          "id":"volcano_plot_dataset_"+time_stamp+".csv",
          "parent":"volcano_plot_dataset_"+time_stamp,
          "text":"Volcano Plot.csv",
          "icon":"fa fa-file-excel-o",
          "attachment_id":"volcano_plot_dataset_"+time_stamp+".csv",
          "saving_content":btoa(unescape(encodeURIComponent(Papa.unparse(oo.data_matrix)))),
          "content_type":"application/vnd.ms-excel"
        }]

        mainctrl.save_result_modal(to_be_saved)

      }
	})






























