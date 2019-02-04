angular
.module('blankapp').controller("idexchangerController", function($http,$scope,$q, $rootScope, $timeout, $mdToast){
  ctrl = this;
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);


$http.get("https://cts.fiehnlab.ucdavis.edu/rest/fromValues").then(function(response) {
    console.log(response)
    rrr = response
  })



  $http.get("https://cts.fiehnlab.ucdavis.edu/rest/convert/InChIKey/KEGG/QNAYBMKLOCPYGJ-REOHCLBHSA-N").then(function(result){
                ctrl.batchResults[string][to] = result.data[0].results[0];
                console.log(result.data[0].results[0])
              })



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
  ctrl.from_type_options = ["PubChem CID",'smiles',"InChIKey","KEGG"]
  ctrl.to_type_options = ["PubChem CID",'smiles',"InChIKey","KEGG","Chemical Name"]

  var parameters;
  ctrl.make_data_read_here = function(obj){
    make_data_ready(obj)
    parameters = JSON.parse(localStorage.getItem('parameters'));
    ctrl.column_options = delete_element_from_array(Object.keys(ooo.f[0]),'label')
    ctrl.parameters.from_column = ctrl.column_options.includes(parameters.idexchanger.from_column)?parameters.idexchanger.from_column:ctrl.column_options[0]
    ctrl.parameters.to_type = parameters.idexchanger.to_type.map(x => ctrl.to_type_options.includes(x)).every(x=>x===true)?parameters.idexchanger.to_type:[ctrl.to_type_options[0]]

    ctrl.parameters.from_type = parameters.idexchanger.from_type

    $scope.$watch("ctrl.parameters",function(){
      parameters.idexchanger.from_column = ctrl.parameters.from_column
      parameters.idexchanger.from_type = ctrl.parameters.from_type
      parameters.idexchanger.to_type = ctrl.parameters.to_type
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

    dataSet = ooo.f.map(x=>_.pick(x,["label",ctrl.parameters.from_column]))

  /*$http.get("https://cts.fiehnlab.ucdavis.edu/rest/convert/InChIKey/KEGG/QNAYBMKLOCPYGJ-REOHCLBHSA-N").then(function(response) {
    console.log(response)
    rrr = response
  })*/
  var promise = $q.all(null);
    ctrl.batchResults = {}
    ctrl.loadingTotal = 0
    ctrl.generation = 0
    var myGeneration = ctrl.generation;
    ctrl.queryStrings = unpack(ooo.f,ctrl.parameters.from_column)
    // https://cts.fiehnlab.ucdavis.edu/rest/convert/InChIKey/Chemical%20Name/QNAYBMKLOCPYGJ-REOHCLBHSA-N
    angular.forEach(ctrl.queryStrings,function(string){
      ctrl.batchResults[string] = {};
      angular.forEach(ctrl.parameters.to_type, function(to) {
        ctrl.batchResults[string][to] = {};
        ctrl.loadingTotal += 1;
        promise = promise.then(function() {
          if (ctrl.generation !== myGeneration) {
            return $q.reject('Request reset');
            }else{
              return $http.get("https://cts.fiehnlab.ucdavis.edu/rest/convert/"+ctrl.parameters.from_type+"/"+to+"/"+string).then(function(result){
                rrr = result
                if(result.status===200){
                  ctrl.batchResults[string][to] = result.data[0].results[0];
                  console.log(result.data[0].results[0])
                }
              }).catch(function(err) {

                                        console.error(err);
                                    });
            }
        })
      })
    })
    /*angular.forEach(ooo.f, function(string) {
                    ctrl.batchResults[string] = {};
                    angular.forEach(ctrl.parameters.to_type, function(to) {
                        ctrl.batchResults[string][to] = {};
                        ctrl.loadingTotal += 1;
                        promise = promise.then(function() {
                            if (ctrl.generation !== myGeneration) {
                                return $q.reject('Request reset');
                            } else {
                                return $http.get("https://cts.fiehnlab.ucdavis.edu/rest/convert/InChIKey/KEGG/QNAYBMKLOCPYGJ-REOHCLBHSA-N")
                                    .then(function(result) {
                                      console.log(result)
                                        vm.batchResults[string][to] = result;
                                        if (vm.generation === myGeneration) {
                                            vm.loadingCounter += 1;
                                        }
                                    }).catch(function(err) {
                                        vm.batchResults[string][to] = [];
                                        vm.errors.push(err);
                                        console.error(err);
                                    });
                            }
                        });
                    });
                });*/



    //$scope.$apply(function(){ctrl.submit_button_text = "Calculate"})

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
      saveAs(blob, "ID Exchanger - Plots.zip");
    });*/

      download_csv(Papa.unparse(oo.result), "ID Exchanger.csv")
  }

  ctrl.save_result = function(){
    // trying to save result. The result must be in a form of [{},{},{}], which is a folder of the tree. In one of the {}, there is a main key indicating that this is the folder node. If the main is not found, then everything will be added to the user clicked node. For all the nodes that are not folder node, must have 'saving_content' and 'content_type' for adding the attachments. Also, these nodes's parent is to be determined by the user click.
        // !!!! modify what to save in the database.
        var time_stamp = get_time_string()
    to_be_saved_parameters = _.clone(ctrl.parameters)
    to_be_saved_parameters.e = null
    to_be_saved_parameters.f = null
    to_be_saved_parameters.p = null
       /* var to_be_saved =
        [{
          "id":"idexchanger_dataset_"+time_stamp,
          "parent":undefined,
          "text":"MetaMapp Pathway Mapping",
          "icon":"fa fa-folder",
          "main":true,
          "analysis_type":"idexchanger",
          "parameters":to_be_saved_parameters
        },{
          "id":"idexchanger_network_"+time_stamp+".sif",
          "parent":"idexchanger_dataset_"+time_stamp,
          "text":"MetaMapp Network.sif",
          "icon":"fa fa-file-code-o",
          "attachment_id":"idexchanger_network_"+time_stamp+".sif",
          "saving_content":chemsim_krp_07_base64.split("base64,")[1],
          "content_type":"application/octet-stream"
        },{
          "id":"idexchanger_node_attributes_"+time_stamp+".tsv",
          "parent":"idexchanger_dataset_"+time_stamp,
          "text":"MetaMapp Node Attributes.tsv",
          "icon":"fa fa-file-code-o",
          "attachment_id":"idexchanger_node_attributes_"+time_stamp+".tsv",
          "saving_content":node_attributes_chemsim_krp_07_base64.split("base64,")[1],
          "content_type":"application/octet-stream"
        }]*/

        var to_be_saved =
        [{
          "id":"idexchanger_dataset_"+time_stamp,
          "parent":undefined,
          "text":"ID Exchanger",
          "icon":"fa fa-folder",
          "main":true,
          "analysis_type":"idexchanger",
          "parameters":to_be_saved_parameters
        },{
          "id":"idexchanger_network_input"+time_stamp+".csv",
          "parent":"idexchanger_dataset_"+time_stamp,
          "text":"ID Exchanger.csv",
          "icon":"fa fa-file-excel-o",
          "attachment_id":"idexchanger_network_input"+time_stamp+".csv",
          "saving_content":btoa(unescape(encodeURIComponent(Papa.unparse(oo.result)))),
          "content_type":"application/vnd.ms-excel"
        }]

        mainctrl.save_result_modal(to_be_saved)

      }
	})






























