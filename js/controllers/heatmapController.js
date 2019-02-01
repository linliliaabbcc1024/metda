angular
    .module('blankapp').controller("heatmapController", function($scope, $rootScope, Upload, $timeout, $mdToast){
      ctrl = this;


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

      ctrl.label = 'Choose a Color'

      ctrl.shape_by_options = shape_by_options
      ctrl.scale_options = scale_options
      ctrl.color_scale_options = color_scale_options
      ctrl.order_sample_by_options = ["as is","dendrogram"]
      ctrl.order_compound_by_options = ["as is","dendrogram",]

      var parameters;
      // !!!! add other ctrl initials.
      ctrl.make_data_read_here = function(obj){
        make_data_ready(obj)
        ctrl.parameters.order_sample = "dendrogram"
        ctrl.parameters.order_compound = "dendrogram"
        ctrl.sample_annotation_options = Object.keys(ooo.p[0])
        ctrl.order_sample_by_options = ctrl.order_sample_by_options.concat(Object.keys(ooo.p[0])).filter(unique)

        ctrl.sample_level_options = {}
        for(var i=0; i<ctrl.sample_annotation_options.length;i++){
          ctrl.sample_level_options[ctrl.sample_annotation_options[i]] = unpack(ctrl.parameters.p,ctrl.sample_annotation_options[i]).filter(unique)
        }
        ctrl.compound_annotation_options = Object.keys(ooo.f[0])
        ctrl.order_compound_by_options = ctrl.order_compound_by_options.concat(Object.keys(ooo.f[0])).filter(unique)

        ctrl.compound_level_options = {}
        for(var i=0; i<ctrl.compound_annotation_options.length;i++){
          ctrl.compound_level_options[ctrl.compound_annotation_options[i]] = unpack(ctrl.parameters.f,ctrl.compound_annotation_options[i]).filter(unique)
        }

        // !!!! make all the parameters ready here.
        p_column_names = Object.keys(ooo.p[0])
        f_column_names = Object.keys(ooo.f[0])
        parameters = JSON.parse(localStorage.getItem('parameters'));


        ctrl.parameters.order_sample_by = parameters.heatmap.order_sample_by.map(x=>ctrl.order_sample_by_options.includes(x)).every(x=>x===true)?parameters.heatmap.order_sample_by:['dendrogram']
        ctrl.parameters.order_compound_by = parameters.heatmap.order_compound_by.map(x=>ctrl.order_compound_by_options.includes(x)).every(x=>x===true)?parameters.heatmap.order_compound_by:['dendrogram']


        ctrl.parameters.order_sample_levels = parameters.heatmap.order_sample_levels
        $scope.$watch("ctrl.parameters.order_sample_by",function(){
          ctrl.parameters.order_sample_levels = {}
          for( var i=0; i<ctrl.parameters.order_sample_by.length;i++){
            if(ctrl.parameters.order_sample_by[i]!=='as is' && ctrl.parameters.order_sample_by[i]!=='dendrogram'){

            if(parameters.heatmap.order_sample_levels[ctrl.parameters.order_sample_by[i]]===undefined){
                ctrl.parameters.order_sample_levels[ctrl.parameters.order_sample_by[i]] = unpack(ooo.p, ctrl.parameters.order_sample_by[i]).filter(unique).join("||");
            }else{
              ctrl.parameters.order_sample_levels[ctrl.parameters.order_sample_by[i]] = parameters.heatmap.order_sample_levels[ctrl.parameters.order_sample_by[i]].split("||").map(x=>unpack(ooo.p, ctrl.parameters.order_sample_by[i]).filter(unique).includes(x)).every(x=>x===true)?parameters.heatmap.order_sample_levels[ctrl.parameters.order_sample_by[i]]:unpack(ooo.p, ctrl.parameters.order_sample_by[i]).filter(unique).join("||");
              }
            }else{
              ctrl.parameters.order_sample_levels = {}
            }
          }
        })





        ctrl.parameters.order_compound_levels = parameters.heatmap.order_compound_levels
        $scope.$watch("ctrl.parameters.order_compound_by",function(){
          ctrl.parameters.order_compound_levels = {}
          for( var i=0; i<ctrl.parameters.order_compound_by.length;i++){
            if(ctrl.parameters.order_compound_by[i]!=='as is' && ctrl.parameters.order_compound_by[i]!=='dendrogram'){
            if(parameters.heatmap.order_compound_levels[ctrl.parameters.order_compound_by[i]]===undefined){
                ctrl.parameters.order_compound_levels[ctrl.parameters.order_compound_by[i]] = unpack(ooo.p, ctrl.parameters.order_compound_by[i]).filter(unique).join("||");
            }else{
              ctrl.parameters.order_compound_levels[ctrl.parameters.order_compound_by[i]] = parameters.heatmap.order_compound_levels[ctrl.parameters.order_compound_by[i]].split("||").map(x=>unpack(ooo.p, ctrl.parameters.order_compound_by[i]).filter(unique).includes(x)).every(x=>x===true)?parameters.heatmap.order_compound_levels[ctrl.parameters.order_compound_by[i]]:unpack(ooo.p, ctrl.parameters.order_compound_by[i]).filter(unique).join("||");
              } }
          }
        })



        ctrl.parameters.scale = parameters.heatmap.scale
        ctrl.parameters.high_color = parameters.heatmap.high_color
        ctrl.parameters.mid_color = parameters.heatmap.mid_color
        ctrl.parameters.low_color = parameters.heatmap.low_color
        ctrl.parameters.alpha_color = parameters.heatmap.alpha_color
        ctrl.parameters.colorscale = parameters.heatmap.colorscale

        ctrl.parameters.height = parameters.heatmap.height
        ctrl.parameters.width = parameters.heatmap.width
        ctrl.parameters.top = parameters.heatmap.top
        ctrl.parameters.right = parameters.heatmap.right
        ctrl.parameters.bottom = parameters.heatmap.bottom
        ctrl.parameters.left = parameters.heatmap.left

        ctrl.parameters.sample_annotation_height = parameters.heatmap.sample_annotation_height
        ctrl.parameters.sample_tree_height = parameters.heatmap.sample_tree_height

        ctrl.parameters.compound_annotation_height = parameters.heatmap.compound_annotation_height
        ctrl.parameters.compound_tree_height = parameters.heatmap.compound_tree_height

        ctrl.parameters.show_sample_label = parameters.heatmap.show_sample_label
        ctrl.parameters.show_compound_label = parameters.heatmap.show_compound_label

        ctrl.parameters.sample_annotations = []
        for(var i = 0; i < parameters.heatmap.sample_annotations.length;i++){
            if(p_column_names.includes(parameters.heatmap.sample_annotations[i].column)){
              ctrl.parameters.sample_annotations.push(
                parameters.heatmap.sample_annotations[i]
              )
            }
          }

        ctrl.parameters.compound_annotations = []
        for(var i = 0; i < parameters.heatmap.compound_annotations.length;i++){
            if(p_column_names.includes(parameters.heatmap.compound_annotations[i].column)){
              ctrl.parameters.compound_annotations.push(
                parameters.heatmap.compound_annotations[i]
              )
            }
          }

        $scope.$watch("ctrl.parameters",function(newValue, oldValue){
          parameters.heatmap.scale = ctrl.parameters.scale
          parameters.heatmap.high_color = ctrl.parameters.high_color
          parameters.heatmap.mid_color = ctrl.parameters.mid_color
          parameters.heatmap.low_color = ctrl.parameters.low_color
          parameters.heatmap.alpha_color = ctrl.parameters.alpha_color
          parameters.heatmap.colorscale = ctrl.parameters.colorscale
          parameters.heatmap.sample_annotations = ctrl.parameters.sample_annotations

          parameters.heatmap.height = ctrl.parameters.height
          parameters.heatmap.width = ctrl.parameters.width
          parameters.heatmap.top = ctrl.parameters.top
          parameters.heatmap.right = ctrl.parameters.right
          parameters.heatmap.bottom = ctrl.parameters.bottom
          parameters.heatmap.left = ctrl.parameters.left

          parameters.heatmap.sample_annotation_height = ctrl.parameters.sample_annotation_height
          parameters.heatmap.sample_tree_height = ctrl.parameters.sample_tree_height

          parameters.heatmap.show_sample_label = ctrl.parameters.show_sample_label
          parameters.heatmap.show_compound_label = ctrl.parameters.show_compound_label

          parameters.heatmap.compound_annotation_height = ctrl.parameters.compound_annotation_height
          parameters.heatmap.compound_tree_height = ctrl.parameters.compound_tree_height

          parameters.heatmap.order_sample_by = ctrl.parameters.order_sample_by
          parameters.heatmap.order_compound_by = ctrl.parameters.order_compound_by


          parameters.heatmap.order_sample_levels = ctrl.parameters.order_sample_levels
          parameters.heatmap.order_compound_levels = ctrl.parameters.order_compound_levels


          localStorage.setItem('parameters', JSON.stringify(parameters));
        },true)


        ctrl.add_sample_annotation = function(){
          ctrl.parameters.sample_annotations.push({
            column:ctrl.sample_annotation_options[0],
            type:'character',
            colors:Array(ctrl.sample_level_options[ctrl.sample_annotation_options[0]].length).fill('black')
          })
        }
        ctrl.remove_sample_annotation = function(){
          ctrl.parameters.sample_annotations.pop()
        }

        ctrl.add_compound_annotation = function(){
          ctrl.parameters.compound_annotations.push({
            column:ctrl.compound_annotation_options[0],
            type:'character',
            colors:Array(ctrl.compound_level_options[ctrl.compound_annotation_options[0]].length).fill('black')
          })
        }
        ctrl.remove_compound_annotation = function(){
          ctrl.parameters.compound_annotations.pop()
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
        ctrl.parameters.fun_name = "heatmap"

        var req = ocpu.call("call_fun",{parameters:ctrl.parameters},function(session){
          sss = session
          session.getObject(function(obj){
            oo = obj
            make_heatmap = function(dta){
              ddd = dta
              if(ctrl.parameters.order_sample_by.includes('as is')){
                sample_order = sequence(from=0,to=ooo.p.length-1)
                show_sample_dendrogram = false
              }else if(ctrl.parameters.order_sample_by.includes('dendrogram')){
                sample_order = oo.hc_row_order
                show_sample_dendrogram = true
              }else{
                var num_sample = ooo.p.length
                var keys = Object.keys(ctrl.parameters.order_sample_levels)
                var values = Object.values(ctrl.parameters.order_sample_levels)
                var num_order = Array(num_sample).fill(0)
                for(var i=0; i<keys.length;i++){
                  var levels = unpack(ooo.p,keys[i])
                  var ordered_levels = values[i].split("||")
                  for(var j=0; j<ordered_levels.length;j++){
                    var target_index = getAllIndexes(levels, ordered_levels[j])
                    for(var k=0;k<target_index.length;k++){
                      num_order[target_index[k]] = num_order[target_index[k]]+j
                    }
                  }
                  num_order = num_order.map(x=>x * (keys.length-i)*1000)
                }
                num_order = num_order.map((x,i)=>x+i/num_sample)
                var ordered_num_order = sort(num_order)
                sample_order = ordered_num_order.map(x=>num_order.indexOf(x))
                show_sample_dendrogram = false
              }


              if(ctrl.parameters.order_compound_by.includes('as is')){
                compound_order = sequence(from=0,to=ooo.f.length-1)
                show_compound_dendrogram = false
              }else if(ctrl.parameters.order_compound_by.includes('dendrogram')){
                compound_order = oo.hc_col_order
                show_compound_dendrogram = true
              }else{
                var num_compound = ooo.f.length
                var keys = Object.keys(ctrl.parameters.order_compound_levels)
                var values = Object.values(ctrl.parameters.order_compound_levels)
                var num_order = Array(num_compound).fill(0)
                for(var i=0; i<keys.length;i++){
                  var levels = unpack(ooo.f,keys[i])
                  var ordered_levels = values[i].split("||")
                  for(var j=0; j<ordered_levels.length;j++){
                    var target_index = getAllIndexes(levels, ordered_levels[j])
                    for(var k=0;k<target_index.length;k++){
                      num_order[target_index[k]] = num_order[target_index[k]]+j
                    }
                  }
                  num_order = num_order.map(x=>x * (keys.length-i)*1000)
                }
                num_order = num_order.map((x,i)=>x+i/num_compound)
                var ordered_num_order = sort(num_order)
                compound_order = ordered_num_order.map(x=>num_order.indexOf(x))
                show_compound_dendrogram = false
              }


              var heatmap_z = compound_order.map(x=>dta[x]).map(x=>sample_order.map(y=>x[y]))
              var sample_label = unpack(ooo.p,"label")
              var compound_label = unpack(ooo.f,"label")
              var heatmap_x=Array.apply(null, {length: dta[0].length}).map(Number.call, Number)
              var heatmap_y=Array.apply(null, {length: dta.length}).map(Number.call, Number)
              var heatmap_x_text = sample_order.map(x=>sample_label[x])
              var heatmap_y_text = compound_order.map(x=>compound_label[x])
              var heatmap_trace = {
                x:heatmap_x,
                y:heatmap_y,
                z:heatmap_z,
                type:"heatmap",
                showscale:true,
                colorbar:{
                  thicknessmode:"fraction",
                  thickness:0.01,
                  lenmode:"fraction",
                  len:0.3,
                  outlinecolor:"white",
                  nticks:2,
                  ticklen:0,
                  tickvals:[oo.min[0],oo.median[0],oo.max[0]],
                  ticktext:["low","median","high"],
                  tickcolor:"black",
                  tickfont:{
                    family:"Dorid Sans",
                    color:"black",
                    size:10
                  }
                },
                //autocolorscale:false,
                colorscale:ctrl.parameters.colorscale,
                showlegend:false,
                xaxis:"x",
                yaxis:"y",
                hoverinfo:"text",
                name:"",
                xgap:1,
                ygap:1
              }
              if(show_sample_dendrogram){
                var sample_dendro_trace ={
                  x:oo.sx,
                  y:oo.sy,
                  text:"",
                  type:"scatter",
                  mode:"lines",
                  line:{
                    width:1,
                    color:"black",
                    dash:"solid"
                  },
                  hoveron:"points",
                  showlegend:false,
                  xaxis:"x2",
                  yaxis:"y2",
                  hoverinfo:"skip",
                  name:""
              }
              }
              if(show_compound_dendrogram){
                var compound_dendro_trace ={
                  x:oo.cx,
                  y:oo.cy,
                  text:"",
                  type:"scatter",
                  mode:"lines",
                  line:{
                    width:1,
                    color:"black",
                    dash:"solid"
                  },
                  hoveron:"points",
                  showlegend:false,
                  xaxis:"x3",
                  yaxis:"y3",
                  hoverinfo:"skip",
                  name:""
              }
              }


              sample_annotation_traces = []
              for(var i = 0; i<ctrl.parameters.sample_annotations.length;i++){
                var temp_z = unpack(ooo.p, ctrl.parameters.sample_annotations[i].column)
                var temp_color_scale = []
                for(var j = 0; j < ctrl.sample_level_options[ctrl.parameters.sample_annotations[i].column].length; j++){
                  if((ctrl.sample_level_options[ctrl.parameters.sample_annotations[i].column].length-1)===0){
                    temp_color_scale[j] = [0,ctrl.parameters.sample_annotations[i].colors[j]]
                    temp_color_scale[j+1] = [1,ctrl.parameters.sample_annotations[i].colors[j]]
                  }else{
                    temp_color_scale[j] = [j/(ctrl.sample_level_options[ctrl.parameters.sample_annotations[i].column].length-1),ctrl.parameters.sample_annotations[i].colors[j]]
                  }

                }
                sample_annotation_traces[i] = {
                  x:heatmap_x,
                  //y:Array.apply(0, Array(heatmap_x.length)).map(function() { return 0; }),
                  y:[0],
                  z:[sample_order.map(x=>temp_z[x]).map(x=>ctrl.sample_level_options[ctrl.parameters.sample_annotations[i].column].indexOf(x))],
                  type:"heatmap",
                  showscale:false,
                  colorscale:temp_color_scale,
                  autocolorscale:false,
                  showlegend:false,
                  xaxis:"x"+(i+4),
                  yaxis:"y"+(i+4),
                  hoverinfo:"text",
                  name:"",
                  xgap:1,
                  ygap:1,
                  zmin:0,
                  zmax:jStat.max(sample_order.map(x=>temp_z[x]).map(x=>ctrl.sample_level_options[ctrl.parameters.sample_annotations[i].column].indexOf(x)))
                }
              }

              var sample_tree_height = ctrl.parameters.sample_tree_height
              var sample_tree_ratio = 1-(sample_tree_height/ctrl.parameters.height)

              //var height_of_cell = (sample_tree_ratio*ctrl.parameters.height)/dta.length
              var height_of_sample_annotation = ctrl.parameters.sample_annotation_height
              var mid_yrang_from = Array.apply(null, {length: ctrl.parameters.sample_annotations.length}).map(Function.call, Number).map(x=>x+1).reverse().map(x=>x*height_of_sample_annotation).map(x=>ctrl.parameters.height*sample_tree_ratio-x).map(x=>x/ctrl.parameters.height)


              var yrange_from = [0].concat(mid_yrang_from).concat([sample_tree_ratio])
              var yrange_to = mid_yrang_from.concat([sample_tree_ratio,1])

              compound_annotation_traces = []
              for(var i = 0; i<ctrl.parameters.compound_annotations.length;i++){
                var temp_z = unpack(ooo.f, ctrl.parameters.compound_annotations[i].column)
                var temp_color_scale = []
                for(var j = 0; j < ctrl.compound_level_options[ctrl.parameters.compound_annotations[i].column].length; j++){
                  if((ctrl.compound_level_options[ctrl.parameters.compound_annotations[i].column].length-1)===0){
                    temp_color_scale[j] = [0,ctrl.parameters.compound_annotations[i].colors[j]]
                    temp_color_scale[j+1] = [1,ctrl.parameters.compound_annotations[i].colors[j]]
                  }else{
                    temp_color_scale[j] = [j/(ctrl.compound_level_options[ctrl.parameters.compound_annotations[i].column].length-1),ctrl.parameters.compound_annotations[i].colors[j]]
                  }

                }
                compound_annotation_traces[i] = {
                  x:[0],
                  //y:Array.apply(0, Array(heatmap_x.length)).map(function() { return 0; }),
                  y:heatmap_y,
                  z:compound_order.map(x=>temp_z[x]).map(x=>[ctrl.compound_level_options[ctrl.parameters.compound_annotations[i].column].indexOf(x)]),
                  type:"heatmap",
                  showscale:false,
                  colorscale:temp_color_scale,
                  autocolorscale:false,
                  showlegend:false,
                  xaxis:"x"+(i+4+ctrl.parameters.sample_annotations.length),
                  yaxis:"y"+(i+4+ctrl.parameters.sample_annotations.length),
                  hoverinfo:"text",
                  name:"",
                  xgap:1,
                  ygap:1,
                  zmin:0,
                  zmax:jStat.max(compound_order.map(x=>temp_z[x]).map(x=>ctrl.compound_level_options[ctrl.parameters.compound_annotations[i].column].indexOf(x)))
                }
              }

              var compound_tree_height = ctrl.parameters.compound_tree_height
              var compound_tree_ratio = 1-(compound_tree_height/ctrl.parameters.width)

              //var height_of_cell = (compound_tree_ratio*ctrl.parameters.height)/dta.length
              var height_of_compound_annotation = ctrl.parameters.compound_annotation_height
              var mid_xrang_from = Array.apply(null, {length: ctrl.parameters.compound_annotations.length}).map(Function.call, Number).map(x=>x+1).reverse().map(x=>x*height_of_compound_annotation).map(x=>ctrl.parameters.width*compound_tree_ratio-x).map(x=>x/ctrl.parameters.width)


              var xrange_from = [0].concat(mid_xrang_from).concat([compound_tree_ratio])
              var xrange_to = mid_xrang_from.concat([compound_tree_ratio,1])

              /*var xrange_from = [0,0.9]
              var xrange_to = [0.9,1]*/

              var layout={
                margin:{
                  t:ctrl.parameters.top,
                  r:ctrl.parameters.right,
                  b:ctrl.parameters.bottom,
                  l:ctrl.parameters.left
                },
                plot_bgcolor:"white",
                paper_bgcolor:"white",
                font:{
                  color:"rgba(0,0,0,1)",
                  family:"Dorid Sans",
                  size:15
                },
                xaxis3:{
                  showgrid: false,
                  zeroline: false,
                  showline: false,
                  autotick: true,
                  ticks: '',
                  showticklabels: false,
                  domain:[xrange_from[xrange_from.length-1],xrange_to[xrange_to.length-1]]
                },
                yaxis3:{
                  autorange: false,
                  range:[0.25,jStat.max(heatmap_y)+1.5],
                  showgrid: false,
                  zeroline: false,
                  showline: false,
                  autotick: true,
                  ticks: '',
                  showticklabels: false,
                  domain:[yrange_from[0],yrange_to[0]]
                },
                xaxis2:{
                  autorange: false,
                  range:[0.5,jStat.max(heatmap_x)+1.5],
                  showgrid: false,
                  zeroline: false,
                  showline: false,
                  autotick: true,
                  ticks: '',
                  showticklabels: false,
                  domain:[xrange_from[0],xrange_to[0]]
                },
                yaxis2:{
                  autorange: true,
                  showgrid: false,
                  zeroline: false,
                  showline: false,
                  autotick: true,
                  ticks: '',
                  showticklabels: false,
                  domain:[yrange_from[yrange_from.length-1],yrange_to[yrange_to.length-1]]
                },
                xaxis:{
                  autorange: false,
                  range:[-0.5,jStat.max(heatmap_x)+0.5],
                  type:"linear",
                  tickmode:"array",
                  domain:[xrange_from[0],xrange_to[0]],
                  tickvals:heatmap_x,
                  ticktext:heatmap_x_text,
                  tickcolor:'black',
                  tickwidth:1,
                  ticklen:ctrl.parameters.show_sample_label?5:0,
                  tickfont:{
                    color:"black",
                    family:"Dorid Sans",
                    size:12
                  },
                  tickangle:90,
                  showline:false,
                  showgrid:false,
                  zeroline:false,
                  title:"",
                  titlefont:{
                    color:"black",
                    family:"Dorid Sans",
                    size:15
                  },
                  showticklabels:ctrl.parameters.show_sample_label
                },
                yaxis:{
                  type:"linear",
                  tickmode:"array",
                  domain:[yrange_from[0],yrange_to[0]],
                  tickvals:heatmap_y,
                  ticktext:heatmap_y_text,
                  tickcolor:'black',
                  tickwidth:1,
                  ticklen:ctrl.parameters.show_compound_label?5:0,
                  tickfont:{
                    color:"black",
                    family:"Dorid Sans",
                    size:12
                  },
                  tickangle:0,
                  showline:false,
                  showgrid:false,
                  zeroline:false,
                  title:"",
                  titlefont:{
                    color:"black",
                    family:"Dorid Sans",
                    size:15
                  },
                  showticklabels:ctrl.parameters.show_compound_label
                },
                showlegend:false,
                hovermode:"closest",
                barmode:"relative",
                height:ctrl.parameters.height,
                width:ctrl.parameters.width
              }
              //sample_annotation_layout = {}
              for(var i = 0; i<ctrl.parameters.sample_annotations.length;i++){
                layout["xaxis"+(i+4)]={
                  autorange:false,
                  range:[-0.5,jStat.max(heatmap_x)+0.5],
                  type:"linear",
                  tickmode:"array",
                  domain:[xrange_from[0],xrange_to[0]],
                  ticklen:0,
                  showticklabels:false,
                  showline:false,
                  showgrid:false,
                  zeroline:false,
                  title:""
                }
                layout["yaxis"+(i+4)]={
                  autorange:false,
                  range:[-0.5,0],
                  type:"linear",
                  tickmode:"array",
                  domain:[yrange_from[i+1],yrange_to[i+1]],
                  ticklen:0,
                  tickvals:[-0.25],
                  ticktext:[ctrl.parameters.sample_annotations[i].column],
                  showline:false,
                  showgrid:false,
                  zeroline:false,
                  title:""
                }
              }
              //compound_annotation_layout = {}
              for(var i = 0; i<ctrl.parameters.compound_annotations.length;i++){
                layout["xaxis"+(i+4+ctrl.parameters.sample_annotations.length)]={
                  autorange:false,
                  range:[-0.5,0],
                  type:"linear",
                  tickmode:"array",
                  domain:[xrange_from[i+1],xrange_to[i+1]],
                  ticklen:0,
                  tickvals:[-0.25],
                  ticktext:[ctrl.parameters.compound_annotations[i].column],
                  tickangle:90,
                  showline:false,
                  showgrid:false,
                  zeroline:false,
                  title:""
                }
                layout["yaxis"+(i+4+ctrl.parameters.sample_annotations.length)]={
                  autorange:true,
                  //range:[0.25,jStat.max(heatmap_y)+1.5],
                  type:"linear",
                  tickmode:"array",
                  domain:[yrange_from[0],yrange_to[0]],
                  ticklen:0,
                  showticklabels:false,
                  showline:false,
                  showgrid:false,
                  zeroline:false,
                  title:""
                }
              }

              plot_data = [heatmap_trace]
              if(show_sample_dendrogram){
                plot_data = plot_data.concat(sample_dendro_trace)
              }
              if(show_compound_dendrogram){
                plot_data = plot_data.concat(compound_dendro_trace)
              }

              plot_data = plot_data.concat(sample_annotation_traces).concat(compound_annotation_traces)
              //var plot_layout = {...layout,...sample_annotation_layout}

              //plot_data = [heatmap_trace,sample_dendro_trace,compound_dendro_trace]
              plot_layout = layout
              plot_url = {}
              Plotly.newPlot('heatmap', plot_data, plot_layout).then(function(gd){
                    Plotly.toImage(gd,{format:'svg'})
                    .then(
                      function(url)
                       {
                         uuuu = url
                         var canvas = document.createElement("canvas");
                          var context = canvas.getContext("2d");
                          canvas.width = ctrl.parameters.width;
                          canvas.height = ctrl.parameters.height;
                          var image = new Image();
                          context.clearRect ( 0, 0, ctrl.parameters.width, ctrl.parameters.height );
                          var imgsrc = 'data:image/svg+xml;base64,'+ btoa(unescape(url.replace("data:image/svg+xml,",""))); // Convert SVG string to data URL

                          var image = new Image();
                          image.onload = function() {
                              context.drawImage(image, 0, 0, ctrl.parameters.width, ctrl.parameters.height);
                              var img = canvas.toDataURL("image/png");
                              base64 = img.replace("data:image/png;base64,","")
                              plot_url.heatmap_plot = base64
                          };
                          image.src = imgsrc

                       })
              })
            }

            $scope.$watch("ctrl.parameters",function(newValue, oldValue){
              console.log("!")
              make_heatmap(oo.temp_data)
            },true)

           $scope.$apply();
          }).then(function(){
            plot_url = []
            ctrl.plot_parameters = {}

            ctrl.heatmap_report = "Heatmap report"
            ctrl.submit_button_text = "Calculate"
            $scope.$apply()
          })
        }).done(function(){
          console.log("Calculation done.")
          ctrl.submit_button_text = "Calculate"
        }).fail(function(){
          alert("Error: " + req.responseText)
        });
      }

      ctrl.download = function(){
        var zip = new JSZip();
        for(var i=0;i<Object.keys(plot_url).length;i++){
          zip.file(Object.keys(plot_url)[i]+".png", Object.values(plot_url)[i], {base64: true});
        }

        zip.generateAsync({type:"blob"})
        .then(function (blob) {
            saveAs(blob, "Heatmap - Plots.zip");
        })
      }

      ctrl.save_result = function(){
        var time_stamp = get_time_string()
    to_be_saved_parameters = _.clone(ctrl.parameters)
    to_be_saved_parameters.e = null
    to_be_saved_parameters.f = null
    to_be_saved_parameters.p = null
        var to_be_saved =
        [{
          "id":"heatmap_dataset_"+time_stamp,
          "parent":undefined,
          "text":"Heatmap",
          "icon":"fa fa-folder",
          "main":true,
          "analysis_type":"heatmap",
          "parameters":to_be_saved_parameters
        },{
          "id":"heatmap_plot_"+time_stamp+".png",
          "parent":"heatmap_dataset_"+time_stamp,
          "text":"Heatmap.png",
          "icon":"fa fa-file-image-o",
          "attachment_id":"heatmap_plot_"+time_stamp+".png",
          "saving_content":plot_url.heatmap_plot,
          "content_type":"image/png"
        }]

        mainctrl.save_result_modal(to_be_saved)

      }

	})






























