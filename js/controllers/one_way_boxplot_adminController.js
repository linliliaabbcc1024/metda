angular
    .module('blankapp').controller("one_way_boxplot_adminController", function($scope, $rootScope, $timeout, $mdToast){

      height_ratio = 1
      width_ratio = 1


      y = JSON.parse(localStorage.getItem('one_way_boxplot_y'));
      texts = JSON.parse(localStorage.getItem('one_way_boxplot_texts'));
      names = JSON.parse(localStorage.getItem('one_way_boxplot_names'));

      if(y === null || names === null || texts === null){
          y = Array.apply(null, {length: 20}).map(Number.call, Number)
          y[0] = -15
          texts = [y.map(x=>"x1"+x),y.map(x=>"x2"+x),y.map(x=>"x3"+x)]
          y = [y,y,y]
          x_text = ["x1","x2","x3"]
          names = ["x1","x2","x3"]
      }else{
        x_text = names
      }






      ctrl = this;


      ctrl.style_options

      ctrl.symbol_options = [{
        id:'circle',
        text:"Circle"
      },{
        id:"square",
        text:"Square"
      }]
      ctrl.family_options = [{
          id:"Dorid Sans",
          text:"Dorid Sans"
        },{
          id:"Arial",
          text:"Arial"
      }]

      ctrl.color_palette_options = ['user_define'].concat(Object.keys(color_palette)).map(function(x){
        return({id:x,text:x})
      })


      ctrl.one_way_boxplot_styles = {}


      boxplot_parameters_fixed = {}
      boxplot_parameters_fixed.data = {
        type:"box",
        hoverinfo:"text",
        hoveron:"boxes+points",
        xaxis:"x",
        yaxis:"y"
      }
      boxplot_parameters_fixed.layout = {
        autosize:false,
        separators:",",
        hidesources:true,
        hovermode:"closest",
        hoverdistance:1,
        spikedistance:1,
        xaxis:{
          domain:[0,1]
        },
        yaxis:{
          domain:[0,1]
        }
      }
      ctrl.one_way_boxplot_styles.selected = "default"




      var plot_style_db = new PouchDB('http://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/plot_styles');
      plot_style_db.get("one_way_boxplot").then(function(doc){
        ddd = doc

        ctrl.style_options = Object.keys(ddd.style)
        ctrl.one_way_boxplot_styles = ddd.style
        ctrl.one_way_boxplot_styles.selected = ddd.selected

        $scope.$watch('ctrl.one_way_boxplot_styles',function(){
          ctrl.update_plot()
          ctrl.update_style_modal = function(){
            var c = confirm("Are you sure you want to overwite the style "+ctrl.one_way_boxplot_styles.selected+"?");
            if(c){
              var plot_style_db = new PouchDB('http://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/plot_styles');
              plot_style_db.get("one_way_boxplot").then(function(doc){
                doc.selected = ctrl.one_way_boxplot_styles.selected
                doc.style[doc.selected] = ctrl.one_way_boxplot_styles[doc.selected]
                plot_style_db.put(doc).then(function(){
                  console.log('Style '+doc.selected+" is updated.")
                })
              })
            }else{
              console.log("Update is cancelded.")
            }


        }
          ctrl.create_new_style_modal = function(){
            var new_name = prompt("Input a New Name.");

            if(new_name === null){
              console.log("Canceled.")
            }else{
              var plot_style_db = new PouchDB('http://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/plot_styles');
              plot_style_db.get("one_way_boxplot").then(function(doc){
                if(Object.keys(ddd.style).includes(new_name)){
                  alert("The name "+new_name+ " is taken.")
                }else{
                  doc.style[new_name] = doc.style.default
                  ctrl.one_way_boxplot_styles[new_name] = doc.style.default
                  ctrl.style_options.push(new_name)
                  ctrl.one_way_boxplot_styles.selected = new_name
                  doc.selected = ctrl.one_way_boxplot_styles.selected
                  plot_style_db.put(doc).then(function(){
                    console.log("The new style "+doc.selected+" is created.")
                  })
                }
              })
            }
          }
          ctrl.delete_style_modal = function(){
            var c = confirm("Are you sure to delete "+ctrl.one_way_boxplot_styles.selected+"?");
            if(c){
              var plot_style_db = new PouchDB('http://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/plot_styles');
              plot_style_db.get("one_way_boxplot").then(function(doc){
                doc.selected = ctrl.one_way_boxplot_styles.selected
                delete doc.style[doc.selected]
                plot_style_db.put(doc).then(function(){
                  console.log('Style '+doc.selected+" is deleted.")
                  ctrl.style_options.splice(ctrl.style_options.indexOf(ctrl.one_way_boxplot_styles.selected), 1);
                  ctrl.one_way_boxplot_styles.selected = 'default'

                })
              })
            }else{

            }
          }
        },true)


      })





      /*ctrl.one_way_boxplot_styles[ctrl.one_way_boxplot_styles.selected] = {}
      ctrl.one_way_boxplot_styles[ctrl.one_way_boxplot_styles.selected].global = { // the value here will adjust the value of .data
        whiskerwidth:0.5,
        notched:false,
        notchwidth:0.25,//[0,0.5]
        boxpoints:"all",//["all","outliers","suspectedoutliers",false]
        boxmean:true, //[true,"sd",false]
        jitter:0.25,//[0,1]
        pointpos:0,//[-2,2]
        orientation:"v",//["v","h"]
        marker:{
          outliercolor:"mpn65",
          outliercolor_user_define:"rgba(0,0,0,1)",
          outliercolor_alpha:1,
          color:"mpn65",
          color_user_define:"rgba(0,0,0,1)",
          color_alpha:0.3,
          symbol:"circle",
          size:6 ,
          line:{
            color:"mpn65",
            color_user_define:"rgba(0,0,0,1)",
            color_alpha:1,
            width:1
          }
        },
        line:{
          color:"mpn65",
          color_user_define:"rgba(0,0,0,1)",
          color_alpha:1,
          width:1
        },
        fillcolor:"mpn65",
        fillcolor_user_define:"rgba(0,0,0,1)",
        fillcolor_alpha:0.3
      }
      ctrl.one_way_boxplot_styles[ctrl.one_way_boxplot_styles.selected].layout = {
        font:{
          family:"Dorid Sans",
          size:12,
          color:"rgba(0,0,0,1)"
        },
        width:400,
        height:300,
        margin:{
          l:80,
          r:80,
          t:100,
          b:80,
          pad:0,
          autoexpand:false
        },
        paper_bgcolor:"rgba(200,200,200,1)",
        plot_bgcolor:"rgba(100,100,100,1)",
        showlegend:true,
        xaxis:{
          visiable:true,
          color:"rgba(0,0,0,1)",
          title:"<b>xaxis title</b>",
          titlefont:{
            family:"Dorid Sans",
            size:12,
            color:"rgba(0,0,0,1)"
          },
          ticklen:5,
          tickwidth:1,
          tickcolor:"rgba(0,0,0,1)",
          tickfont:{
            family:"Dorid Sans",
            size:12,
            color:"rgba(0,0,0,1)"
          },
          tickangle:0,
          showline:true,
          linecolor:"rgba(0,0,0,1)",
          linewidth:1,
          showgrid:true,
          gridcolor:"rgba(100,100,100,1)",
          gridwidth:1,

          showticklabels:true,
          automargin:false,
          side:"bottom"
        },
        yaxis:{
          visiable:true,
          color:"rgba(0,0,0,1)",
          /*title:"<b>yaxis title</b>",
          titlefont:{
            family:"Dorid Sans",
            size:12 ,
            color:"rgba(0,0,0,1)"
          },
          ticklen:5,
          tickwidth:1,
          tickcolor:"rgba(0,0,0,1)",
          tickfont:{
            family:"Dorid Sans",
            size:12,
            color:"rgba(0,0,0,1)"
          },
          tickangle:0,
          showline:true,
          linecolor:"rgba(0,0,0,1)",
          linewidth:1,
          showgrid:true,
          gridcolor:"rgba(100,100,100,1)",
          gridwidth:1,
          showticklabels:true,
          automargin:false,
          side:"left"
        },

        legend:{
          bgcolor:"rgba(100,100,100,1)",
          bordercolor:'rgba(100,100,100,1)',
          borderwidth:1,
          font:{
            family:"Dorid Sans",
            size:12,
            color:"rgba(0,0,0,1)"
          },
          orientation:'v',
          x:1.02,//[-2,3]
          xanchor:"left",//['auto','left','center','right']
          y:1,
          yanchor:"auto",//['auto','left','center','right']
        },
        annotations:[{
          visible:true,
          text:"<b>Title</b>",
          font:{
            family:"Dorid Sans",
            size:15 ,
            color:"rgba(0,0,0,1)"
          },
          showarrow:false,
          xref:'paper',
          x:0.5,
          xanchor:"center",
          yref:"paper",
          y:1.2,
          yanchor:"center"
        },{
          visible:true,
          text:"<b>x axis</b>",
          font:{
            family:"Dorid Sans",
            size:12,
            color:"rgba(0,0,0,1)"
          },
          showarrow:false,
          xref:'paper',
          x:0.5,
          xanchor:"center",
          yref:"paper",
          y:-0.3,
          yanchor:"center"
        },{
          visible:true,
          text:"<b>y axis</b>",
          font:{
            family:"Dorid Sans",
            size:12,
            color:"rgba(0,0,0,1)"
          },
          textangle:-90,
          showarrow:false,
          xref:'paper',
          x:-0.1,
          xanchor:"center",
          yref:"paper",
          y:0.5,
          yanchor:"center"
        }]
      }
      var data_basic_element = {
        marker:{
          outliercolor:"rgba(0,0,0,1)",
          color:"rgba(0,0,0,1)",
          line:{
            color:"rgba(0,0,0,1)",
          }
        },
        line:{
          color:"rgba(0,0,0,1)",
        },
        fillcolor:"rgba(255,0,0,1)"
      }*/

      ctrl.update_plot = function(){
        console.log(ctrl.one_way_boxplot_styles.selected)
        console.log("update")
        data = [];
        for(var i=0; i<y.length; i++){
          var element = JSON.parse(JSON.stringify(ctrl.one_way_boxplot_styles[ctrl.one_way_boxplot_styles.selected].global));
          //adjust according to the global.
          if(ctrl.one_way_boxplot_styles[ctrl.one_way_boxplot_styles.selected].global.marker.outliercolor !== 'user_define'){
            element.marker.outliercolor = color_palette[ctrl.one_way_boxplot_styles[ctrl.one_way_boxplot_styles.selected].global.marker.outliercolor][i].split(",").splice(0,3).concat([ctrl.one_way_boxplot_styles[ctrl.one_way_boxplot_styles.selected].global.marker.outliercolor_alpha+")"]).join(",")
          }else{
            element.marker.outliercolor = ctrl.one_way_boxplot_styles[ctrl.one_way_boxplot_styles.selected].global.marker.outliercolor_user_define
          }
          if(ctrl.one_way_boxplot_styles[ctrl.one_way_boxplot_styles.selected].global.marker.color !== 'user_define'){
            element.marker.color = color_palette[ctrl.one_way_boxplot_styles[ctrl.one_way_boxplot_styles.selected].global.marker.color][i].split(",").splice(0,3).concat([ctrl.one_way_boxplot_styles[ctrl.one_way_boxplot_styles.selected].global.marker.color_alpha+")"]).join(",")
          }else{
            element.marker.color = ctrl.one_way_boxplot_styles[ctrl.one_way_boxplot_styles.selected].global.marker.color_user_define
          }
          if(ctrl.one_way_boxplot_styles[ctrl.one_way_boxplot_styles.selected].global.marker.line.color !== 'user_define'){
            element.marker.line.color = color_palette[ctrl.one_way_boxplot_styles[ctrl.one_way_boxplot_styles.selected].global.marker.line.color][i].split(",").splice(0,3).concat([ctrl.one_way_boxplot_styles[ctrl.one_way_boxplot_styles.selected].global.marker.line.color_alpha+")"]).join(",")
          }else{
            element.marker.line.color = ctrl.one_way_boxplot_styles[ctrl.one_way_boxplot_styles.selected].global.marker.line.color_user_define
          }
          if(ctrl.one_way_boxplot_styles[ctrl.one_way_boxplot_styles.selected].global.line.color !== 'user_define'){
            element.line.color = color_palette[ctrl.one_way_boxplot_styles[ctrl.one_way_boxplot_styles.selected].global.line.color][i].split(",").splice(0,3).concat([ctrl.one_way_boxplot_styles[ctrl.one_way_boxplot_styles.selected].global.line.color_alpha+")"]).join(",")
          }else{
            element.line.color = ctrl.one_way_boxplot_styles[ctrl.one_way_boxplot_styles.selected].global.line.color_user_define
          }
          if(ctrl.one_way_boxplot_styles[ctrl.one_way_boxplot_styles.selected].global.fillcolor !== 'user_define'){
            element.fillcolor = color_palette[ctrl.one_way_boxplot_styles[ctrl.one_way_boxplot_styles.selected].global.fillcolor][i].split(",").splice(0,3).concat([ctrl.one_way_boxplot_styles[ctrl.one_way_boxplot_styles.selected].global.fillcolor_alpha+")"]).join(",")
          }else{
            element.fillcolor = ctrl.one_way_boxplot_styles[ctrl.one_way_boxplot_styles.selected].global.fillcolor_user_define
          }

          _.merge(element,boxplot_parameters_fixed.data)

          //element.x = Array(y[i].length).fill(i)
          element.y = y[i]
          element.text=texts[i]
          element.name = names[i]
          element.tickvals = [i]
          element.ticktext = names[i]

          data.push(element)
        }
        layout = {}
        layout = JSON.parse(JSON.stringify(ctrl.one_way_boxplot_styles[ctrl.one_way_boxplot_styles.selected].layout))


        _.merge(layout,boxplot_parameters_fixed.layout)


        Plotly.newPlot('plot', data, layout);

      }










})

















