angular
    .module('blankapp').controller("plsdaController", function($scope, $rootScope, Upload, $timeout, $mdToast, cfpLoadingBar){
      ctrl = this;


      ctrl.label = 'Choose a Color'

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

      ctrl.submit_perm_button_text = "Perform Permutation Test"

      ctrl.shape_by_options = shape_by_options
      ctrl.scale_options = scale_options





      var parameters;
      ctrl.make_data_read_here = function(obj){
        make_data_ready(obj)
        // !!!! make all the parameters ready here.
        parameters = JSON.parse(localStorage.getItem('parameters'));

        ctrl.column_options = Object.keys(ooo.p[0])
        ctrl.parameters.column = ctrl.column_options.includes(parameters.column)?parameters.column:ctrl.column_options[0]
        ctrl.parameters.scale = parameters.plsda.scale

        // initialize all the parameter for pair_score_plot.
        ctrl.parameters.pair_score_plot = {}
        ctrl.parameters.pair_score_plot.color_by_options = delete_element_from_array(Object.keys(ooo.p[0]),'label')
        ctrl.parameters.pair_score_plot.color_by_options.push("SINGLE_COLOR")
        ctrl.parameters.pair_score_plot.color_by = ctrl.parameters.pair_score_plot.color_by_options.includes(parameters.plsda.pair_score_plot.color_by)?parameters.plsda.pair_score_plot.color_by:ctrl.parameters.column
        ctrl.parameters.pair_score_plot.shape_by_options = delete_element_from_array(Object.keys(ooo.p[0]),'label')
        ctrl.parameters.pair_score_plot.shape_by_options.push("SINGLE_SHAPE")
        ctrl.parameters.pair_score_plot.shape_by = ctrl.parameters.pair_score_plot.shape_by_options.includes(parameters.plsda.pair_score_plot.shape_by)?parameters.plsda.pair_score_plot.shape_by:"SINGLE_SHAPE"
        ctrl.parameters.pair_score_plot.scatter_size = parameters.plsda.pair_score_plot.scatter_size

        // initialize all the parameter for vip_plot.
        ctrl.parameters.vip_plot = {}
        ctrl.parameters.vip_plot.n_vip = parameters.plsda.vip_plot.n_vip
        ctrl.parameters.vip_plot.margin = {}
        ctrl.parameters.vip_plot.margin.left = parameters.plsda.vip_plot.margin.left
        ctrl.parameters.vip_plot.heigth = parameters.plsda.vip_plot.heigth
        ctrl.parameters.vip_plot.yaxis_font_size = parameters.plsda.vip_plot.yaxis_font_size

        // initialize all the parameter for score_plot.
         ctrl.parameters.score_plot = {}
         ctrl.parameters.score_plot.color_by_options = delete_element_from_array(Object.keys(ooo.p[0]),'label')
         ctrl.parameters.score_plot.color_by_options.push("SINGLE_COLOR")
         ctrl.parameters.score_plot.color_by = ctrl.parameters.score_plot.color_by_options.includes(parameters.plsda.score_plot.color_by)?parameters.plsda.score_plot.color_by:ctrl.parameters.column
         ctrl.parameters.score_plot.shape_by_options = delete_element_from_array(Object.keys(ooo.p[0]),'label')
         ctrl.parameters.score_plot.shape_by_options.push("SINGLE_SHAPE")
         ctrl.parameters.score_plot.shape_by = ctrl.parameters.score_plot.shape_by_options.includes(parameters.plsda.score_plot.shape_by)?parameters.plsda.score_plot.shape_by:"SINGLE_SHAPE"
         ctrl.parameters.score_plot.scatter_size = parameters.plsda.score_plot.scatter_size
         ctrl.parameters.score_plot.pcx = parameters.plsda.score_plot.pcx
         ctrl.parameters.score_plot.pcy = parameters.plsda.score_plot.pcy
         ctrl.parameters.score_plot.add_center = parameters.plsda.score_plot.add_center
         ctrl.parameters.score_plot.ellipse_color = parameters.plsda.score_plot.ellipse_color
         ctrl.parameters.score_plot.ellipse_shape = parameters.plsda.score_plot.ellipse_shape

         // initialize all the parameter for loading_plot.
         ctrl.parameters.loading_plot = {}
         ctrl.parameters.loading_plot.color_by_options = delete_element_from_array(Object.keys(ooo.f[0]),'label')
         ctrl.parameters.loading_plot.color_by_options.push("SINGLE_COLOR")
         ctrl.parameters.loading_plot.color_by = ctrl.parameters.loading_plot.color_by_options.includes(parameters.plsda.loading_plot.color_by)?parameters.plsda.loading_plot.color_by:"SINGLE_COLOR"
         ctrl.parameters.loading_plot.shape_by_options = delete_element_from_array(Object.keys(ooo.f[0]),'label')
         ctrl.parameters.loading_plot.shape_by_options.push("SINGLE_SHAPE")
         ctrl.parameters.loading_plot.shape_by = ctrl.parameters.loading_plot.shape_by_options.includes(parameters.plsda.loading_plot.shape_by)?parameters.plsda.loading_plot.shape_by:"SINGLE_SHAPE"
         ctrl.parameters.loading_plot.scatter_size = parameters.plsda.loading_plot.scatter_size
         ctrl.parameters.loading_plot.pcx = parameters.plsda.loading_plot.pcx
         ctrl.parameters.loading_plot.pcy = parameters.plsda.loading_plot.pcy
         ctrl.parameters.loading_plot.add_center = parameters.plsda.loading_plot.add_center
         ctrl.parameters.loading_plot.ellipse_color = parameters.plsda.loading_plot.ellipse_color
         ctrl.parameters.loading_plot.ellipse_shape = parameters.plsda.loading_plot.ellipse_shape

         // permutation
         ctrl.parameters.n_perm = parameters.plsda.n_perm



        $scope.$watch("ctrl.parameters",function(newValue, oldValue){
          parameters.plsda.scale = ctrl.parameters.scale
          parameters.column = ctrl.parameters.column
          parameters.plsda.pair_score_plot.scatter_size = ctrl.parameters.pair_score_plot.scatter_size
          parameters.plsda.pair_score_plot.color_by = ctrl.parameters.pair_score_plot.color_by
          parameters.plsda.pair_score_plot.shape_by = ctrl.parameters.pair_score_plot.shape_by

          parameters.plsda.score_plot.scatter_size = ctrl.parameters.score_plot.scatter_size
          parameters.plsda.score_plot.color_by = ctrl.parameters.score_plot.color_by
          parameters.plsda.score_plot.shape_by = ctrl.parameters.score_plot.shape_by
          parameters.plsda.score_plot.pcx = ctrl.parameters.score_plot.pcx
          parameters.plsda.score_plot.pcy = ctrl.parameters.score_plot.pcy
          parameters.plsda.score_plot.add_center = ctrl.parameters.score_plot.add_center
          parameters.plsda.score_plot.ellipse_color = ctrl.parameters.score_plot.ellipse_color
          parameters.plsda.score_plot.ellipse_shape = ctrl.parameters.score_plot.ellipse_shape

          parameters.plsda.loading_plot.scatter_size = ctrl.parameters.loading_plot.scatter_size
          parameters.plsda.loading_plot.color_by = ctrl.parameters.loading_plot.color_by
          parameters.plsda.loading_plot.shape_by = ctrl.parameters.loading_plot.shape_by
          parameters.plsda.loading_plot.pcx = ctrl.parameters.loading_plot.pcx
          parameters.plsda.loading_plot.pcy = ctrl.parameters.loading_plot.pcy
          parameters.plsda.loading_plot.add_center = ctrl.parameters.loading_plot.add_center
          parameters.plsda.loading_plot.ellipse_color = ctrl.parameters.loading_plot.ellipse_color
          parameters.plsda.loading_plot.ellipse_shape = ctrl.parameters.loading_plot.ellipse_shape

          parameters.plsda.vip_plot.margin.left = ctrl.parameters.vip_plot.margin.left
          parameters.plsda.vip_plot.heigth = ctrl.parameters.vip_plot.heigth
          parameters.plsda.vip_plot.yaxis_font_size = ctrl.parameters.vip_plot.yaxis_font_size

          parameters.plsda.n_perm = ctrl.parameters.n_perm
          localStorage.setItem('parameters', JSON.stringify(parameters));

        },true)

      }


      ctrl.load_data_from_database = function(module){
        mainctrl.the_waiting_module = module
        mainctrl.toggleLeft('right',true)
      }

      ctrl.uploadFiles = function(file, errFiles) {
          ctrl.f = file;
          ctrl.errFile = errFiles && errFiles[0];
          if (file) {
            console.log(file)
          // create a temp project.
          var time_stamp=get_time_string()
          ctrl.upload_data_button_text = 'uploading'
          var db_project = new PouchDB('http://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/project');
                var new_project = {
                  "_id":"temp_project" + time_stamp,
                  "name":"temp_project",
                  "tree_structure":[],
                  "analysis_type":"temp_project"
                }
          db_project.put(new_project).then(function(){
             var req=ocpu.call("upload_dataset",{
               path:file,
               project_id:"temp_project" + time_stamp
             },function(session){
               sss = session
               session.getObject(function(obj){
                 ctrl.data_source = null
                 ooo = obj
                 ctrl.make_data_read_here(obj)
                 ctrl.upload_data_button_text = "Upload A Dataset"
                 $scope.$apply();
               })
             }).done(function(){
               $scope.$apply(function(){file.progress = 100;})
             }).fail(function(){
               ctrl.upload_data_button_text = "Upload A Dataset"
               alert("Error: " + req.responseText)
               $scope.$apply();
             })
          })



          }
      }



      ctrl.submit = function(){
        ctrl.submit_button_text = "Calculating"

        cfpLoadingBar.start();
        ctrl.parameters.fun_name = "plsda"
        var req = ocpu.call("call_fun",{parameters:ctrl.parameters},function(session){
          sss = session
          session.getObject(function(obj){
            oo = obj
           $scope.$apply();
          }).then(function(){
            plot_url = []
            ctrl.plot_parameters = {}
            // generate scree plot
            scree_plot_dta = scree_plot_plsda(oo.R2, oo.Q2, oo.variance)
            Plotly.newPlot('scree_plot', scree_plot_dta.data, scree_plot_dta.layout).then(function(gd){
              Plotly.toImage(gd,{format:'svg'})
              .then(
                function(url)
                 {
                   /*uuu = url
                   uuu = uuu.replace(/^data:image\/svg\+xml,/, '');
                   uuu = decodeURIComponent(uuu);
                   plot_url.scree_plot=  btoa(unescape(encodeURIComponent(uuu)))*/
                         uuuu = url
                         //uuu = uuu.replace(/^data:image\/svg\+xml,/, '');
                         //uuu = decodeURIComponent(uuu);
                         //plot_url.scree_plot=  btoa(unescape(encodeURIComponent(uuu)))
                          var canvas = document.createElement("canvas");
                          var context = canvas.getContext("2d");
                          canvas.width = 4000;
                          canvas.height = 3000;
                          var image = new Image();
                          context.clearRect ( 0, 0, 4000, 3000 );
                          var imgsrc = 'data:image/svg+xml;base64,'+ btoa(unescape(url.replace("data:image/svg+xml,",""))); // Convert SVG string to data URL

                          var image = new Image();
                          image.onload = function() {
                              context.drawImage(image, 0, 0, 4000, 3000);
                              var img = canvas.toDataURL("image/png");
                              base64 = img.replace("data:image/png;base64,","")
                              plot_url.scree_plot = base64
                          };
                          image.src = imgsrc

                 }
             )
            });
            ctrl.scree_plot_report = "<p>Scree Plot shows the variance explained (X2, yellow), goodness of fit (R2, blue), and cross-validated R2 (Q2, red). The Q2 is requently used to measure the performance of the PLS-DA model. The higher the Q2, the more predictive power the model is. The highest Q2 is "+ jStat.max(oo.Q2)*100+"%</p>"

             $scope.$watch("ctrl.parameters.pair_score_plot.color_by",function(newValue){
               ctrl.parameters.pair_score_plot.color_levels = unpack(ooo.p,ctrl.parameters.pair_score_plot.color_by).filter(unique)
             })
             $scope.$watch("ctrl.parameters.pair_score_plot.color_levels",function(newValue){
               ctrl.parameters.pair_score_plot.color = []
               for(var i=0;i<ctrl.parameters.pair_score_plot.color_levels.length;i++){
                 if(ctrl.parameters.pair_score_plot.color_levels.length==1){
                   ctrl.parameters.pair_score_plot.color.push({
                     levels:ctrl.parameters.pair_score_plot.color_levels[i],
                     option:"rgba(0,0,0,1)"
                   })
                 }else{
                   ctrl.parameters.pair_score_plot.color.push({
                     levels:ctrl.parameters.pair_score_plot.color_levels[i],
                     option:color_palette.mpn65[i]
                   })
                 }

               }
             })

             $scope.$watch("ctrl.parameters.pair_score_plot.shape_by",function(newValue){
               ctrl.parameters.pair_score_plot.shape_levels = unpack(ooo.p,ctrl.parameters.pair_score_plot.shape_by).filter(unique)
             })

             $scope.$watch("ctrl.parameters.pair_score_plot.shape_levels",function(newValue){
               ctrl.parameters.pair_score_plot.shape = []
               for(var i=0;i<ctrl.parameters.pair_score_plot.shape_levels.length;i++){
                 ctrl.parameters.pair_score_plot.shape.push({
                   levels:ctrl.parameters.pair_score_plot.shape_levels[i],
                   option:shape_palette.ggplot2[i]
                 })
               }
             })

             $scope.$watch("ctrl.parameters.pair_score_plot",function(newValue){
                   // generate pair score plot
                  pair_score_plot_dta = pair_score_plot(jStat.transpose(oo.scores),oo.variance, unpack(ooo.p,ctrl.parameters.pair_score_plot.color_by),unpack(ooo.p,ctrl.parameters.pair_score_plot.shape_by), unpack(ctrl.parameters.pair_score_plot.color,"option"), unpack(ctrl.parameters.pair_score_plot.shape,"option"), unpack(ctrl.parameters.pair_score_plot.color,"levels"),unpack(ctrl.parameters.pair_score_plot.shape,"levels"),unpack(ooo.p, 'label'),ctrl.parameters.pair_score_plot.scatter_size)
                  Plotly.newPlot('pair_score_plot', pair_score_plot_dta.data, pair_score_plot_dta.layout)
                  .then(function(gd){
                    Plotly.toImage(gd,{format:'svg'})
                    .then(
                      function(url)
                       {
                         /*uuu = url
                         uuu = uuu.replace(/^data:image\/svg\+xml,/, '');
                         uuu = decodeURIComponent(uuu);
                         plot_url.pair_score_plot = btoa(unescape(encodeURIComponent(uuu)))*/
                         uuu = url
                         /*uuu = uuu.replace(/^data:image\/svg\+xml,/, '');
                         uuu = decodeURIComponent(uuu);
                         plot_url.pair_score_plot = btoa(unescape(encodeURIComponent(uuu)))*/

                          var canvas = document.createElement("canvas");
                          var context = canvas.getContext("2d");
                          canvas.width = 3000;
                          canvas.height = 3000;
                          var image = new Image();
                          context.clearRect ( 0, 0, 3000, 3000 );
                          var imgsrc = 'data:image/svg+xml;base64,'+ btoa(unescape(url.replace("data:image/svg+xml,",""))); // Convert SVG string to data URL

                          var image = new Image();
                          image.onload = function() {
                              context.drawImage(image, 0, 0, 3000, 3000);
                              var img = canvas.toDataURL("image/png");
                              base64 = img.replace("data:image/png;base64,","")
                              plot_url.pair_score_plot = base64
                          };
                          image.src = imgsrc
                       }
                   )
                  })




                  ;
                  $("#pair_score_plot div div")[0].style.margin="0 auto"
                 },true)

             $scope.$watch("ctrl.parameters.vip_plot",function(newValue){
                    /*vip = unpack(oo.vip_table,"vip")
                    y_text = unpack(oo.vip_table,"label")
                    vip_heatmap_z = oo.vip_heatmap
                    vip_heatmap_text = oo.vip_heatmap_text
                    n_vip = 20*/
                    // generate vip plot
                    var vip_plot_data = vip_plot(unpack(oo.vip_table,"vip"), unpack(oo.vip_table,"label"),oo.vip_heatmap,oo.vip_heatmap_text,ctrl.parameters.vip_plot.n_vip,ctrl.parameters.vip_plot.heigth,ctrl.parameters.vip_plot.margin.left,ctrl.parameters.vip_plot.yaxis_font_size)
                    Plotly.newPlot('vip', vip_plot_data.data, vip_plot_data.layout).then(function(gd){
                    Plotly.toImage(gd,{format:'svg'})
                    .then(
                      function(url)
                       {
                         /*uuu = url
                         uuu = uuu.replace(/^data:image\/svg\+xml,/, '');
                         uuu = decodeURIComponent(uuu);
                         plot_url.vip_plot = btoa(unescape(encodeURIComponent(uuu)))*/

                         uuu = url
                         /*uuu = uuu.replace(/^data:image\/svg\+xml,/, '');
                         uuu = decodeURIComponent(uuu);
                         plot_url.vip_plot = btoa(unescape(encodeURIComponent(uuu)))*/

                         var canvas = document.createElement("canvas");
                          var context = canvas.getContext("2d");
                          canvas.width = 4000;
                          canvas.height = 3000;
                          var image = new Image();
                          context.clearRect ( 0, 0, 4000, 3000 );
                          var imgsrc = 'data:image/svg+xml;base64,'+ btoa(unescape(url.replace("data:image/svg+xml,",""))); // Convert SVG string to data URL

                          var image = new Image();
                          image.onload = function() {
                              context.drawImage(image, 0, 0, 4000, 3000);
                              var img = canvas.toDataURL("image/png");
                              base64 = img.replace("data:image/png;base64,","")
                              plot_url.vip_plot = base64
                          };
                          image.src = imgsrc

                       }
                   )
                  })
                  $("#vip div div")[0].style.margin="0 auto"
                  },true)

             $scope.$watch("ctrl.parameters.score_plot.color_by",function(newValue){
               ctrl.parameters.score_plot.color_levels = unpack(ooo.p,ctrl.parameters.score_plot.color_by).filter(unique)
             })
             $scope.$watch("ctrl.parameters.score_plot.color_levels",function(newValue){
               ctrl.parameters.score_plot.color = []
               for(var i=0;i<ctrl.parameters.score_plot.color_levels.length;i++){
                 if(ctrl.parameters.score_plot.color_levels.length==1){
                   ctrl.parameters.score_plot.color.push({
                     levels:ctrl.parameters.score_plot.color_levels[i],
                     option:"rgba(0,0,0,1)"
                   })
                 }else{
                   ctrl.parameters.score_plot.color.push({
                     levels:ctrl.parameters.score_plot.color_levels[i],
                     option:color_palette.mpn65[i]
                   })
                 }

               }
             })

             $scope.$watch("ctrl.parameters.score_plot.shape_by",function(newValue){
               ctrl.parameters.score_plot.shape_levels = unpack(ooo.p,ctrl.parameters.score_plot.shape_by).filter(unique)
             })

             ctrl.parameters.score_plot.pcx_options = []
             for(var i=0; i<oo.scores.length;i++){
               ctrl.parameters.score_plot.pcx_options.push({
                 value:i,
                 text:"LV "+(i+1)
               })
             }
             ctrl.parameters.score_plot.pcy_options=[]
             for(var i=0; i<oo.scores.length;i++){
               ctrl.parameters.score_plot.pcy_options.push({
                 value:i,
                 text:"LV "+(i+1)
               })
             }

             $scope.$watch("ctrl.parameters.score_plot.shape_levels",function(newValue){
               ctrl.parameters.score_plot.shape = []
               for(var i=0;i<ctrl.parameters.score_plot.shape_levels.length;i++){
                 ctrl.parameters.score_plot.shape.push({
                   levels:ctrl.parameters.score_plot.shape_levels[i],
                   option:shape_palette.ggplot2[i]
                 })
               }
             })

             $scope.$watch("ctrl.parameters.score_plot",function(newValue){
               // generate pair score plot
              score_plot_dta = score_plot(jStat.transpose(oo.scores)[ctrl.parameters.score_plot.pcx],jStat.transpose(oo.scores)[ ctrl.parameters.score_plot.pcy],"LV"+(ctrl.parameters.score_plot.pcx+1)+" ("+(oo.variance[ctrl.parameters.score_plot.pcx]*100).toFixed(2)+"%)", "LV"+(ctrl.parameters.score_plot.pcx+1)+" ("+(oo.variance[ctrl.parameters.score_plot.pcy]*100).toFixed(2)+"%)", oo.variance,   unpack(ooo.p,ctrl.parameters.score_plot.color_by),  unpack(ooo.p,ctrl.parameters.score_plot.shape_by), unpack(ctrl.parameters.score_plot.color,"option"), unpack(ctrl.parameters.score_plot.shape,"option"), unpack(ctrl.parameters.score_plot.color,"levels"), unpack(ctrl.parameters.score_plot.shape,"levels"), unpack(ooo.p, 'label'), ctrl.parameters.score_plot.scatter_size, ctrl.parameters.score_plot.add_center, ctrl.parameters.score_plot.ellipse_color, ctrl.parameters.score_plot.ellipse_shape)
              Plotly.newPlot('score_plot', score_plot_dta.data, score_plot_dta.layout).then(function(gd){
                Plotly.toImage(gd,{format:'svg'})
                .then(
                  function(url)
                   {
                     /*uuu = url
                     uuu = uuu.replace(/^data:image\/svg\+xml,/, '');
                     uuu = decodeURIComponent(uuu);
                     plot_url.score_plot = btoa(unescape(encodeURIComponent(uuu)))*/

                         uuu = url
                         /*uuu = uuu.replace(/^data:image\/svg\+xml,/, '');
                         uuu = decodeURIComponent(uuu);
                         plot_url.score_plot = btoa(unescape(encodeURIComponent(uuu)))*/


                          var canvas = document.createElement("canvas");
                          var context = canvas.getContext("2d");
                          canvas.width = 4000;
                          canvas.height = 3000;
                          var image = new Image();
                          context.clearRect ( 0, 0, 4000, 3000 );
                          var imgsrc = 'data:image/svg+xml;base64,'+ btoa(unescape(url.replace("data:image/svg+xml,",""))); // Convert SVG string to data URL

                          var image = new Image();
                          image.onload = function() {
                              context.drawImage(image, 0, 0, 4000, 3000);
                              var img = canvas.toDataURL("image/png");
                              base64 = img.replace("data:image/png;base64,","")
                              plot_url.score_plot = base64
                          };
                          image.src = imgsrc
                   }
               )
              })
              $("#score_plot div div")[0].style.margin="0 auto"


             },true)

             $scope.$watch("ctrl.parameters.loading_plot.color_by",function(newValue){
               ctrl.parameters.loading_plot.color_levels = unpack(ooo.f,ctrl.parameters.loading_plot.color_by).filter(unique)
             })
             $scope.$watch("ctrl.parameters.loading_plot.color_levels",function(newValue){
               ctrl.parameters.loading_plot.color = []
               for(var i=0;i<ctrl.parameters.loading_plot.color_levels.length;i++){
                 if(ctrl.parameters.loading_plot.color_levels.length==1){
                   ctrl.parameters.loading_plot.color.push({
                     levels:ctrl.parameters.loading_plot.color_levels[i],
                     option:"rgba(0,0,0,1)"
                   })
                 }else{
                   ctrl.parameters.loading_plot.color.push({
                     levels:ctrl.parameters.loading_plot.color_levels[i],
                     option:color_palette.mpn65[i]
                   })
                 }

               }
             })

             $scope.$watch("ctrl.parameters.loading_plot.shape_by",function(newValue){
               ctrl.parameters.loading_plot.shape_levels = unpack(ooo.f,ctrl.parameters.loading_plot.shape_by).filter(unique)
             })

             ctrl.parameters.loading_plot.pcx_options = []
             for(var i=0; i<oo.loadings.length;i++){
               ctrl.parameters.loading_plot.pcx_options.push({
                 value:i,
                 text:"LV "+(i+1)
               })
             }

             ctrl.parameters.loading_plot.pcy_options=[]
             for(var i=0; i<oo.loadings.length;i++){
               ctrl.parameters.loading_plot.pcy_options.push({
                 value:i,
                 text:"LV "+(i+1)
               })
             }
                 $scope.$watch("ctrl.parameters.loading_plot.shape_levels",function(newValue){
                   ctrl.parameters.loading_plot.shape = []
                   for(var i=0;i<ctrl.parameters.loading_plot.shape_levels.length;i++){
                     ctrl.parameters.loading_plot.shape.push({
                       levels:ctrl.parameters.loading_plot.shape_levels[i],
                       option:shape_palette.ggplot2[i]
                     })
                   }
                 })


                 $scope.$watch("ctrl.parameters.loading_plot",function(newValue){
                   // generate pair loading plot
                  loading_plot_dta = loading_plot(jStat.transpose(oo.loadings)[ctrl.parameters.loading_plot.pcx],jStat.transpose(oo.loadings)[ ctrl.parameters.loading_plot.pcy],"LV"+(ctrl.parameters.loading_plot.pcx+1)+" ("+(oo.variance[ctrl.parameters.loading_plot.pcx]*100).toFixed(2)+"%)", "LV"+(ctrl.parameters.loading_plot.pcx+1)+" ("+(oo.variance[ctrl.parameters.loading_plot.pcy]*100).toFixed(2)+"%)", oo.variance,   unpack(ooo.f,ctrl.parameters.loading_plot.color_by),  unpack(ooo.f,ctrl.parameters.loading_plot.shape_by), unpack(ctrl.parameters.loading_plot.color,"option"), unpack(ctrl.parameters.loading_plot.shape,"option"), unpack(ctrl.parameters.loading_plot.color,"levels"), unpack(ctrl.parameters.loading_plot.shape,"levels"), unpack(ooo.f, 'label'), ctrl.parameters.loading_plot.scatter_size, ctrl.parameters.loading_plot.add_center, ctrl.parameters.loading_plot.ellipse_color, ctrl.parameters.loading_plot.ellipse_shape)
                  Plotly.newPlot('loading_plot', loading_plot_dta.data, loading_plot_dta.layout).then(function(gd){
                    Plotly.toImage(gd,{format:'svg'})
                    .then(
                      function(url)
                       {
                         /*uuu = url
                         uuu = uuu.replace(/^data:image\/svg\+xml,/, '');
                         uuu = decodeURIComponent(uuu);
                         plot_url.loading_plot = btoa(unescape(encodeURIComponent(uuu)))*/

                         uuu = url
                         /*uuu = uuu.replace(/^data:image\/svg\+xml,/, '');
                         uuu = decodeURIComponent(uuu);
                         plot_url.loading_plot = btoa(unescape(encodeURIComponent(uuu)))*/

                         var canvas = document.createElement("canvas");
                          var context = canvas.getContext("2d");
                          canvas.width = 4000;
                          canvas.height = 3000;
                          var image = new Image();
                          context.clearRect ( 0, 0, 4000, 3000 );
                          var imgsrc = 'data:image/svg+xml;base64,'+ btoa(unescape(url.replace("data:image/svg+xml,",""))); // Convert SVG string to data URL

                          var image = new Image();
                          image.onload = function() {
                              context.drawImage(image, 0, 0, 4000, 3000);
                              var img = canvas.toDataURL("image/png");
                              base64 = img.replace("data:image/png;base64,","")
                              plot_url.loading_plot = base64
                          };
                          image.src = imgsrc

                       }
                   )
                  })
                  $("#loading_plot div div")[0].style.margin="0 auto"


                 },true)


            ctrl.pair_score_plot_report = "<p>The pair scores plot shows the projection of each sample on the first five latent variables (LVs).</p><p>The pair scores plot is useful to visualize the relationship between multple LVs and to check outliers, group seperation, etc simultaneously. When you hover each data point, it will show you the sample label of the corresponding sample in your data.</p><p>The first five LCs explained <code>"+(jStat.sum([oo.variance[0],oo.variance[1],oo.variance[2],oo.variance[3],oo.variance[4]])*100).toFixed(2)+"%</code> of the variance, while the rest <code>"+(oo.variance.length-5)+"</code> LVs explained the <code>"+((100-(jStat.sum([oo.variance[0],oo.variance[1],oo.variance[2],oo.variance[3],oo.variance[4]]))*100)).toFixed(2)+"%</code> variance.</p>"
            ctrl.vip_plot_report = "<p>Vip Plot shows the importance of a compound in the model. Usually, a VIP score greater than 1 indicates a possitive contribution to the model. The "+ctrl.parameters.vip_plot.n_vip+" compounds with the hightest VIP score is shown. The direction of change for each compound is given at the right side, with yellow being high intensity, while the dark-blue means the opposite.</p>"



            // generate the sample scores plot
            ctrl.score_plot_report = "<p>The PLS-DA Score Plot shows the projection of each sample on the <code>"+1+"st</code> and <code>"+2+"nd</code> latent variable (LV). These two LVs summarized <code>"+(jStat.sum([oo.variance[0],oo.variance[1]])*100).toFixed(2)+"%</code> of total sample variance.</p><p>The score plot displays the predicting performance of the model (with training data). A separation between clusters indicates a good fitting on the training sample. However, the separation may also because of overfitting, thus Q2 is important to access the predictive performance of PLS-DA.</p>"



            // generate the loading plot
            ctrl.loading_plot_report = "<p>The PLA-DA Loading Plot shows the projection of each compound on the <code>"+1+"st</code> and <code>"+2+"nd</code> latent variable (LC). These two LCs summarized <code>"+(jStat.sum([oo.variance[0],oo.variance[1]])*100).toFixed(2)+"%</code> of total sample variance.</p>"




            // add scores and loadings labels.
            compound_label = unpack(ooo.f,'label')
            sample_label = unpack(ooo.p,'label')
            result_scores = [Array.apply(null, {length: oo.scores[0].length}).map(Number.call, Number).map(x=>x+1).map(x => "LV "+x)].concat(oo.scores)
            result_scores = result_scores.map((x,i) => i===0? ["label"].concat(result_scores[i]) : [sample_label[i-1]].concat(result_scores[i]))
            result_scores = result_scores.map((x,i) => i===0? ["index"].concat(result_scores[i]) : [i].concat(result_scores[i]))

            result_loadings = [Array.apply(null, {length: oo.loadings[0].length}).map(Number.call, Number).map(x=>x+1).map(x => "LV "+x)].concat(oo.loadings)
            result_loadings = result_loadings.map((x,i) => i===0? ["label"].concat(result_loadings[i]) : [compound_label[i-1]].concat(result_loadings[i]))
            result_loadings = result_loadings.map((x,i) => i===0? ["index"].concat(result_loadings[i]) : [i].concat(result_loadings[i]))


            result_vip_table = [Object.keys(oo.vip_table[0])].concat(oo.vip_table.map(x => Object.values(x)))
            ctrl.submit_button_text = "Calculate"
            cfpLoadingBar.complete();
            $scope.$apply()
          })
        }).done(function(){
          console.log("Calculation done.")
        }).fail(function(){
          alert("Error: " + req.responseText)
          ctrl.submit_button_text = "Calculate"
          cfpLoadingBar.complete();
          $scope.$apply()
        }).always(function(){

        });
      }


      ctrl.submit_perm = function(){
         ctrl.submit_perm_button_text = "Calculating"
         var req = ocpu.call("plsda_perm",{
           e:ooo.e,
           p:ooo.p,
           f:ooo.f,
           scale:ctrl.parameters.scale,
           n_perm:ctrl.parameters.n_perm,
           column:ctrl.parameters.column,
           project_id:ctrl.parameters.project_id
         },function(session2){
           ssss = session2
           session2.getObject(function(obj2){
              oooo = obj2
              // initialize all the parameter for perm_plot
              perm_plot_dta = perm_plot(oooo.perm)
              ctrl.perm_plot_report = "<p>The Permutation plot shows the difference between PLS-DA applied on the real data (i.e. your data) and multiple random datasets (i.e. permutately generated). The further the solid dot from the empty dots the better. The permutation test on the R2 is "+jStat.min([oooo.perm_summary[0].pR2Y,1])+" and on the Q2 is "+jStat.min([oooo.perm_summary[0].pQ2,1])+". A p-value less than 0.05 indicates a valid model with little rick of overfitting. Otherwise, it indicates a possible rick of overfitting.</p>"
              $scope.$apply();
              Plotly.newPlot('perm', perm_plot_dta.data, perm_plot_dta.layout).then(function(gd){
                Plotly.toImage(gd,{format:'svg'})
                .then(
                  function(url)
                   {
                     /*uuu = url
                     uuu = uuu.replace(/^data:image\/svg\+xml,/, '');
                     uuu = decodeURIComponent(uuu);
                     plot_url.perm_plot = btoa(unescape(encodeURIComponent(uuu)))*/


                         uuu = url
                         var canvas = document.createElement("canvas");
                          var context = canvas.getContext("2d");
                          canvas.width = 4000;
                          canvas.height = 3000;
                          var image = new Image();
                          context.clearRect ( 0, 0, 4000, 3000 );
                          var imgsrc = 'data:image/svg+xml;base64,'+ btoa(unescape(url.replace("data:image/svg+xml,",""))); // Convert SVG string to data URL

                          var image = new Image();
                          image.onload = function() {
                              context.drawImage(image, 0, 0, 4000, 3000);
                              var img = canvas.toDataURL("image/png");
                              base64 = img.replace("data:image/png;base64,","")
                              plot_url.perm_plot = base64


                          };
                          image.src = imgsrc

                   }
               )
              })
           }).done(function(){
                console.log("Calculation done.")
              }).fail(function(){
                alert("Error: " + req.responseText)
              }).always(function(){
                $scope.$apply(function(){ctrl.submit_perm_button_text = "Perform Permutation Test"})
              });
         })
       }



      ctrl.download = function(){
        var zip = new JSZip();

        for(var i=0;i<Object.keys(plot_url).length;i++){
          zip.file(Object.keys(plot_url)[i]+".png", Object.values(plot_url)[i], {base64: true});
        }
        zip.file("scores.csv",Papa.unparse(result_scores))
        zip.file("loadings.csv",Papa.unparse(result_loadings))
        zip.generateAsync({type:"blob"})
        .then(function (blob) {
            saveAs(blob, "Partial Least Square Discriminant Analysis.zip");
        });


        //download_csv(Papa.unparse(oo.result), "Principal Component Analysis - Result.csv")
      }



      ctrl.save_result = function(){

        // trying to save result. The result must be in a form of [{},{},{}], which is a folder of the tree. In one of the {}, there is a main key indicating that this is the folder node. If the main is not found, then everything will be added to the user clicked node. For all the nodes that are not folder node, must have 'saving_content' and 'content_type' for adding the attachments. Also, these nodes's parent is to be determined by the user click.
var time_stamp = get_time_string()
    to_be_saved_parameters = _.clone(ctrl.parameters)
    to_be_saved_parameters.e = null
    to_be_saved_parameters.f = null
    to_be_saved_parameters.p = null
        to_be_saved =
        [{
          "id":"PLSDA"+time_stamp,
          "parent":undefined,
          "text":"PLS-DA",
          "icon":"fa fa-folder",
          "main":true,
          "analysis_type":"pca",
          "parameters":to_be_saved_parameters
        },
        {
          "id":"scree_plot_"+time_stamp+".png",
          "parent":"PLSDA"+time_stamp,
          "text":"scree plot.png",
          "icon":"fa fa-file-image-o",
          "attachment_id":"scree_plot_"+time_stamp+".png",
          "saving_content":plot_url.scree_plot,
          "content_type":"image/png"
        },
        {
          "id":"pair_score_plot_"+time_stamp+".png",
          "parent":"PLSDA"+time_stamp,
          "text":"pair score plot.png",
          "icon":"fa fa-file-image-o",
          "attachment_id":"pair_score_plot_"+time_stamp+".png",
          "saving_content":plot_url.pair_score_plot,
          "content_type":"image/png"
        },
        {
          "id":"score_plot_"+time_stamp+".png",
          "parent":"PLSDA"+time_stamp,
          "text":"score plot.png",
          "icon":"fa fa-file-image-o",
          "attachment_id":"score_plot_"+time_stamp+".png",
          "saving_content":plot_url.score_plot,
          "content_type":"image/png"
        },{
          "id":"loading_plot_"+time_stamp+".png",
          "parent":"PLSDA"+time_stamp,
          "text":"loading plot.png",
          "icon":"fa fa-file-image-o",
          "attachment_id":"loading_plot_"+time_stamp+".png",
          "saving_content":plot_url.loading_plot,
          "content_type":"image/png"
        },{
          "id":"vip_plot_"+time_stamp+".png",
          "parent":"PLSDA"+time_stamp,
          "text":"VIP score plot.png",
          "icon":"fa fa-file-image-o",
          "attachment_id":"vip_plot_"+time_stamp+".png",
          "saving_content":plot_url.vip_plot,
          "content_type":"image/png"
        },{
          "id":"sample_scores"+time_stamp+".csv",
          "parent":"PLSDA"+time_stamp,
          "text":"sample scores.csv",
          "icon":"fa fa-file-excel-o",
          "attachment_id":"sample_scores_"+time_stamp+".csv",
          "saving_content":btoa(unescape(encodeURIComponent(Papa.unparse(result_scores)))),
          "content_type":"application/vnd.ms-excel"
        },{
          "id":"compound_loadings"+time_stamp+".csv",
          "parent":"PLSDA"+time_stamp,
          "text":"compound loadings.csv",
          "icon":"fa fa-file-excel-o",
          "attachment_id":"compound_loadings_"+time_stamp+".csv",
          "saving_content":btoa(unescape(encodeURIComponent(Papa.unparse(result_loadings)))),
          "content_type":"application/vnd.ms-excel"
        }]

        if(typeof(plot_url.perm_plot) !== "undefined"){
          to_be_saved.push({
          "id":"permutation_plot_"+time_stamp+".png",
          "parent":"PLSDA"+time_stamp,
          "text":"permutation plot.png",
          "icon":"fa fa-file-image-o",
          "attachment_id":"permutation_plot_"+time_stamp+".png",
          "saving_content":plot_url.perm_plot,
          "content_type":"image/png"
          })
        }

        mainctrl.save_result_modal(to_be_saved)
      }

	})



















