angular
.module('blankapp').controller("one_way_boxplotController", function($scope, $rootScope, $timeout, $mdToast, cfpLoadingBar){
  ctrl = this;
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);



  ctrl.edit_boxplot_by_this_data = function(){
      y = Object.values(groupData(unpack(ooo.p, ctrl.parameters.column), ooo.e[unpack(ooo.f,'label').indexOf(ctrl.parameters.selected_compound)]))
      texts = Object.values(groupData(unpack(ooo.p, ctrl.parameters.column), unpack(ooo.p, 'label')))
      names =  Object.keys(groupData(unpack(ooo.p, ctrl.parameters.column), ooo.e[unpack(ooo.f,'label').indexOf(ctrl.parameters.selected_compound)]))
      localStorage.setItem('one_way_boxplot_y', JSON.stringify(y));
      localStorage.setItem('one_way_boxplot_texts', JSON.stringify(texts));
      localStorage.setItem('one_way_boxplot_names', JSON.stringify(names));
  }



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
  ctrl.generate_all_boxplots_text = "Generate Boxplot for All Compounds"

  ctrl.format_options = ['svg','png']//,'jpeg','pdf'


  // !!!! add other ctrl initials.
  var parameters;
  ctrl.make_data_read_here = function(obj){
    make_data_ready(obj)
    // !!!! make all the parameters ready here.
    parameters = JSON.parse(localStorage.getItem('parameters'));
    ctrl.column_options = Object.keys(ooo.f[0])

    ctrl.parameters.format = parameters.one_way_boxplot.format

    ctrl.column_options = Object.keys(ooo.p[0])
    ctrl.parameters.column = ctrl.column_options.includes(parameters.one_way_boxplot.column)?parameters.one_way_boxplot.column:ctrl.column_options[0]
    ctrl.compound_options = unpack(ooo.f,"label")
    ctrl.parameters.selected_compound = ctrl.column_options.includes(parameters.one_way_boxplot.selected_compound)?parameters.one_way_boxplot.selected_compound:ctrl.compound_options[0]
    ctrl.parameters.style = parameters.one_way_boxplot.one_way_boxplot_selected

    var plot_style_db = new PouchDB('https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/user');
    plot_style_db.get(mainctrl.user).then(function(doc){
      ddd = doc
      ctrl.style_options = Object.keys(ddd.one_way_boxplot)
      ctrl.parameters.styles = ddd.one_way_boxplot
      ctrl.parameters.one_way_boxplot_fixed = ddd.one_way_boxplot_fixed
    })


    $scope.$watch('ctrl.parameters.column',function(){

      ctrl.parameters.levels = parameters.one_way_boxplot.levels.split("||").map(x=>unpack(ooo.p, ctrl.parameters.column).filter(unique).includes(x)).every(x=>x===true)?parameters.one_way_boxplot.levels:unpack(ooo.p, ctrl.parameters.column).filter(unique).join("||");

    })


    $scope.$watch('ctrl.parameters',function(){

      parameters.one_way_boxplot.format = ctrl.parameters.format
      parameters.one_way_boxplot.column = ctrl.parameters.column
      parameters.one_way_boxplot.selected_compound = ctrl.parameters.selected_compound
      parameters.one_way_boxplot.one_way_boxplot_selected = ctrl.parameters.style
      parameters.one_way_boxplot.levels = ctrl.parameters.levels
      localStorage.setItem('parameters', JSON.stringify(parameters));

      // get the data ready first.
      y = Object.values(groupData(unpack(ooo.p, ctrl.parameters.column), ooo.e[unpack(ooo.f,'label').indexOf(ctrl.parameters.selected_compound)]))
      texts = Object.values(groupData(unpack(ooo.p, ctrl.parameters.column), unpack(ooo.p, 'label')))
      names =  Object.keys(groupData(unpack(ooo.p, ctrl.parameters.column), ooo.e[unpack(ooo.f,'label').indexOf(ctrl.parameters.selected_compound)]))
      // get the style from the user.
      data_layout = get_data_layout(y,texts,names)

      data_layout.layout.annotations[0].text = "<b>"+ooo.f[unpack(ooo.f,'label').indexOf(ctrl.parameters.selected_compound)].label+"</b>"
      data_layout.layout.xaxis.title.text = "<b>"+ctrl.parameters.column+"</b>"
      data_layout.layout.yaxis.title.text = "<b>"+'value'+"</b>"

      Plotly.newPlot('plot', data_layout.data, data_layout.layout);

      ctrl.generate_all_boxplots = function(){
        ctrl.generate_all_boxplots_text = "Calculating"
        plot_url = [];
        var original_level_sequence = unpack(ooo.p, ctrl.parameters.column).filter(unique)
        var new_level_sequence = ctrl.parameters.levels.split("||")
        var index = 0;
        Plotly.newPlot('plot', data_layout.data, data_layout.layout).then(function(){
          var plot_loop = setInterval(function(){
            if(index===ooo.e.length){
              $scope.$apply(function(){
                ctrl.generate_all_boxplots_text = "Generate Boxplot for All Compounds"
              })
              clearInterval(plot_loop);
            }else{
              y = Object.values(groupData(unpack(ooo.p, ctrl.parameters.column), ooo.e[index]))
              texts = Object.values(groupData(unpack(ooo.p, ctrl.parameters.column), unpack(ooo.p, 'label')))
              names = Object.keys(groupData(unpack(ooo.p, ctrl.parameters.column), ooo.e[index]))
              update_data = {
                y:y,
                text:texts,
                name:names,
                ticktext:names
              }
              data_layout.layout.annotations[0].text = "<b>"+ooo.f[index].label+"</b>"
              Plotly.relayout(plot,data_layout.layout)
              update_index = original_level_sequence.map(x => new_level_sequence.indexOf(x))
              Plotly.restyle(plot,update_data,update_index).then(function(gd){
                Plotly.toImage(gd,{format:'svg'}).then(function(url){
                  /*u = url
                  uuu = decodeURIComponent(url.replace(/^data:image\/svg\+xml,/,''));
                  plot_url.push(btoa(unescape(encodeURIComponent(uuu))))*/
                    uuu = url
                  plot_url.push(url)
                  $scope.$apply(function(){
                    ctrl.percentage = Math.floor((index-1)/ooo.e.length*100)+"%";
                  })
                })
              })
            };
            index++;
          },1)
        });


      }

    },true)

  }

  get_data_layout = function(y,texts,names){
    var original_level_sequence = unpack(ooo.p, ctrl.parameters.column).filter(unique)
    var new_level_sequence = ctrl.parameters.levels.split("||")


    var y = new_level_sequence.map(x => y[original_level_sequence.indexOf(x)])
    var texts = new_level_sequence.map(x => texts[original_level_sequence.indexOf(x)])
    var names = new_level_sequence.map(x => names[original_level_sequence.indexOf(x)])
    //ddd = doc
    data = [];
    for(var i=0; i<y.length; i++){
      var element = JSON.parse(JSON.stringify(ctrl.parameters.styles[ctrl.parameters.style].global));
      //adjust according to the global.
      if(ctrl.parameters.styles[ctrl.parameters.style].global.marker.outliercolor !== 'user_define'){
        element.marker.outliercolor = color_palette[ctrl.parameters.styles[ctrl.parameters.style].global.marker.outliercolor][i].split(",").splice(0,3).concat([ctrl.parameters.styles[ctrl.parameters.style].global.marker.outliercolor_alpha+")"]).join(",")
      }else{
        element.marker.outliercolor = ctrl.parameters.styles[ctrl.parameters.style].global.marker.outliercolor_user_define
      }
      if(ctrl.parameters.styles[ctrl.parameters.style].global.marker.color !== 'user_define'){
        element.marker.color = color_palette[ctrl.parameters.styles[ctrl.parameters.style].global.marker.color][i].split(",").splice(0,3).concat([ctrl.parameters.styles[ctrl.parameters.style].global.marker.color_alpha+")"]).join(",")
      }else{
        element.marker.color = ctrl.parameters.styles[ctrl.parameters.style].global.marker.color_user_define
      }
      if(ctrl.parameters.styles[ctrl.parameters.style].global.marker.line.color !== 'user_define'){
        element.marker.line.color = color_palette[ctrl.parameters.styles[ctrl.parameters.style].global.marker.line.color][i].split(",").splice(0,3).concat([ctrl.parameters.styles[ctrl.parameters.style].global.marker.line.color_alpha+")"]).join(",")
      }else{
        element.marker.line.color = ctrl.parameters.styles[ctrl.parameters.style].global.marker.line.color_user_define
      }
      if(ctrl.parameters.styles[ctrl.parameters.style].global.line.color !== 'user_define'){
        element.line.color = color_palette[ctrl.parameters.styles[ctrl.parameters.style].global.line.color][i].split(",").splice(0,3).concat([ctrl.parameters.styles[ctrl.parameters.style].global.line.color_alpha+")"]).join(",")
      }else{
        element.line.color = ctrl.parameters.styles[ctrl.parameters.style].global.line.color_user_define
      }
      if(ctrl.parameters.styles[ctrl.parameters.style].global.fillcolor !== 'user_define'){
        element.fillcolor = color_palette[ctrl.parameters.styles[ctrl.parameters.style].global.fillcolor][i].split(",").splice(0,3).concat([ctrl.parameters.styles[ctrl.parameters.style].global.fillcolor_alpha+")"]).join(",")
      }else{
        element.fillcolor = ctrl.parameters.styles[ctrl.parameters.style].global.fillcolor_user_define
      }

      _.merge(element,ctrl.parameters.one_way_boxplot_fixed.data)
      element.y = y[i]
      element.text=texts[i]
      element.name = names[i]
      element.tickvals = [i]
      element.ticktext = names[i]
      data.push(element)
    };
    //data = new_level_sequence.map(x => data[original_level_sequence.indexOf(x)])


    layout = {}
    layout = JSON.parse(JSON.stringify(ctrl.parameters.styles[ctrl.parameters.style].layout))

    _.merge(layout,ctrl.parameters.one_way_boxplot_fixed.layout)

    return({data:data,layout:layout})
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
ctrl.parameters.fun_name = "one_way_boxplot_fun"
    var req = ocpu.call("call_fun",{parameters:ctrl.parameters},function(session){
      sss = session
      session.getObject(function(obj){
        oo = obj
        ctrl.report = oo.report_html[0]

        // !!!! modify how to display the results.

        // when click submit. Draw all the plots.

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
    var zip = new JSZip();

    if(ctrl.parameters.format === 'svg'){
      for(var i=0;i<Object.keys(plot_url).length;i++){
        zip.file(i+"th "+ooo.f[i].label.replace(/[^0-9a-zA-Z _().]/g,"_")+".svg", btoa(unescape(plot_url[i].replace("data:image/svg+xml,",""))), {base64: true});

      }

    zip.generateAsync({type:"blob"})
    .then(function (blob) {
      saveAs(blob, "One-Way Boxplot - Plots.zip");
    });
    }else if(ctrl.parameters.format === 'png'){
      base64s = plot_url.map(x=>btoa(unescape(x.replace("data:image/svg+xml,",""))))
      filenames = unpack(ooo.f, "label").map((x,i) => (i+1)+"th "+x.replace(/[^0-9a-zA-Z _().]/g,"_")+".png")

      /*var req = ocpu.call("svgbase642png",{
        base64s:base64s,
        filenames:filenames,
        zip_filename:"One-Way Boxplot - Plots.zip",
        width:data_layout.layout.width*5,
        height:data_layout.layout.height*5
      },function(session){
        ssss = session
        console.log("!")
      })*/

      var src = [];
      for(var i=0;i<Object.keys(plot_url).length;i++){
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        canvas.width = data_layout.layout.width;
        canvas.height = data_layout.layout.height;
        var image = new Image();
        context.clearRect ( 0, 0, data_layout.layout.width, data_layout.layout.height );
        var imgsrc = 'data:image/svg+xml;base64,'+ btoa(unescape(plot_url[i].replace("data:image/svg+xml,",""))); // Convert SVG string to data URL
        src.push(imgsrc)
      }
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      canvas.width = data_layout.layout.width*5;
      canvas.height = data_layout.layout.height*5;
      imgs = []

      var download = function(){
        for(var i=0;i<src.length;i++){
          var image = new Image();
          image.onload = (function(nr){
            return function() {
              if(nr===src.length){
                console.log("!")

                /*zip.generateAsync({type:"blob"})
                .then(function (blob) {
                  saveAs(blob, "One-Way Boxplot - Plots.zip");
                });*/
                            //break;
              }else{
                image.src = src[nr]
                context.drawImage(image, 0, 0, data_layout.layout.width*5, data_layout.layout.height*5);
                var img = canvas.toDataURL("image/png");
                console.log(nr)
                imgs.push(img)
                zip.file(nr+"th "+ooo.f[nr].label+".png", img.replace("data:image/png;base64,",""), {base64: true});
              }

            }
          }(i));
          image.src = src[i];
        }
      }
      download();
    }

  }

  ctrl.save_result = function(){
    var time_stamp = get_time_string()
    var zip = new JSZip();

    if(ctrl.parameters.format === 'svg'){
      for(var i=0;i<Object.keys(plot_url).length;i++){
        zip.file(i+"th "+ooo.f[i].label.replace(/[^0-9a-zA-Z _().]/g,"_")+".svg", btoa(unescape(plot_url[i].replace("data:image/svg+xml,",""))), {base64: true});

      }

    zip.generateAsync({type:"base64"})
    .then(function (base64) {
      var time_stamp = get_time_string()
      var to_be_saved =
      [{
        "id":"one_way_boxplot_dataset_"+time_stamp,
        "parent":undefined,
        "text":"One-Way Boxplot",
        "icon":"fa fa-folder",
        "main":true
      },{
        "id":"one_way_boxplot_dataset_"+time_stamp+".zip",
        "parent":"one_way_boxplot_dataset_"+time_stamp,
        "text":"One-Way Boxplot.zip",
        "icon":"fa fa-file-zip-o",
        "attachment_id":"one_way_boxplot_dataset_"+time_stamp+".zip",
        "saving_content":base64,
        "content_type":"application/x-zip-compressed"
      }]
      mainctrl.save_result_modal(to_be_saved)
    });
    }else if(ctrl.parameters.format === 'png'){
      base64s = plot_url.map(x=>btoa(unescape(x.replace("data:image/svg+xml,",""))))
      filenames = unpack(ooo.f, "label").map((x,i) => (i+1)+"th "+x.replace(/[^0-9a-zA-Z _().]/g,"_")+".png")

      var src = [];
      for(var i=0;i<Object.keys(plot_url).length;i++){
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        canvas.width = data_layout.layout.width;
        canvas.height = data_layout.layout.height;
        var image = new Image();
        context.clearRect ( 0, 0, data_layout.layout.width, data_layout.layout.height );
        var imgsrc = 'data:image/svg+xml;base64,'+ btoa(unescape(plot_url[i].replace("data:image/svg+xml,",""))); // Convert SVG string to data URL
        src.push(imgsrc)
      }
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      canvas.width = data_layout.layout.width*5;
      canvas.height = data_layout.layout.height*5;
      imgs = []

      var download = function(){
        cfpLoadingBar.start();
        to_be_saved =
                [{
                  "id":"one_way_boxplot_dataset_"+time_stamp,
                  "parent":undefined,
                  "text":"One-Way Boxplot",
                  "icon":"fa fa-folder",
                  "main":true
                }]
                console.log(src.length)
        for(var i=0;i<src.length+1;i++){
          var image = new Image();
          image.onload = (function(nr){
            return function() {
              if(nr===src.length){
                console.log("!")
                //mainctrl.save_result_modal(to_be_saved)

    zip.generateAsync({type:"base64"})
    .then(function (base64) {
      console.log("!")
      var time_stamp = get_time_string()
    to_be_saved_parameters = _.clone(ctrl.parameters)
    to_be_saved_parameters.e = null
    to_be_saved_parameters.f = null
    to_be_saved_parameters.p = null
      to_be_saved =
      [{
        "id":"one_way_boxplot_dataset_"+time_stamp,
        "parent":undefined,
        "text":"One-Way Boxplot",
        "icon":"fa fa-folder",
        "main":true,
        "analysis_type":"one_way_boxplot",
          "parameters":to_be_saved_parameters
      },{
        "id":"one_way_boxplot_dataset_"+time_stamp+".zip",
        "parent":"one_way_boxplot_dataset_"+time_stamp,
        "text":"One-Way Boxplot.zip",
        "icon":"fa fa-file-zip-o",
        "attachment_id":"one_way_boxplot_dataset_"+time_stamp+".zip",
        "saving_content":base64,
        "content_type":"application/x-zip-compressed"
      }]
      cfpLoadingBar.complete();
      mainctrl.save_result_modal(to_be_saved)
    });
    //break;
              }else{
                image.src = src[nr]
                context.drawImage(image, 0, 0, data_layout.layout.width*5, data_layout.layout.height*5);
                var img = canvas.toDataURL("image/png");
                console.log(nr)

                imgs.push(img)

                /*to_be_saved.push({
                  "id":"scree_plot_"+time_stamp+".png",
                  "parent":"PCA"+time_stamp,
                  "text":"scree plot.png",
                  "icon":"fa fa-file-image-o",
                  "attachment_id":"scree_plot_"+time_stamp+".png",
                  "saving_content":img.replace("data:image/png;base64,",""),
                  "content_type":"image/png"
                })
                //mainctrl.save_result_modal(to_be_saved)*/
                zip.file(nr+"th "+ooo.f[nr].label.replace(/[^0-9a-zA-Z _().]/g,"_")+".png", img.replace("data:image/png;base64,",""), {base64: true});

              }

            }
          }(i));
          image.src = src[i];
        }
      }
      download();
    }










      }
	})



