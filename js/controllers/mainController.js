angular
    .module('blankapp').controller("mainController", function($scope, $rootScope, $mdSidenav, $mdDialog,cfpLoadingBar){

      // now need to detect if any message sending to the user!
      mainctrl = this;
      mainctrl.sidenav_width = "50%"
      mainctrl.tabIndex = 0
      /*$scope.$watch("mainctrl.tabIndex",function(x){
        if(mainctrl.tabIndex==0){
          console.log(mainctrl.tabIndex)
          mainctrl.module_label = ""
          //$("#second_tab").html("");
        }
      })*/
      
      
      mainctrl.downloadExampleDataset = function(tutorial_name){
        window.open("tutorial/"+tutorial_name+"/metda_"+tutorial_name+"_example.xlsx");
      }

      function tutorial_controller($scope, $mdDialog, $mdColorPalette,$sce, tutorial_name) {
        console.log(tutorial_name)
        $scope.submit_text = "Submit"
        $scope.submit_message = function(txt){
          $scope.submit_text= "Submitting..."
          var db_message = PouchDB("https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/message")
          db_message.get('message').then(function(doc){
            var time_stamp = get_time_string()
            doc.message.push({
              time:time_stamp,
              user:mainctrl.user,
              message:txt
            })
            db_message.put(doc).then(function(){
              setTimeout(function(){
                $scope.submit_text= "Submitted! Thank you for your feedback."
                $scope.$apply();
              }, 1000);
            })
          })
        }

        if(tutorial_name == 'mainpage'){
          $scope.name = "Main Page Tips"
        }else if(tutorial_name == 'project_panel'){
          $scope.name = "Project Panel Tips"
          $scope.activated_project_name = mainctrl.activated_project_name
        }else if(tutorial_name == "available_project"){
          $scope.name = "Available Projects Tips"
          $scope.activate_project_gif = false
          $scope.create_project_gif = false
        }else if(tutorial_name == "subset"){
          $scope.name = "Data Subset"
        }else if(tutorial_name == "rm_0_sd"){
          $scope.name = "Remove Zero Standard Deviation Compounds"
        }
        
        
        $scope.cancel = function(){
          $mdDialog.hide();
        }
      }

      mainctrl.show_tutorial = function(tutorial_name) {
        $mdDialog.show({
          locals: { tutorial_name:tutorial_name},
          controller: ["$scope","$mdDialog","$mdColorPalette","$sce","tutorial_name",tutorial_controller],
          templateUrl: 'tutorial.html',
          parent: angular.element(document.body),preserveScope : true,
          autoWrap : true,
          multiple : true,
          clickOutsideToClose:true
        })
      };



      function video_tutorial_controller($scope, $mdDialog, $mdColorPalette,$sce, video_tutorial_name) {
        $scope.submit_text = "Submit"
        
        console.log(video_tutorial_name == 'rm_0_sd')
        if(video_tutorial_name == "subset"){
          $scope.name = "Data Subset"
        }
        if(video_tutorial_name == "rm_0_sd"){
          $scope.name = "Remove Zero Standard Deviation Compounds"
        }
        console.log($scope.name)
        $scope.src = "tutorial/"+video_tutorial_name+"/metda_"+video_tutorial_name+"_tutorial.mov"
        
        $scope.cancel = function(){
          $mdDialog.hide();
        }
      }

      mainctrl.show_video_tutorial = function(video_tutorial_name) {
        $mdDialog.show({
          locals: { video_tutorial_name:video_tutorial_name},
          controller: ["$scope","$mdDialog","$mdColorPalette","$sce","video_tutorial_name",video_tutorial_controller],
          templateUrl: 'video_tutorial.html',
          parent: angular.element(document.body),preserveScope : true,
          autoWrap : true,
          multiple : true,
          clickOutsideToClose:true
        })
      };




      function subscribe_controller($scope, $mdDialog, $mdColorPalette,$sce) {
        $scope.showHints = true
        $scope.submit_text = "Submit"
        $scope.submit = function(){
          $scope.submit_text = "Submitting"
          //!!!!!!  need to write code to put users email address.
          var db = new PouchDB('https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/user');
          db.get(mainctrl.user).then(function(doc){
            ddd = doc
            doc.email = $scope.email
            db.put(doc).then(function(){
              $scope.submit_text = "Submitted! Thank you for subscribe!"
              $scope.$apply();
            })
          })
        }
        $scope.cancel = function(){
          $mdDialog.hide();
        }
      }

      mainctrl.subscribe_modal = function(){
        $mdDialog.show({
          controller: ["$scope","$mdDialog","$mdColorPalette","$sce",subscribe_controller],
          templateUrl: 'subscribe.html',
          parent: angular.element(document.body),preserveScope : true,
          autoWrap : true,
          multiple : true,
          clickOutsideToClose:false
        })
      }



      mainctrl.user = localStorage.getItem("user")
      var db = new PouchDB('https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/user');
      db.get(mainctrl.user).catch(function(err){
        console.log(err)
        if(err.error=='not_found'){
          function initialize($scope, $mdDialog){
          $scope.text = "<p>Hold on, we are getting things ready.</p>"
          var time_stamp = get_time_string()
          var user_id = "user"+time_stamp

          var new_user = {
            "_id": user_id,
            "activated_project": [],
            "deleted_projects":[],
            "one_way_boxplot":{
   "default": {
       "global": {
           "whiskerwidth": 0.5,
           "notched": false,
           "notchwidth": 0.25,
           "boxpoints": "all",
           "boxmean": true,
           "jitter": 0.25,
           "pointpos": 0,
           "orientation": "v",
           "marker": {
               "outliercolor": "mpn65",
               "outliercolor_user_define": "rgba(0,0,0,1)",
               "outliercolor_alpha": 1,
               "color": "mpn65",
               "color_user_define": "rgba(0,0,0,1)",
               "color_alpha": 0.3,
               "symbol": "circle",
               "size": 6,
               "line": {
                   "color": "mpn65",
                   "color_user_define": "rgba(0,0,0,1)",
                   "color_alpha": 1,
                   "width": 1
               }
           },
           "line": {
               "color": "mpn65",
               "color_user_define": "rgba(0,0,0,1)",
               "color_alpha": 1,
               "width": 1
           },
           "fillcolor": "mpn65",
           "fillcolor_user_define": "rgba(0,0,0,1)",
           "fillcolor_alpha": 0.3
       },
       "layout": {
           "width": 400,
           "height": 300,
           "margin": {
               "r": 80,
               "t": 100,
               "pad": 0,
               "autoexpand": false
           },
           "paper_bgcolor": "rgba(200,200,200,1)",
           "plot_bgcolor": "rgba(100,100,100,1)",
           "showlegend": true,
           "xaxis": {
               "visiable": true,
               "color": "rgba(0,0,0,1)",
               "ticklen": 5,
               "tickwidth": 1,
               "tickcolor": "rgba(0,0,0,1)",
               "tickfont": {
                   "family": "Dorid Sans",
                   "size": 12,
                   "color": "rgba(0,0,0,1)"
               },
               "tickangle": 0,
               "showline": true,
               "linecolor": "rgba(0,0,0,1)",
               "linewidth": 1,
               "showgrid": true,
               "gridcolor": "rgba(100,100,100,1)",
               "gridwidth": 1,
               "showticklabels": true,
               "automargin": false,
               "side": "bottom",
               "zeroline": false,
               "zerolinecolor": "rgba(0,0,0,1)",
               "zerolinewidth": 1,
               "title": {
                   "text": "<b>xaxis</b>",
                   "font": {
                       "family": "Dorid Sans",
                       "size": 15,
                       "color": "#000000"
                   }
               }
           },
           "yaxis": {
               "visiable": true,
               "color": "rgba(0,0,0,1)",
               "ticklen": 5,
               "tickwidth": 1,
               "tickcolor": "rgba(0,0,0,1)",
               "tickfont": {
                   "family": "Dorid Sans",
                   "size": 12,
                   "color": "rgba(0,0,0,1)"
               },
               "tickangle": 0,
               "showline": true,
               "linecolor": "rgba(0,0,0,1)",
               "linewidth": 1,
               "showgrid": true,
               "gridcolor": "rgba(100,100,100,1)",
               "gridwidth": 1,
               "showticklabels": true,
               "automargin": false,
               "side": "left",
               "zeroline": false,
               "zerolinecolor": "rgba(0,0,0,1)",
               "zerolinewidth": 1,
               "title": {
                   "text": "<b>yaxis</b>",
                   "font": {
                       "family": "Dorid Sans",
                       "size": 15,
                       "color": "#000000"
                   }
               }
           },
           "legend": {
               "bgcolor": "rgba(100,100,100,1)",
               "bordercolor": "rgba(100,100,100,1)",
               "borderwidth": 1,
               "font": {
                   "family": "Dorid Sans",
                   "size": 12,
                   "color": "rgba(0,0,0,1)"
               },
               "orientation": "v",
               "x": 1.02,
               "xanchor": "left",
               "y": 1,
               "yanchor": "auto"
           },
           "annotations": [
               {
                   "visible": true,
                   "text": "<b>Title</b>",
                   "font": {
                       "family": "Dorid Sans",
                       "size": 15,
                       "color": "rgba(0,0,0,1)"
                   },
                   "showarrow": false,
                   "xref": "paper",
                   "x": 0.5,
                   "xanchor": "center",
                   "yref": "paper",
                   "y": 1.2,
                   "yanchor": "center"
               }
           ]
       }
   },
   /*"colorful outline": {
       "global": {
           "whiskerwidth": 0.5,
           "notched": false,
           "notchwidth": 0.25,
           "boxpoints": "outliers",
           "boxmean": false,
           "jitter": 0.25,
           "pointpos": 0,
           "orientation": "v",
           "marker": {
               "outliercolor": "mpn65",
               "outliercolor_user_define": "rgba(0,0,0,1)",
               "outliercolor_alpha": 1,
               "color": "mpn65",
               "color_user_define": "rgba(0,0,0,1)",
               "color_alpha": 1,
               "symbol": "circle",
               "size": 6,
               "line": {
                   "color": "mpn65",
                   "color_user_define": "rgba(0,0,0,1)",
                   "color_alpha": 1,
                   "width": 1
               }
           },
           "line": {
               "color": "mpn65",
               "color_user_define": "rgba(0,0,0,1)",
               "color_alpha": 1,
               "width": 2
           },
           "fillcolor": "user_define",
           "fillcolor_user_define": "rgb(255, 255, 255)",
           "fillcolor_alpha": 0.3
       },
       "layout": {
           "width": 400,
           "height": 300,
           "margin": {
               "r": 80,
               "t": 50,
               "b": 60,
               "pad": 0,
               "autoexpand": false
           },
           "paper_bgcolor": "rgb(255, 255, 255)",
           "plot_bgcolor": "rgb(255, 255, 255)",
           "showlegend": true,
           "xaxis": {
               "visiable": true,
               "color": "rgba(0,0,0,1)",
               "ticklen": 5,
               "tickwidth": 2,
               "tickcolor": "rgba(0,0,0,1)",
               "tickfont": {
                   "family": "Dorid Sans",
                   "size": 15,
                   "color": "rgba(0,0,0,1)"
               },
               "tickangle": 0,
               "showline": true,
               "linecolor": "rgba(0,0,0,1)",
               "linewidth": 2,
               "showgrid": false,
               "gridcolor": "rgba(100,100,100,1)",
               "gridwidth": 1,
               "showticklabels": true,
               "automargin": false,
               "side": "bottom",
               "zeroline": false,
               "zerolinecolor": "rgba(0,0,0,1)",
               "zerolinewidth": 1
           },
           "yaxis": {
               "visiable": true,
               "color": "rgba(0,0,0,1)",
               "ticklen": 5,
               "tickwidth": 2,
               "tickcolor": "rgba(0,0,0,1)",
               "tickfont": {
                   "family": "Dorid Sans",
                   "size": 15,
                   "color": "rgba(0,0,0,1)"
               },
               "tickangle": 0,
               "showline": true,
               "linecolor": "rgba(0,0,0,1)",
               "linewidth": 2,
               "showgrid": false,
               "gridcolor": "rgba(100,100,100,1)",
               "gridwidth": 1,
               "showticklabels": true,
               "automargin": false,
               "side": "left",
               "zeroline": false,
               "zerolinecolor": "rgba(0,0,0,1)",
               "zerolinewidth": 1
           },
           "legend": {
               "bgcolor": "rgb(255, 255, 255)",
               "bordercolor": "rgb(255, 255, 255)",
               "borderwidth": 1,
               "font": {
                   "family": "Dorid Sans",
                   "size": 12,
                   "color": "rgb(0, 0, 0)"
               },
               "orientation": "v",
               "x": 1.02,
               "xanchor": "left",
               "y": 1,
               "yanchor": "auto"
           },
           "annotations": [
               {
                   "visible": true,
                   "text": "<b>Title</b>",
                   "font": {
                       "family": "Dorid Sans",
                       "size": 20,
                       "color": "rgba(0,0,0,1)"
                   },
                   "showarrow": false,
                   "xref": "paper",
                   "x": 0.5,
                   "xanchor": "center",
                   "yref": "paper",
                   "y": 1.15,
                   "yanchor": "center"
               },
               {
                   "visible": true,
                   "text": "<b>x axis</b>",
                   "font": {
                       "family": "Dorid Sans",
                       "size": 18,
                       "color": "rgba(0,0,0,1)"
                   },
                   "showarrow": false,
                   "xref": "paper",
                   "x": 0.5,
                   "xanchor": "center",
                   "yref": "paper",
                   "y": -0.25,
                   "yanchor": "center"
               },
               {
                   "visible": true,
                   "text": "<b>y axis</b>",
                   "font": {
                       "family": "Dorid Sans",
                       "size": 18,
                       "color": "rgba(0,0,0,1)"
                   },
                   "textangle": -90,
                   "showarrow": false,
                   "xref": "paper",
                   "x": -0.15,
                   "xanchor": "center",
                   "yref": "paper",
                   "y": 0.5,
                   "yanchor": "center",
                   "showlegend": true
               }
           ]
       }
   },
   "colourful fill": {
       "global": {
           "whiskerwidth": 0.5,
           "notched": false,
           "notchwidth": 0.25,
           "boxpoints": "outliers",
           "boxmean": false,
           "jitter": 0.25,
           "pointpos": 0,
           "orientation": "v",
           "marker": {
               "outliercolor": "mpn65",
               "outliercolor_user_define": "rgba(0,0,0,1)",
               "outliercolor_alpha": 1,
               "color": "mpn65",
               "color_user_define": "rgba(0,0,0,1)",
               "color_alpha": 1,
               "symbol": "circle",
               "size": 6,
               "line": {
                   "color": "mpn65",
                   "color_user_define": "rgba(0,0,0,1)",
                   "color_alpha": 1,
                   "width": 1
               }
           },
           "line": {
               "color": "mpn65",
               "color_user_define": "rgba(0,0,0,1)",
               "color_alpha": 1,
               "width": 2
           },
           "fillcolor": "mpn65",
           "fillcolor_user_define": "rgba(0,0,0,1)",
           "fillcolor_alpha": 0.3
       },
       "layout": {
           "width": 400,
           "height": 300,
           "margin": {
               "r": 80,
               "t": 50,
               "b": 50,
               "pad": 0,
               "autoexpand": false
           },
           "paper_bgcolor": "rgb(255, 255, 255)",
           "plot_bgcolor": "rgb(255, 255, 255)",
           "showlegend": true,
           "xaxis": {
               "visiable": true,
               "color": "rgba(0,0,0,1)",
               "ticklen": 5,
               "tickwidth": 2,
               "tickcolor": "rgba(0,0,0,1)",
               "tickfont": {
                   "family": "Dorid Sans",
                   "size": 15,
                   "color": "rgba(0,0,0,1)"
               },
               "tickangle": 0,
               "showline": true,
               "linecolor": "rgba(0,0,0,1)",
               "linewidth": 2,
               "showgrid": false,
               "gridcolor": "rgba(100,100,100,1)",
               "gridwidth": 1,
               "showticklabels": true,
               "automargin": false,
               "side": "bottom",
               "zeroline": false,
               "zerolinecolor": "rgba(0,0,0,1)",
               "zerolinewidth": 1
           },
           "yaxis": {
               "visiable": true,
               "color": "rgba(0,0,0,1)",
               "ticklen": 5,
               "tickwidth": 2,
               "tickcolor": "rgba(0,0,0,1)",
               "tickfont": {
                   "family": "Dorid Sans",
                   "size": 15,
                   "color": "rgba(0,0,0,1)"
               },
               "tickangle": 0,
               "showline": true,
               "linecolor": "rgba(0,0,0,1)",
               "linewidth": 2,
               "showgrid": false,
               "gridcolor": "rgba(100,100,100,1)",
               "gridwidth": 1,
               "showticklabels": true,
               "automargin": false,
               "side": "left",
               "zeroline": false,
               "zerolinecolor": "rgba(0,0,0,1)",
               "zerolinewidth": 1
           },
           "legend": {
               "bgcolor": "rgb(255, 255, 255)",
               "bordercolor": "rgb(255, 255, 255)",
               "borderwidth": 1,
               "font": {
                   "family": "Dorid Sans",
                   "size": 12,
                   "color": "rgb(0, 0, 0)"
               },
               "orientation": "v",
               "x": 1.02,
               "xanchor": "left",
               "y": 1,
               "yanchor": "auto"
           },
           "annotations": [
               {
                   "visible": true,
                   "text": "<b>Title</b>",
                   "font": {
                       "family": "Dorid Sans",
                       "size": 20,
                       "color": "rgba(0,0,0,1)"
                   },
                   "showarrow": false,
                   "xref": "paper",
                   "x": 0.5,
                   "xanchor": "center",
                   "yref": "paper",
                   "y": 1.15,
                   "yanchor": "center"
               },
               {
                   "visible": true,
                   "text": "<b>x axis</b>",
                   "font": {
                       "family": "Dorid Sans",
                       "size": 18,
                       "color": "rgba(0,0,0,1)"
                   },
                   "showarrow": false,
                   "xref": "paper",
                   "x": 0.5,
                   "xanchor": "center",
                   "yref": "paper",
                   "y": -0.25,
                   "yanchor": "center"
               },
               {
                   "visible": true,
                   "text": "<b>y axis</b>",
                   "font": {
                       "family": "Dorid Sans",
                       "size": 18,
                       "color": "rgba(0,0,0,1)"
                   },
                   "textangle": -90,
                   "showarrow": false,
                   "xref": "paper",
                   "x": -0.15,
                   "xanchor": "center",
                   "yref": "paper",
                   "y": 0.5,
                   "yanchor": "center",
                   "showlegend": true
               }
           ]
       }
   },
   "colorful points": {
       "global": {
           "whiskerwidth": 0.5,
           "notched": false,
           "notchwidth": 0.25,
           "boxpoints": "all",
           "boxmean": false,
           "jitter": 0.3,
           "pointpos": 0,
           "orientation": "v",
           "marker": {
               "outliercolor": "mpn65",
               "outliercolor_user_define": "rgba(0,0,0,1)",
               "outliercolor_alpha": 1,
               "color": "mpn65",
               "color_user_define": "rgba(0,0,0,1)",
               "color_alpha": 0.3,
               "symbol": "circle",
               "size": 6,
               "line": {
                   "color": "user_define",
                   "color_user_define": "rgba(0,0,0,1)",
                   "color_alpha": 1,
                   "width": 1
               }
           },
           "line": {
               "color": "user_define",
               "color_user_define": "rgba(0,0,0,1)",
               "color_alpha": 1,
               "width": 2
           },
           "fillcolor": "mpn65",
           "fillcolor_user_define": "rgba(0,0,0,1)",
           "fillcolor_alpha": 0.3
       },
       "layout": {
           "width": 400,
           "height": 300,
           "margin": {
               "r": 80,
               "t": 50,
               "b": 50,
               "pad": 0,
               "autoexpand": false
           },
           "paper_bgcolor": "rgb(255, 255, 255)",
           "plot_bgcolor": "rgb(255, 255, 255)",
           "showlegend": true,
           "xaxis": {
               "visiable": true,
               "color": "rgba(0,0,0,1)",
               "ticklen": 5,
               "tickwidth": 2,
               "tickcolor": "rgba(0,0,0,1)",
               "tickfont": {
                   "family": "Dorid Sans",
                   "size": 15,
                   "color": "rgba(0,0,0,1)"
               },
               "tickangle": 0,
               "showline": true,
               "linecolor": "rgba(0,0,0,1)",
               "linewidth": 2,
               "showgrid": false,
               "gridcolor": "rgba(100,100,100,1)",
               "gridwidth": 1,
               "showticklabels": true,
               "automargin": false,
               "side": "bottom",
               "zeroline": false,
               "zerolinecolor": "rgba(0,0,0,1)",
               "zerolinewidth": 1
           },
           "yaxis": {
               "visiable": true,
               "color": "rgba(0,0,0,1)",
               "ticklen": 5,
               "tickwidth": 2,
               "tickcolor": "rgba(0,0,0,1)",
               "tickfont": {
                   "family": "Dorid Sans",
                   "size": 15,
                   "color": "rgba(0,0,0,1)"
               },
               "tickangle": 0,
               "showline": true,
               "linecolor": "rgba(0,0,0,1)",
               "linewidth": 2,
               "showgrid": false,
               "gridcolor": "rgba(100,100,100,1)",
               "gridwidth": 1,
               "showticklabels": true,
               "automargin": false,
               "side": "left",
               "zeroline": false,
               "zerolinecolor": "rgba(0,0,0,1)",
               "zerolinewidth": 1
           },
           "legend": {
               "bgcolor": "rgb(255, 255, 255)",
               "bordercolor": "rgb(255, 255, 255)",
               "borderwidth": 1,
               "font": {
                   "family": "Dorid Sans",
                   "size": 12,
                   "color": "rgb(0, 0, 0)"
               },
               "orientation": "v",
               "x": 1.02,
               "xanchor": "left",
               "y": 1,
               "yanchor": "auto"
           },
           "annotations": [
               {
                   "visible": true,
                   "text": "<b>Title</b>",
                   "font": {
                       "family": "Dorid Sans",
                       "size": 20,
                       "color": "rgba(0,0,0,1)"
                   },
                   "showarrow": false,
                   "xref": "paper",
                   "x": 0.5,
                   "xanchor": "center",
                   "yref": "paper",
                   "y": 1.15,
                   "yanchor": "center"
               },
               {
                   "visible": true,
                   "text": "<b>x axis</b>",
                   "font": {
                       "family": "Dorid Sans",
                       "size": 18,
                       "color": "rgba(0,0,0,1)"
                   },
                   "showarrow": false,
                   "xref": "paper",
                   "x": 0.5,
                   "xanchor": "center",
                   "yref": "paper",
                   "y": -0.25,
                   "yanchor": "center"
               },
               {
                   "visible": true,
                   "text": "<b>y axis</b>",
                   "font": {
                       "family": "Dorid Sans",
                       "size": 18,
                       "color": "rgba(0,0,0,1)"
                   },
                   "textangle": -90,
                   "showarrow": false,
                   "xref": "paper",
                   "x": -0.15,
                   "xanchor": "center",
                   "yref": "paper",
                   "y": 0.5,
                   "yanchor": "center",
                   "showlegend": true
               }
           ]
       }
   },
   "Minimal": {
       "global": {
           "whiskerwidth": 0.5,
           "notched": false,
           "notchwidth": 0.25,
           "boxpoints": "outliers",
           "boxmean": false,
           "jitter": 0.25,
           "pointpos": 0,
           "orientation": "v",
           "marker": {
               "outliercolor": "user_define",
               "outliercolor_user_define": "rgba(0,0,0,1)",
               "outliercolor_alpha": 1,
               "color": "user_define",
               "color_user_define": "rgba(0,0,0,1)",
               "color_alpha": 0.3,
               "symbol": "circle",
               "size": 6,
               "line": {
                   "color": "user_define",
                   "color_user_define": "rgba(0,0,0,1)",
                   "color_alpha": 1,
                   "width": 1
               }
           },
           "line": {
               "color": "user_define",
               "color_user_define": "rgba(0,0,0,1)",
               "color_alpha": 1,
               "width": 2
           },
           "fillcolor": "user_define",
           "fillcolor_user_define": "rgba(255, 255, 255, 0)",
           "fillcolor_alpha": 0.3
       },
       "layout": {
           "width": 400,
           "height": 300,
           "margin": {
               "r": 20,
               "t": 50,
               "b": 50,
               "pad": 0,
               "autoexpand": false
           },
           "paper_bgcolor": "rgb(255, 255, 255)",
           "plot_bgcolor": "rgb(255, 255, 255)",
           "showlegend": false,
           "xaxis": {
               "visiable": true,
               "color": "rgba(0,0,0,1)",
               "ticklen": 0,
               "tickwidth": 0,
               "tickcolor": "rgba(0,0,0,1)",
               "tickfont": {
                   "family": "Dorid Sans",
                   "size": 15,
                   "color": "rgba(0,0,0,1)"
               },
               "tickangle": 0,
               "showline": false,
               "linecolor": "rgba(0,0,0,1)",
               "linewidth": 2,
               "showgrid": true,
               "gridcolor": "rgba(0, 0, 0, 0.2)",
               "gridwidth": 1,
               "showticklabels": true,
               "automargin": false,
               "side": "bottom",
               "zeroline": false,
               "zerolinecolor": "rgba(0,0,0,1)",
               "zerolinewidth": 1
           },
           "yaxis": {
               "visiable": true,
               "color": "rgba(0,0,0,1)",
               "ticklen": 0,
               "tickwidth": 0,
               "tickcolor": "rgba(0,0,0,1)",
               "tickfont": {
                   "family": "Dorid Sans",
                   "size": 15,
                   "color": "rgba(0,0,0,1)"
               },
               "tickangle": 0,
               "showline": false,
               "linecolor": "rgba(0, 0, 0, 0.2)",
               "linewidth": 2,
               "showgrid": true,
               "gridcolor": "rgba(0, 0, 0, 0.2)",
               "gridwidth": 1,
               "showticklabels": true,
               "automargin": false,
               "side": "left",
               "zeroline": false,
               "zerolinecolor": "rgba(0,0,0,1)",
               "zerolinewidth": 1
           },
           "legend": {
               "bgcolor": "rgb(255, 255, 255)",
               "bordercolor": "rgb(255, 255, 255)",
               "borderwidth": 1,
               "font": {
                   "family": "Dorid Sans",
                   "size": 12,
                   "color": "rgba(0,0,0,1)"
               },
               "orientation": "v",
               "x": 1.02,
               "xanchor": "left",
               "y": 1,
               "yanchor": "auto"
           },
           "annotations": [
               {
                   "visible": true,
                   "text": "<b>Title</b>",
                   "font": {
                       "family": "Dorid Sans",
                       "size": 20,
                       "color": "rgba(0,0,0,1)"
                   },
                   "showarrow": false,
                   "xref": "paper",
                   "x": 0.5,
                   "xanchor": "center",
                   "yref": "paper",
                   "y": 1.15,
                   "yanchor": "center"
               },
               {
                   "visible": true,
                   "text": "<b>x axis</b>",
                   "font": {
                       "family": "Dorid Sans",
                       "size": 15,
                       "color": "rgba(0,0,0,1)"
                   },
                   "showarrow": false,
                   "xref": "paper",
                   "x": 0.5,
                   "xanchor": "center",
                   "yref": "paper",
                   "y": -0.22,
                   "yanchor": "center"
               },
               {
                   "visible": true,
                   "text": "<b>y axis</b>",
                   "font": {
                       "family": "Dorid Sans",
                       "size": 15,
                       "color": "rgba(0,0,0,1)"
                   },
                   "textangle": -90,
                   "showarrow": false,
                   "xref": "paper",
                   "x": -0.15,
                   "xanchor": "center",
                   "yref": "paper",
                   "y": 0.5,
                   "yanchor": "center",
                   "showlegend": true
               }
           ]
       }
   },*/
   "classic": {
       "global": {
           "whiskerwidth": 0.5,
           "notched": false,
           "notchwidth": 0.25,
           "boxpoints": "outliers",
           "boxmean": true,
           "jitter": 0.25,
           "pointpos": 0,
           "orientation": "v",
           "marker": {
               "outliercolor": "user_define",
               "outliercolor_user_define": "rgba(0,0,0,1)",
               "outliercolor_alpha": 1,
               "color": "user_define",
               "color_user_define": "rgba(0,0,0,1)",
               "color_alpha": 1,
               "symbol": "circle",
               "size": 3,
               "line": {
                   "color": "user_define",
                   "color_user_define": "rgba(0,0,0,1)",
                   "color_alpha": 1,
                   "width": 2
               }
           },
           "line": {
               "color": "user_define",
               "color_user_define": "rgba(0,0,0,1)",
               "color_alpha": 1,
               "width": 2
           },
           "fillcolor": "user_define",
           "fillcolor_user_define": "rgb(255, 255, 255)",
           "fillcolor_alpha": 0.3
       },
       "layout": {
           "width": 400,
           "height": 300,
           "margin": {
               "r": 70,
               "t": 50,
               "pad": 0,
               "autoexpand": false
           },
           "paper_bgcolor": "rgb(255, 255, 255)",
           "plot_bgcolor": "rgb(255, 255, 255)",
           "showlegend": true,
           "xaxis": {
               "visiable": true,
               "color": "rgba(0,0,0,1)",
               "ticklen": 5,
               "tickwidth": 1,
               "tickcolor": "rgba(0,0,0,1)",
               "tickfont": {
                   "family": "Dorid Sans",
                   "size": 15,
                   "color": "rgba(0,0,0,1)"
               },
               "tickangle": 0,
               "showline": true,
               "linecolor": "rgba(0,0,0,1)",
               "linewidth": 2,
               "showgrid": true,
               "gridcolor": "rgb(255, 255, 255)",
               "gridwidth": 1,
               "showticklabels": true,
               "automargin": true,
               "side": "bottom",
               "zeroline": false,
               "zerolinecolor": "rgba(0,0,0,1)",
               "zerolinewidth": 1,
               "title": {
                   "text": "<b>xaxis</b>",
                   "font": {
                       "family": "Dorid Sans",
                       "size": 18,
                       "color": "#000000"
                   }
               }
           },
           "yaxis": {
               "visiable": true,
               "color": "rgba(0,0,0,1)",
               "ticklen": 5,
               "tickwidth": 1,
               "tickcolor": "rgba(0,0,0,1)",
               "tickfont": {
                   "family": "Dorid Sans",
                   "size": 15,
                   "color": "rgba(0,0,0,1)"
               },
               "tickangle": 0,
               "showline": true,
               "linecolor": "rgba(0,0,0,1)",
               "linewidth": 2,
               "showgrid": false,
               "gridcolor": "rgba(100,100,100,1)",
               "gridwidth": 1,
               "showticklabels": true,
               "automargin": false,
               "side": "left",
               "zeroline": false,
               "zerolinecolor": "rgba(0,0,0,1)",
               "zerolinewidth": 1,
               "title": {
                   "text": "<b>yaxis</b>",
                   "font": {
                       "family": "Dorid Sans",
                       "size": 18,
                       "color": "#000000"
                   }
               }
           },
           "legend": {
               "bgcolor": "rgb(255, 255, 255)",
               "bordercolor": "rgb(255, 255, 255)",
               "borderwidth": 1,
               "font": {
                   "family": "Dorid Sans",
                   "size": 12,
                   "color": "rgba(0,0,0,1)"
               },
               "orientation": "v",
               "x": 1.02,
               "xanchor": "left",
               "y": 1,
               "yanchor": "auto"
           },
           "annotations": [
               {
                   "visible": true,
                   "text": "<b>Title</b>",
                   "font": {
                       "family": "Dorid Sans",
                       "size": 20,
                       "color": "rgba(0,0,0,1)"
                   },
                   "showarrow": false,
                   "xref": "paper",
                   "x": 0.5,
                   "xanchor": "center",
                   "yref": "paper",
                   "y": 1.2,
                   "yanchor": "center"
               }
           ]
       }
   },
   "Louise Fong": {
       "global": {
           "whiskerwidth": 0.5,
           "notched": false,
           "notchwidth": 0.25,
           "boxpoints": "all",
           "boxmean": true,
           "jitter": 0.25,
           "pointpos": 0,
           "orientation": "v",
           "marker": {
               "outliercolor": "mpn65",
               "outliercolor_user_define": "rgba(0,0,0,1)",
               "outliercolor_alpha": 1,
               "color": "mpn65",
               "color_user_define": "rgba(0,0,0,1)",
               "color_alpha": 0.3,
               "symbol": "circle",
               "size": 6,
               "line": {
                   "color": "mpn65",
                   "color_user_define": "rgba(0,0,0,1)",
                   "color_alpha": 1,
                   "width": 1
               }
           },
           "line": {
               "color": "mpn65",
               "color_user_define": "rgba(0,0,0,1)",
               "color_alpha": 1,
               "width": 1
           },
           "fillcolor": "mpn65",
           "fillcolor_user_define": "rgba(0,0,0,1)",
           "fillcolor_alpha": 0.3
       },
       "layout": {
           "width": 400,
           "height": 300,
           "margin": {
               "r": 60,
               "t": 100,
               "pad": 0,
               "autoexpand": false
           },
           "paper_bgcolor": "rgb(255, 255, 255)",
           "plot_bgcolor": "rgb(255, 255, 255)",
           "showlegend": true,
           "xaxis": {
               "visiable": true,
               "color": "rgba(0,0,0,1)",
               "ticklen": 0,
               "tickwidth": 1,
               "tickcolor": "rgba(0,0,0,1)",
               "tickfont": {
                   "family": "Dorid Sans",
                   "size": 1,
                   "color": "rgb(255, 255, 255)"
               },
               "tickangle": 0,
               "showline": true,
               "linecolor": "rgba(0,0,0,1)",
               "linewidth": 1,
               "showgrid": false,
               "gridcolor": "rgba(100,100,100,1)",
               "gridwidth": 1,
               "showticklabels": true,
               "automargin": false,
               "side": "bottom",
               "zeroline": false,
               "zerolinecolor": "rgba(0,0,0,1)",
               "zerolinewidth": 1,
               "title": {
                   "text": "<b>xaxis</b>",
                   "font": {
                       "family": "Dorid Sans",
                       "size": 15,
                       "color": "rgba(249, 249, 249, 0)"
                   }
               }
           },
           "yaxis": {
               "visiable": true,
               "color": "rgba(0,0,0,1)",
               "ticklen": 5,
               "tickwidth": 1,
               "tickcolor": "rgba(0,0,0,1)",
               "tickfont": {
                   "family": "Dorid Sans",
                   "size": 12,
                   "color": "rgba(0,0,0,1)"
               },
               "tickangle": 0,
               "showline": true,
               "linecolor": "rgba(0,0,0,1)",
               "linewidth": 1,
               "showgrid": false,
               "gridcolor": "rgba(100,100,100,1)",
               "gridwidth": 1,
               "showticklabels": true,
               "automargin": false,
               "side": "left",
               "zeroline": false,
               "zerolinecolor": "rgba(0,0,0,1)",
               "zerolinewidth": 1,
               "title": {
                   "text": "<b>yaxis</b>",
                   "font": {
                       "family": "Dorid Sans",
                       "size": 15,
                       "color": "#000000"
                   }
               }
           },
           "legend": {
               "bgcolor": "rgb(255, 255, 255)",
               "bordercolor": "rgb(255, 255, 255)",
               "borderwidth": 1,
               "font": {
                   "family": "Dorid Sans",
                   "size": 12,
                   "color": "rgb(0, 0, 0)"
               },
               "orientation": "v",
               "x": -0.058,
               "xanchor": "left",
               "y": -0.5,
               "yanchor": "auto"
           },
           "annotations": [
               {
                   "visible": true,
                   "text": "<b>Title</b>",
                   "font": {
                       "family": "Dorid Sans",
                       "size": 15,
                       "color": "rgba(0,0,0,1)"
                   },
                   "showarrow": false,
                   "xref": "paper",
                   "x": 0.5,
                   "xanchor": "center",
                   "yref": "paper",
                   "y": 1.2,
                   "yanchor": "center"
               }
           ]
       }
   }
},
"one_way_boxplot_fixed":{
   "data": {
       "type": "box",
       "hoverinfo": "text",
       "hoveron": "boxes+points",
       "xaxis": "x",
       "yaxis": "y"
   },
   "layout": {
       "autosize": false,
       "separators": ".",
       "hidesources": true,
       "hovermode": "closest",
       "hoverdistance": 1,
       "spikedistance": 1,
       "xaxis": {
           "domain": [
               0,
               1
           ]
       },
       "yaxis": {
           "domain": [
               0,
               1
           ]
       }
   }
},
"one_way_boxplot_selected":"classic",
"projects":[]
          };
          var db_user = new PouchDB('https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/user');
          db_user.put(new_user).then(function(){
            localStorage.setItem("user",user_id)


parameters = {}
parameters.rm_0_sd = {}
parameters.rm_0_sd.by_group=false
parameters.rm_0_sd.column = undefined


parameters.outlier_treatment = {}
parameters.outlier_treatment.column = undefined
parameters.outlier_treatment.auto = true
parameters.outlier_treatment.criterion = 1.5
parameters.outlier_treatment.method =  'median'




parameters.log_transformation = {}
parameters.log_transformation.method = 'log10'

parameters.power_transformation = {}
parameters.power_transformation.method = 'cubic root'

parameters.fold_change={}
parameters.fold_change.method='median'

parameters.group_average = {}
parameters.group_average.method = 'median'
parameters.group_average.by_group = true


parameters.correlation = {}
parameters.correlation.method = 'spearman'


parameters.partial_correlation = {}
parameters.partial_correlation.method = 'spearman'
parameters.partial_correlation.confounder_column = []

parameters.pca = {}
parameters.pca.scale =  'standard'
parameters.pca.pair_score_plot = {}
parameters.pca.pair_score_plot.color_by = undefined
parameters.pca.pair_score_plot.shape_by = undefined
parameters.pca.pair_score_plot.scatter_size = 6

parameters.pca.score_plot = {}
parameters.pca.score_plot.color_by = undefined
parameters.pca.score_plot.shape_by = undefined
parameters.pca.score_plot.scatter_size = 6
parameters.pca.score_plot.pcx = 0
parameters.pca.score_plot.pcy = 1
parameters.pca.score_plot.add_center= true
parameters.pca.score_plot.ellipse_color=true
parameters.pca.score_plot.ellipse_shape=false


parameters.pca.loading_plot = {}
parameters.pca.loading_plot.color_by = undefined
parameters.pca.loading_plot.shape_by = undefined
parameters.pca.loading_plot.scatter_size = 6
parameters.pca.loading_plot.pcx = 0
parameters.pca.loading_plot.pcy = 1
parameters.pca.loading_plot.add_center= false
parameters.pca.loading_plot.ellipse_color=false
parameters.pca.loading_plot.ellipse_shape=false


parameters.plsda = {}
parameters.plsda.scale = 'standard'
parameters.plsda.pair_score_plot = {}
parameters.plsda.pair_score_plot.scatter_size = 6
parameters.plsda.pair_score_plot.color_by=undefined
parameters.plsda.pair_score_plot.shape_by=undefined
parameters.plsda.vip_plot = {}
parameters.plsda.vip_plot.n_vip = 15
parameters.plsda.vip_plot.margin={}
parameters.plsda.vip_plot.margin.left = 100
parameters.plsda.vip_plot.heigth=500
parameters.plsda.vip_plot.yaxis_font_size=12
parameters.plsda.score_plot = {}
parameters.plsda.score_plot.scatter_size = 6
parameters.plsda.score_plot.color_by=undefined
parameters.plsda.score_plot.shape_by=undefined
parameters.plsda.score_plot.pcx=0
parameters.plsda.score_plot.pcy=1
parameters.plsda.score_plot.add_center =true
parameters.plsda.score_plot.ellipse_color = true
parameters.plsda.score_plot.ellipse_shape = false
parameters.plsda.loading_plot = {}
parameters.plsda.loading_plot.scatter_size = 6
parameters.plsda.loading_plot.color_by=undefined
parameters.plsda.loading_plot.shape_by=undefined
parameters.plsda.loading_plot.pcx=0
parameters.plsda.loading_plot.pcy=1
parameters.plsda.loading_plot.add_center =true
parameters.plsda.loading_plot.ellipse_color = true
parameters.plsda.loading_plot.ellipse_shape = false

parameters.plsda.n_perm = 200


parameters.metamapp={}
parameters.metamapp.compound_label='label'
parameters.metamapp.pubchemid=undefined
parameters.metamapp.kegg=undefined
parameters.metamapp.smiles=undefined
parameters.metamapp.pvalue=undefined
parameters.metamapp.foldchange=undefined
parameters.metamapp.fold_change_critical=1

parameters.idexchanger={}
parameters.idexchanger.from_column=undefined
parameters.idexchanger.from_type=undefined
parameters.idexchanger.to_type=[undefined]

parameters.chemrich={}
parameters.chemrich.compound_label='label'
parameters.chemrich.pubchemid=undefined
parameters.chemrich.inchikey=undefined
parameters.chemrich.smiles=undefined
parameters.chemrich.pvalue=undefined
parameters.chemrich.foldchange=undefined
parameters.chemrich.fold_change_critical=1

parameters.one_way_boxplot={}
parameters.one_way_boxplot.format='png'
parameters.one_way_boxplot.column=undefined
parameters.one_way_boxplot.selected_compound=undefined
parameters.one_way_boxplot.one_way_boxplot_selected='classic'
parameters.one_way_boxplot.levels='undefined'


parameters.heatmap={}
parameters.heatmap.order_sample_by=['dendrogram']
parameters.heatmap.order_sample_levels={}
parameters.heatmap.order_compound_by=['dendrogram']

parameters.heatmap.scale =  'standard'
parameters.heatmap.high_color = '#00ff00'
parameters.heatmap.mid_color = '#ffffff'
parameters.heatmap.low_color = '#ff0000'
parameters.heatmap.alpha_color=1

parameters.heatmap.colorscale='Portland'
parameters.heatmap.sample_annotations = []
parameters.heatmap.compound_annotations = []
parameters.heatmap.height = 1000
parameters.heatmap.width = 600


parameters.heatmap.sample_annotation_height = 10
parameters.heatmap.sample_tree_height=50


parameters.heatmap.compound_annotation_height = 10
parameters.heatmap.compound_tree_height=50


parameters.heatmap.top = 0
parameters.heatmap.right = 0
parameters.heatmap.bottom = 70
parameters.heatmap.left = 100

parameters.heatmap.show_sample_label=true
parameters.heatmap.show_compound_label=true

parameters.constImp = {}
parameters.constImp.method = 'HM'

parameters.mTIC={}
parameters.mTIC.known_column=undefined
parameters.mTIC.known_level = undefined



parameters.batchratio={}
parameters.batchratio.batch_column=undefined
parameters.batchratio.time_column=undefined
parameters.batchratio.qc_column=undefined
parameters.batchratio.qc_level = undefined


parameters.serrf={}
parameters.serrf.batch_column=undefined
parameters.serrf.time_column=undefined
parameters.serrf.qc_column=undefined
parameters.serrf.qc_level = undefined



parameters.loess={}
parameters.loess.batch_column=undefined
parameters.loess.time_column=undefined
parameters.loess.qc_column=undefined
parameters.loess.qc_level = undefined


parameters.boxcox={}
parameters.boxcox.columns = [undefined]


parameters.shapiro_wilk_test={}
parameters.shapiro_wilk_test.columns = [undefined]
parameters.shapiro_wilk_test.QQ = false



parameters.two_way_anova={}
parameters.two_way_anova.columns = [undefined]

parameters.fdr_correction={}
parameters.fdr_correction.column = undefined

parameters.jonckheere_terpstra_test={}
parameters.jonckheere_terpstra_test.alternative = "two.sided"
parameters.jonckheere_terpstra_test.levels='undefined'


parameters.volcano_plot={}
parameters.volcano_plot.p_column = undefined
parameters.volcano_plot.fc_column = undefined



parameters.volcano_plot["not_sig + decrease"] = {
      name:"not_sig + decrease",
      marker:{
        Symbol:"circle",
        size:6,
        color:"grey"
      },
showlegend:false
    }
parameters.volcano_plot["not_sig + small_fc"] = {
      name:"not_sig + small_fc",
      marker:{
        symbol:"circle",        size:6,
        color:"grey"
      },
showlegend:false
    }
parameters.volcano_plot["sig + small_fc"] = {
      name:"sig + small_fc",
      marker:{
        symbol:"circle", 
       size:6,
        color:"grey"
      },
showlegend:false
    }
parameters.volcano_plot["sig + decrease"] = {
      name:"sig + decrease",
      marker:{
        symbol:"circle",
        size:6,
        color:"blue"
      },
showlegend:false
    }
parameters.volcano_plot["not_sig + increase"] = {
      name:"not_sig + increase",
      marker:{
        symbol:"circle",
        size:6,
        color:"grey"
      },
showlegend:false
    }
parameters.volcano_plot["sig + increase"] = {
      name:"sig + increase",
      marker:{
        symbol:"circle",
        size:6,
        color:"red"
      },
showlegend:false
    }

parameters.volcano_plot.layout = {
         height:600,
         width:800,
         plot_bgcolor:"rgba(255,255,255,1)",
         paper_bgcolor:"rgba(255,255,255,1)",
xaxis:{title:"<b>Fold Change (log2 scale)</b>"
},
yaxis:{
title:"<b>p-values (-log10 scale)</b>"},
         legend:{
           bgcolor:"rgba(255,255,255,1)",
           bordercolor:"transparent",
           borderwidth:1.88,
           font:{
             color:"rgba(0,0,0,1)",
             family:"Dorid Sans",
             size:15
           },
           y:0.8148116
         },
         hovermode:"closest",
         barmode:"relative"
       }





parameters.column = undefined
parameters.groups_dep = undefined
parameters.id = undefined
parameters.FDR =  'fdr'
parameters.confounder=['NO_CONFOUNDER']





localStorage.setItem('parameters', JSON.stringify(parameters));



            console.log(user_id)
            $scope.cancel = function(){
              location.reload();
            }
          });
        }
          $mdDialog.show({
          controller: ["$scope","$mdDialog",initialize],
          templateUrl: 'initialize.html',preserveScope : true,
          parent: angular.element(document.body),
          clickOutsideToClose:false
        })
        }
      })





      var activated_project;

      var update_jstree = function(project_doc,waiting_user_to_select_data,special_function_name,index_of_data){
                $("#jstree").jstree("destroy");
                $("#jstree").jstree({'core':{
                  'data':project_doc.tree_structure,
                  'multiple':false, // cannot select multiple nodes.
                  'expand_selected_onload':true,
                  'check_callback' : true
                },
                  "plugins" : ["contextmenu","state"],
                  'contextmenu':{
                    "show_at_node":true, // the menu follows the mouse.
                    "check_callback" : true,
                    'items':function($node){
                      clicked_node = $node
                      var uploadable = true;
                      var renameable = true; // except root.
                      var removeable = true; // except root.
                      var downloadable = true; // everything is downloadable.
                      var editable = true; // only able to edit dataset.
                      var one_stoppable = true; // only available when it is a efp dataset.
                      if($node.parent == '#'){
                        renameable = false;
                        removeable = false;
                        editable = false;
                        one_stoppable = false
                      }
                      if($node.icon == "fa fa-folder"){
                        editable = false;
                        one_stoppable = false
                      }
                      if(!clicked_node.original.efp){
                        one_stoppable = false
                        editable = false
                      }

                      var tree = $("#jstree").jstree(true);
                      var items = {
                        "Upload":{
                          "label":"Upload a Dataset",
                          "icon":"fa fa-plus-circle",
                          "_disableded":!uploadable,
                          "action":function(obj){
                            // open a modal to upload dataset.
                            $mdDialog.show({
                              locals: { node: clicked_node, activated_project:activated_project},
                              controller: ["$scope","$mdDialog","node", "activated_project",upload_data],
                              templateUrl: 'upload_data.html',
                              parent: angular.element(document.body),preserveScope : false,
                              clickOutsideToClose:false
                            })
                            .then(function(answer) {
                              $scope.status = 'You said the information was "' + answer + '".';
                            }, function() {
                              $scope.status = 'You cancelled the dialog.';
                            });
                          }
                        },
                        "Rename":{
                          "label":"Rename",
                          "icon":'fa fa-edit',
                          "_disabled":!renameable,
                          "action":function(obj){
                            tree.edit($node, null, function(node){
                              nnn = node
                              console.log("trying to rename.")
                              var db_project = new PouchDB('https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/project');
                              db_project.get(mainctrl.activated_project_id, {attachments: false}).then(function(doc){
                                ppp = doc
                                old_node = JSON.parse(JSON.stringify(node));
                                var new_name = node.text;
                                var old_id = old_node.id;
                                var old_name = old_node.text;
                                var old_parent = old_node.parent;
                                var sibling_node_indexes = getAllIndexes(unpack(doc.tree_structure,'parent'),old_parent)
                                var all_node_text = unpack(doc.tree_structure,'text')
                                var sibling_names = sibling_node_indexes.map(x => all_node_text[x])
                                if(sibling_names.includes(new_name)){
                                  alert("The name "+new_name+" is already taken.")
                                  $('#jstree').jstree(true).rename_node(old_node, old_name);
                                }else{
                                  // delete the old node from the three. Add new node to the tree. When making new id, make sure that all the children can still find their parent.
                                  var timestamp = get_time_string();
                                  var new_id = new_name+timestamp
                                  // change old node id.
                                  var old_node_index = unpack(doc.tree_structure,"id").indexOf(old_id)
                                  doc.tree_structure[old_node_index].id = new_id;
                                  doc.tree_structure[old_node_index].text = new_name;
                                  var children_node_indexes = getAllIndexes(unpack(doc.tree_structure,'parent'),old_id)
                                  for(var i=0; i<children_node_indexes.length;i++){
                                    doc.tree_structure[children_node_indexes[i]].parent = new_id
                                  }
                                }
                                db_project.put(doc).then(function(){
                                  update_jstree(doc,false)
                                })
                              })
                            })
                          }
                        },
                        "Remove":{
                          "label":"Delete",
                          "icon":"fa fa-trash-o",
                          "_disabled":!removeable,
                          "action":function(obj){
                            bbb = obj
                            console.log("trying to remove.")
                            var r = confirm("Are you sure you want to remove '"+bbb.reference[0].innerText+"' and all its children files?");
                            if(r){
                              var selected_node_id = bbb.reference[0].id.substring(0, bbb.reference[0].id.length - '_anchor'.length);
                              var db_project = new PouchDB('https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/project');
                              db_project.get(mainctrl.activated_project_id).then(function(doc){
                                ppp = doc
                                var remove_index = [];
                                var bad_id = [];
                                bad_id.push(selected_node_id)
                                var saved_index; // see bad_id.splice(bad_id.indexOf(doc.tree_structure[i].id),1)
                                for(var i=0;i<doc.tree_structure.length;i++){
                                  if(bad_id.indexOf(doc.tree_structure[i].id) > -1){// is the node is a bamakeProjectListTableHTMLd id, remove this node.
                                    remove_index.push(i)
                                    saved_index = doc.tree_structure[i].id
                                  }
                                  if(bad_id.indexOf(doc.tree_structure[i].parent)>-1){
                                    remove_index.push(i)
                                    bad_id.push(doc.tree_structure[i].id)
                                  }
                                }
                                for(var i = remove_index.length -1;i>-1;i--){
                                  if(doc.tree_structure[remove_index[i]].attachment_id !== undefined){ // delete attachment as well
                                    delete doc._attachments[[doc.tree_structure[remove_index[i]].attachment_id]]
                                  }
                                  doc.tree_structure.splice(remove_index[i],1)
                                }
                                db_project.put(doc).then(function(){
                                  update_jstree(doc,false)
                                })
                              })
                            }else{
                              console.log("remove canceled.")
                            }



                          }
                        },
                        "Download":{
                          "label":"Download",
                          "icon":"fa fa-download",
                          "_disabled":!downloadable,
                          "action":function(obj){
                            nnn = $node
                            cfpLoadingBar.start();
                            if($node.original.attachment_id===undefined){
                              var tree = $("#jstree").jstree(true)
                              var selected_node_id = nnn.id
                              var unincluded_folder = [];
                              included_path = [];
                              included_id = [];
                              included_path[0] = tree.get_path(selected_node_id,"/");
                              included_id[0] = selected_node_id
                              unincluded_folder[0] = selected_node_id
                              while(unincluded_folder.length > 0){
                                var update_unincluded_folder = []
                                for(var i=0; i<unincluded_folder.length;i++){
                                  var children = tree.get_node(unincluded_folder[i]).children
                                  for(var j=0; j<children.length;j++){
                                    var child_node = tree.get_node(children[j])
                                    if(tree.is_leaf(child_node,"/")){
                                      included_id.push(child_node.id)
                                      included_path.push(tree.get_path(child_node,"/"))
                                    }else{
                                      included_id.push(child_node.id)
                                      included_path.push(tree.get_path(child_node,"/"))
                                      update_unincluded_folder.push(child_node.id)
                                    }
                                  }
                                }
                                unincluded_folder =  update_unincluded_folder
                              }
                              var req = ocpu.call("download_folder_as_zip",{
                                project_id:mainctrl.activated_project_id,
                                id:included_id,
                                path:included_path
                              },function(session){
                                cfpLoadingBar.complete();
                                session.getObject(function(objj){
                                  window.open(session.loc +"files/" + objj[0])
                                })
                              }).fail(function(){
                                alert("Error: "+req.responseText)
                                cfpLoadingBar.complete();
                              })
                            }else if($node.original.attachment_id.indexOf(".csv")!==-1){
                              Papa.parse("https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/project/"+mainctrl.activated_project_id+"/"+$node.original.attachment_id.replace('+',"%2B"), {
                              	download: true,
                              	complete: function(results) {
                              		rrr = results
                              		download_csv(Papa.unparse(rrr), nnn.original.text.substr(nnn.original.text.length - 4) === '.csv'? nnn.original.text : nnn.original.text+".csv")
                              	}
                              });
                              cfpLoadingBar.complete();
                            }else if($node.original.attachment_id.indexOf(".xlsx")!==-1){
                              alert("There should not be xlsx file in your project.")
                              cfpLoadingBar.complete();
                            }else if($node.original.attachment_id.indexOf(".svg")!==-1){//https://bl.ocks.org/curran/7cf9967028259ea032e8
                              var dl = document.createElement("a");
                              document.body.appendChild(dl); // This line makes it work in Firefox.
                              dl.setAttribute("href", "https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/project/"+mainctrl.activated_project_id+"/"+$node.original.attachment_id.replace('+',"%2B"));
                              dl.setAttribute("download", nnn.original.text.substr(nnn.original.text.length - 4) === '.svg'? nnn.original.text : nnn.original.text+".svg");
                              dl.setAttribute("target", "_blank");
                              dl.click();cfpLoadingBar.complete();
                            }else{
                              alert("There is no download method for your file.")
                              cfpLoadingBar.complete();
                            }
                          }
                        }
                        ,"one_stop":{
                          "label":"One-Stop Quick Analysis",
                          "icon":"fa fa-rocket",
                          "_disabled":!one_stoppable,
                          "action":function(obj){
                            nnn = $node
                            objj = obj
                            // when user select one_stop, pop a modal similar with the project list asking which analysis pipeline user is going to choose.
                            function one_stop_controller($scope, $mdDialog, $mdColorPalette){
                              //https://127.0.0.1:5985/project/auto2_1547243264820/Null_statistics_input_1547243278164.csv
                              var req = ocpu.call("upload_dataset",{
                                path:"https://metda.fiehnlab.ucdavis.edu/db/project/"+mainctrl.activated_project_id+"/"+nnn.original.attachment_id.replace('+',"%2B")
                              },function(session){
                                sessionn = session
                                session.getObject(function(obj){
                                  ooo = obj
                                })
                              })
                              

                              $scope.select_one_stop_disabled = true
                              $scope.colors = Object.keys($mdColorPalette);
                              var db = new PouchDB('https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/user');
                              db.get(mainctrl.user).then(function(user_doc){
                                uuu = user_doc
                                $scope.projects = uuu.projects
                                $scope.$apply();
                              })

                              $scope.view_project = function(project){
                                projectt = project
                                var db = new PouchDB('https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/project');
                                db.get(project.id).then(function(project_doc){
                                  project_docc = project_doc
                                  $("#view_project_tree_one_stop").jstree('destroy');
                                  $("#view_project_tree_one_stop").jstree({ 'core' : {
                                    'data' : project_doc.tree_structure
                                  }}).bind("select_node.jstree", function (event, data) {
                                    eventt = event
                                    dataa = data
                                    if(dataa.node.original.efp){
                                      $scope.select_one_stop_disabled = false
                                    }else{
                                      $scope.select_one_stop_disabled = true
                                    }
                                    $scope.select_pipeline= function(){
                                      // pickup all the sample metadata for this dataset.
                                      $scope.sample_column_options = delete_element_from_array(Object.keys(ooo.p[0]),'label')
                                      $scope.compound_column_options = delete_element_from_array(Object.keys(ooo.f[0]),'label')
                                      
                                      
                                      $scope.scale_options = scale_options
                                      var sample_columns = Object.keys(ooo.p[0])
                                      $scope.sample_column_level_options = {}
                                      for(var i=0; i< sample_columns.length;i++){
                                        $scope.sample_column_level_options[sample_columns[i]] = unpack(ooo.p, sample_columns[i]).filter(unique)
                                      }
                                      
                                      var compound_columns = Object.keys(ooo.f[0])
                                      $scope.compound_column_level_options = {}
                                      for(var i=0; i< compound_columns.length;i++){
                                        $scope.compound_column_level_options[compound_columns[i]] = unpack(ooo.f, compound_columns[i]).filter(unique)
                                      }
                                      
                                      
                                      console.log(dataa.node.original.id + " is selected.")
                                      // now user selected the dataset he wants to do.
                                      // 1. get the study pipeline. Create a prent list and clear it until there is no parent.
                                      var parent_id = unpack(project_docc.tree_structure,"parent");
                                      var node_id = unpack(project_docc.tree_structure,"id");
                                      new_tree_structure=[];
                                      var parent_list = [project_docc.tree_structure[unpack(project_docc.tree_structure,"id").indexOf(dataa.node.original.id)].parent]
                                      //while(parent_list.length>0){
                                        for(var i=0; i<parent_list.length;i++){
                                          // push it
                                          new_tree_structure.push(project_docc.tree_structure[node_id.indexOf(parent_list[i])])
                                          // and all its children to the new_tree_structure.
                                          var children_index = getAllIndexes(parent_id,parent_list[i])
                                          for(var j=0; j<children_index.length;j++){
                                            new_tree_structure.push(project_docc.tree_structure[children_index[j]])
                                            // push the id to the parent_list
                                            parent_list.push(project_docc.tree_structure[children_index[j]].id)
                                          }
                                        }

                                        new_tree_structure = new_tree_structure.filter(unique)
                                        new_tree_structure = new_tree_structure.filter(x => x.icon=='fa fa-folder')
                                        // needs to correct something. for example, structure.columns of boxcox should be array, but may be string.
                                        for(var i=0; i<new_tree_structure.length;i++){
                                          if(new_tree_structure[i].analysis_type == 'boxcox_transformation'){
                                            if(typeof(new_tree_structure[i].parameters.columns)=='string'){
                                              console.log(new_tree_structure[i].parameters.columns)
                                              new_tree_structure[i].parameters.columns = [new_tree_structure[i].parameters.columns]
                                              console.log(new_tree_structure[i].parameters.columns)
                                            }
                                          }else if(new_tree_structure[i].analysis_type == 'mTIC_normalization'){
                                            if(typeof(new_tree_structure[i].parameters.known_level)=='string'){
                                              console.log(new_tree_structure[i].parameters.known_level)
                                              new_tree_structure[i].parameters.known_level = [new_tree_structure[i].parameters.known_level]
                                              console.log(new_tree_structure[i].parameters.known_level)
                                            }
                                          }
                                        }


                                        $scope.new_tree_structure = new_tree_structure

                                        $scope.go_to_next_tab = function(index){
                                          if($scope.selectedIndex !== ($scope.new_tree_structure.length-1)){
                                            $scope.selectedIndex = $scope.selectedIndex+1
                                            $('#chosen_project_tree_one_stop').jstree("deselect_all");
                                            $('#chosen_project_tree_one_stop').jstree('select_node', $scope.new_tree_structure[$scope.selectedIndex].id);
                                            if($scope.new_tree_structure[$scope.selectedIndex].analysis_type=='fold_change'){
                                              $scope.new_tree_structure[$scope.selectedIndex].fold_change_method_options = fold_change_methods
                                              $scope.$watch("new_tree_structure["+$scope.selectedIndex+"].parameters.column",function(){
                                                var levels = unpack(ooo.p,$scope.new_tree_structure[$scope.selectedIndex].parameters.column).filter(unique)
                                                $scope.new_tree_structure[$scope.selectedIndex].fold_change_direction_options = [{
                                                id:'a_over_b',text:levels[0]+" / "+levels[1]
                                                },{
                                                  id:'b_over_a',text:levels[1]+" / "+levels[0]
                                                }]
                                              })
                                            }else if($scope.new_tree_structure[$scope.selectedIndex].analysis_type=='log_transformation'){
                                              $scope.new_tree_structure[$scope.selectedIndex].log_transformation_method_options = log_transformation_methods
                                            }else if($scope.new_tree_structure[$scope.selectedIndex].analysis_type=='mann_whitney_u_test'){
                                              $scope.new_tree_structure[$scope.selectedIndex].FDR_options = FDR_options
                                              $scope.$watch("new_tree_structure["+$scope.selectedIndex+"].parameters.column",function(){
                                                var levels = unpack(ooo.p,$scope.new_tree_structure[$scope.selectedIndex].parameters.column).filter(unique)
                                                $scope.new_tree_structure[$scope.selectedIndex].alternative_options = [{
                                                  id:'greater',text:levels[0]+" greater than "+levels[1]
                                                },{
                                                  id:'two.sided',text:levels[0]+" not equal to "+levels[1]
                                                },{
                                                  id:'less',text:levels[0]+" less than "+levels[1]
                                                }]
                                            })
                                          }else if($scope.new_tree_structure[$scope.selectedIndex].analysis_type=='welch_t_test'){
                                              $scope.new_tree_structure[$scope.selectedIndex].FDR_options = FDR_options
                                              $scope.$watch("new_tree_structure["+$scope.selectedIndex+"].parameters.column",function(){
                                                var levels = unpack(ooo.p,$scope.new_tree_structure[$scope.selectedIndex].parameters.column).filter(unique)
                                                $scope.new_tree_structure[$scope.selectedIndex].alternative_options = [{
                                                  id:'greater',text:levels[0]+" greater than "+levels[1]
                                                },{
                                                  id:'two.sided',text:levels[0]+" not equal to "+levels[1]
                                                },{
                                                  id:'less',text:levels[0]+" less than "+levels[1]
                                                }]
                                            })
                                          }else if($scope.new_tree_structure[$scope.selectedIndex].analysis_type=='pca'){
                                            $scope.new_tree_structure[$scope.selectedIndex].shape_options = shape_by_options
                                              $scope.new_tree_structure[$scope.selectedIndex].scale_options = scale_options
                                              $scope.new_tree_structure[$scope.selectedIndex].shape_by_options = delete_element_from_array(Object.keys(ooo.p[0]),'label')
                                             $scope.new_tree_structure[$scope.selectedIndex].shape_by_options.push("SINGLE_SHAPE")
                                             $scope.new_tree_structure[$scope.selectedIndex].color_by_options = delete_element_from_array(Object.keys(ooo.p[0]),'label')
                                             $scope.new_tree_structure[$scope.selectedIndex].color_by_options.push("SINGLE_COLOR")

                                             $scope.$watch("new_tree_structure["+$scope.selectedIndex+"].parameters.pair_score_plot.color_by",function(newValue){
                                               new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.color_levels = unpack(ooo.p,new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.color_by).filter(unique)
                                               new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.color = []
                                               for(var i=0;i<new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.color_levels.length;i++){
                                                 if(new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.color_levels.length==1){
                                                   new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.color.push({
                                                     levels:new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.color_levels[i],
                                                     option:"rgba(0,0,0,1)"
                                                   })
                                                 }else{
                                                   new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.color.push({
                                                     levels:new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.color_levels[i],
                                                     option:color_palette.mpn65[i]
                                                   })
                                                 }
                                               }
                                             })
                                             $scope.$watch("new_tree_structure["+$scope.selectedIndex+"].parameters.pair_score_plot.shape_by",function(newValue){
                                               new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.shape_levels = unpack(ooo.p,new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.shape_by).filter(unique)
                                               new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.shape = []
                                               for(var i=0;i<new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.shape_levels.length;i++){
                                                   new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.shape.push({
                                                     levels:new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.shape_levels[i],
                                                     option:shape_palette.ggplot2[i]
                                                   })
                                               }
                                             })





                                             $scope.$watch("new_tree_structure["+$scope.selectedIndex+"].parameters.score_plot.color_by",function(newValue){
                                               new_tree_structure[$scope.selectedIndex].parameters.score_plot.color_levels = unpack(ooo.p,new_tree_structure[$scope.selectedIndex].parameters.score_plot.color_by).filter(unique)
                                               new_tree_structure[$scope.selectedIndex].parameters.score_plot.color = []
                                               for(var i=0;i<new_tree_structure[$scope.selectedIndex].parameters.score_plot.color_levels.length;i++){
                                                 if(new_tree_structure[$scope.selectedIndex].parameters.score_plot.color_levels.length==1){
                                                   new_tree_structure[$scope.selectedIndex].parameters.score_plot.color.push({
                                                     levels:new_tree_structure[$scope.selectedIndex].parameters.score_plot.color_levels[i],
                                                     option:"rgba(0,0,0,1)"
                                                   })
                                                 }else{
                                                   new_tree_structure[$scope.selectedIndex].parameters.score_plot.color.push({
                                                     levels:new_tree_structure[$scope.selectedIndex].parameters.score_plot.color_levels[i],
                                                     option:color_palette.mpn65[i]
                                                   })
                                                 }
                                               }
                                             })
                                             $scope.$watch("new_tree_structure["+$scope.selectedIndex+"].parameters.score_plot.shape_by",function(newValue){
                                               new_tree_structure[$scope.selectedIndex].parameters.score_plot.shape_levels = unpack(ooo.p,new_tree_structure[$scope.selectedIndex].parameters.score_plot.shape_by).filter(unique)
                                               new_tree_structure[$scope.selectedIndex].parameters.score_plot.shape = []
                                               for(var i=0;i<new_tree_structure[$scope.selectedIndex].parameters.score_plot.shape_levels.length;i++){
                                                   new_tree_structure[$scope.selectedIndex].parameters.score_plot.shape.push({
                                                     levels:new_tree_structure[$scope.selectedIndex].parameters.score_plot.shape_levels[i],
                                                     option:shape_palette.ggplot2[i]
                                                   })
                                               }
                                             })





                                             $scope.$watch("new_tree_structure["+$scope.selectedIndex+"].parameters.loading_plot.color_by",function(newValue){
                                               console.log("!")
                                               new_tree_structure[$scope.selectedIndex].parameters.loading_plot.color_levels = unpack(ooo.f,new_tree_structure[$scope.selectedIndex].parameters.loading_plot.color_by).filter(unique)
                                               new_tree_structure[$scope.selectedIndex].parameters.loading_plot.color = []
                                               for(var i=0;i<new_tree_structure[$scope.selectedIndex].parameters.loading_plot.color_levels.length;i++){
                                                 if(new_tree_structure[$scope.selectedIndex].parameters.loading_plot.color_levels.length==1){
                                                   new_tree_structure[$scope.selectedIndex].parameters.loading_plot.color.push({
                                                     levels:new_tree_structure[$scope.selectedIndex].parameters.loading_plot.color_levels[i],
                                                     option:"rgba(0,0,0,1)"
                                                   })
                                                 }else{
                                                   new_tree_structure[$scope.selectedIndex].parameters.loading_plot.color.push({
                                                     levels:new_tree_structure[$scope.selectedIndex].parameters.loading_plot.color_levels[i],
                                                     option:color_palette.mpn65[i]
                                                   })
                                                 }
                                               }
                                               console.log(new_tree_structure[$scope.selectedIndex].parameters.loading_plot.color )
                                             })
                                             $scope.$watch("new_tree_structure["+$scope.selectedIndex+"].parameters.loading_plot.shape_by",function(newValue){
                                               new_tree_structure[$scope.selectedIndex].parameters.loading_plot.shape_levels = unpack(ooo.f,new_tree_structure[$scope.selectedIndex].parameters.loading_plot.shape_by).filter(unique)
                                               new_tree_structure[$scope.selectedIndex].parameters.loading_plot.shape = []
                                               for(var i=0;i<new_tree_structure[$scope.selectedIndex].parameters.loading_plot.shape_levels.length;i++){
                                                   new_tree_structure[$scope.selectedIndex].parameters.loading_plot.shape.push({
                                                     levels:new_tree_structure[$scope.selectedIndex].parameters.loading_plot.shape_levels[i],
                                                     option:shape_palette.ggplot2[i]
                                                   })
                                               }
                                             })
                                          }else if($scope.new_tree_structure[$scope.selectedIndex].analysis_type=='plsda'){

                                            $scope.new_tree_structure[$scope.selectedIndex].shape_options = shape_by_options
                                              $scope.new_tree_structure[$scope.selectedIndex].scale_options = scale_options
                                              $scope.new_tree_structure[$scope.selectedIndex].shape_by_options = delete_element_from_array(Object.keys(ooo.p[0]),'label')
                                             $scope.new_tree_structure[$scope.selectedIndex].shape_by_options.push("SINGLE_SHAPE")
                                             $scope.new_tree_structure[$scope.selectedIndex].color_by_options = delete_element_from_array(Object.keys(ooo.p[0]),'label')
                                             $scope.new_tree_structure[$scope.selectedIndex].color_by_options.push("SINGLE_COLOR")

                                             $scope.$watch("new_tree_structure["+$scope.selectedIndex+"].parameters.pair_score_plot.color_by",function(newValue){
                                               new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.color_levels = unpack(ooo.p,new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.color_by).filter(unique)
                                               new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.color = []
                                               for(var i=0;i<new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.color_levels.length;i++){
                                                 if(new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.color_levels.length==1){
                                                   new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.color.push({
                                                     levels:new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.color_levels[i],
                                                     option:"rgba(0,0,0,1)"
                                                   })
                                                 }else{
                                                   new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.color.push({
                                                     levels:new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.color_levels[i],
                                                     option:color_palette.mpn65[i]
                                                   })
                                                 }
                                               }
                                             })
                                             $scope.$watch("new_tree_structure["+$scope.selectedIndex+"].parameters.pair_score_plot.shape_by",function(newValue){
                                               new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.shape_levels = unpack(ooo.p,new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.shape_by).filter(unique)
                                               new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.shape = []
                                               for(var i=0;i<new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.shape_levels.length;i++){
                                                   new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.shape.push({
                                                     levels:new_tree_structure[$scope.selectedIndex].parameters.pair_score_plot.shape_levels[i],
                                                     option:shape_palette.ggplot2[i]
                                                   })
                                               }
                                             })





                                             $scope.$watch("new_tree_structure["+$scope.selectedIndex+"].parameters.score_plot.color_by",function(newValue){
                                               new_tree_structure[$scope.selectedIndex].parameters.score_plot.color_levels = unpack(ooo.p,new_tree_structure[$scope.selectedIndex].parameters.score_plot.color_by).filter(unique)
                                               new_tree_structure[$scope.selectedIndex].parameters.score_plot.color = []
                                               for(var i=0;i<new_tree_structure[$scope.selectedIndex].parameters.score_plot.color_levels.length;i++){
                                                 if(new_tree_structure[$scope.selectedIndex].parameters.score_plot.color_levels.length==1){
                                                   new_tree_structure[$scope.selectedIndex].parameters.score_plot.color.push({
                                                     levels:new_tree_structure[$scope.selectedIndex].parameters.score_plot.color_levels[i],
                                                     option:"rgba(0,0,0,1)"
                                                   })
                                                 }else{
                                                   new_tree_structure[$scope.selectedIndex].parameters.score_plot.color.push({
                                                     levels:new_tree_structure[$scope.selectedIndex].parameters.score_plot.color_levels[i],
                                                     option:color_palette.mpn65[i]
                                                   })
                                                 }
                                               }
                                             })
                                             $scope.$watch("new_tree_structure["+$scope.selectedIndex+"].parameters.score_plot.shape_by",function(newValue){
                                               new_tree_structure[$scope.selectedIndex].parameters.score_plot.shape_levels = unpack(ooo.p,new_tree_structure[$scope.selectedIndex].parameters.score_plot.shape_by).filter(unique)
                                               new_tree_structure[$scope.selectedIndex].parameters.score_plot.shape = []
                                               for(var i=0;i<new_tree_structure[$scope.selectedIndex].parameters.score_plot.shape_levels.length;i++){
                                                   new_tree_structure[$scope.selectedIndex].parameters.score_plot.shape.push({
                                                     levels:new_tree_structure[$scope.selectedIndex].parameters.score_plot.shape_levels[i],
                                                     option:shape_palette.ggplot2[i]
                                                   })
                                               }
                                             })





                                             $scope.$watch("new_tree_structure["+$scope.selectedIndex+"].parameters.loading_plot.color_by",function(newValue){
                                               console.log("!")
                                               new_tree_structure[$scope.selectedIndex].parameters.loading_plot.color_levels = unpack(ooo.f,new_tree_structure[$scope.selectedIndex].parameters.loading_plot.color_by).filter(unique)
                                               new_tree_structure[$scope.selectedIndex].parameters.loading_plot.color = []
                                               for(var i=0;i<new_tree_structure[$scope.selectedIndex].parameters.loading_plot.color_levels.length;i++){
                                                 if(new_tree_structure[$scope.selectedIndex].parameters.loading_plot.color_levels.length==1){
                                                   new_tree_structure[$scope.selectedIndex].parameters.loading_plot.color.push({
                                                     levels:new_tree_structure[$scope.selectedIndex].parameters.loading_plot.color_levels[i],
                                                     option:"rgba(0,0,0,1)"
                                                   })
                                                 }else{
                                                   new_tree_structure[$scope.selectedIndex].parameters.loading_plot.color.push({
                                                     levels:new_tree_structure[$scope.selectedIndex].parameters.loading_plot.color_levels[i],
                                                     option:color_palette.mpn65[i]
                                                   })
                                                 }
                                               }
                                               console.log(new_tree_structure[$scope.selectedIndex].parameters.loading_plot.color )
                                             })
                                             $scope.$watch("new_tree_structure["+$scope.selectedIndex+"].parameters.loading_plot.shape_by",function(newValue){
                                               new_tree_structure[$scope.selectedIndex].parameters.loading_plot.shape_levels = unpack(ooo.f,new_tree_structure[$scope.selectedIndex].parameters.loading_plot.shape_by).filter(unique)
                                               new_tree_structure[$scope.selectedIndex].parameters.loading_plot.shape = []
                                               for(var i=0;i<new_tree_structure[$scope.selectedIndex].parameters.loading_plot.shape_levels.length;i++){
                                                   new_tree_structure[$scope.selectedIndex].parameters.loading_plot.shape.push({
                                                     levels:new_tree_structure[$scope.selectedIndex].parameters.loading_plot.shape_levels[i],
                                                     option:shape_palette.ggplot2[i]
                                                   })
                                               }
                                             })
                                          
                                          
                                          }else if($scope.new_tree_structure[$scope.selectedIndex].analysis_type=='data_attach'){
                                            $scope.new_tree_structure[$scope.selectedIndex].target_data_text = $scope.new_tree_structure[
                                              unpack($scope.new_tree_structure,"id").indexOf(project_docc.tree_structure[unpack(project_docc.tree_structure,"attachment_id").indexOf($scope.new_tree_structure[$scope.selectedIndex].parameters.source.split("/").slice(-1)[0])].parent)
                                              ].text 
                                            
                                            for(var i = 0; i<$scope.new_tree_structure[$scope.selectedIndex].parameters.compound_infos.length;i++){
                                              $scope.new_tree_structure[$scope.selectedIndex].parameters.compound_infos[i].attaching_data_name = $scope.new_tree_structure[unpack($scope.new_tree_structure,"id").indexOf(gsub(".csv","",[$scope.new_tree_structure[$scope.selectedIndex].parameters.compound_infos[i].node_id])[0])].text
                                              if(typeof($scope.new_tree_structure[$scope.selectedIndex].parameters.compound_infos[i].column) === 'string'){
                                                $scope.new_tree_structure[$scope.selectedIndex].parameters.compound_infos[i].column = [$scope.new_tree_structure[$scope.selectedIndex].parameters.compound_infos[i].column]
                                              }
                                            }
                                            
                                            
                                            for(var i = 0; i<$scope.new_tree_structure[$scope.selectedIndex].parameters.sample_infos.length;i++){
                                              
                                              $scope.new_tree_structure[$scope.selectedIndex].parameters.sample_infos[i].attaching_data_name = $scope.new_tree_structure[unpack($scope.new_tree_structure,"id").indexOf(gsub(".csv","",[$scope.new_tree_structure[$scope.selectedIndex].parameters.sample_infos[i].node_id])[0])].text
                                              
                                              console.log($scope.new_tree_structure[$scope.selectedIndex].parameters.sample_infos[i].attaching_data_name)
                                              
                                              
                                              if(typeof($scope.new_tree_structure[$scope.selectedIndex].parameters.sample_infos[i].column) === 'string'){
                                                $scope.new_tree_structure[$scope.selectedIndex].parameters.sample_infos[i].column = [$scope.new_tree_structure[$scope.selectedIndex].parameters.sample_infos[i].column]
                                              }
                                            }
                                            
                                            
                                            
                                          
                                            
                                          }else if($scope.new_tree_structure[$scope.selectedIndex].analysis_type=='subset'){
                                            $scope.new_tree_structure[$scope.selectedIndex].target_data_text = $scope.new_tree_structure[
                                              unpack($scope.new_tree_structure,"id").indexOf(project_docc.tree_structure[unpack(project_docc.tree_structure,"attachment_id").indexOf($scope.new_tree_structure[$scope.selectedIndex].parameters.source.split("/").slice(-1)[0])].parent)
                                              ].text 
                                          }else if($scope.new_tree_structure[$scope.selectedIndex].analysis_type=='chemrich'){
                                            $scope.chemrich_column_options = $scope.compound_column_options.concat(['label',"p_values","median fold change"])
                                          }else if($scope.new_tree_structure[$scope.selectedIndex].analysis_type=='heatmap'){
                                            $scope.new_tree_structure[$scope.selectedIndex].color_scale_options = color_scale_options
                                            $scope.new_tree_structure[$scope.selectedIndex].order_sample_by_options = ["as is","dendrogram"].concat($scope.sample_column_options)
                                            $scope.new_tree_structure[$scope.selectedIndex].order_compound_by_options = ["as is","dendrogram"].concat($scope.compound_column_options)
                                            
                                            
                                            if(typeof($scope.new_tree_structure[$scope.selectedIndex].parameters.order_sample_by)=='string'){
                                              $scope.new_tree_structure[$scope.selectedIndex].parameters.order_sample_by=[$scope.new_tree_structure[$scope.selectedIndex].parameters.order_sample_by]
                                            }
                                            
                                            if(typeof($scope.new_tree_structure[$scope.selectedIndex].parameters.order_compound_by)=='string'){
                                              $scope.new_tree_structure[$scope.selectedIndex].parameters.order_compound_by=[$scope.new_tree_structure[$scope.selectedIndex].parameters.order_compound_by]
                                            }
                                            
                                          }else if($scope.new_tree_structure[$scope.selectedIndex].analysis_type=='one_way_boxplot'){
                                            
                                            
                                            $scope.new_tree_structure[$scope.selectedIndex].change_levels = function(column){
                                              $scope.new_tree_structure[$scope.selectedIndex].parameters.levels = $scope.sample_column_level_options[column].join("||")
                                              
                                            }
                                            $scope.new_tree_structure[$scope.selectedIndex].style_options = ["default", "classic", "Louise Fong"]
                                              $scope.new_tree_structure[$scope.selectedIndex].format_options = ['svg','png']
                                            
                                          }

                                          }else{
                                            $scope.selectedIndex = 0
                                          }
                                          }
                                          
                                          
                                          
                                          
                                        $scope.go_to_previous_tab = function(index){
                                          $scope.selectedIndex = $scope.selectedIndex-1
                                        }
                                        $scope.confirm_pipeline = function(){
                                          // go to R and perform these statistical analysis.!!!!!!
                                          // now call function to get the project.
                                         var db_user = new PouchDB('https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/user');
                                            db_user.get(mainctrl.user).then(function(user_doc){
                                              uuu = user_doc
                                              
                                              uuu.projects.splice(unpack(uuu.projects,"id").indexOf(mainctrl.activated_project_id),1)
                                             console.log(uuu.projects)
                                             
                                              uuu.projects.push({
                                                id:"MX436236_1550072080139",
                                                name:"MX436236"
                                              })
                                              console.log(uuu.projects)
                                              
                                              uuu.activated_project = "MX436236_1550072080139"
                                              
                                              
                                              
                                              db_user.put(uuu).then(function(){
                                                console.log(uuu.projects)
                                                var db_project = new PouchDB('https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/project');
                                                db_project.get(uuu.activated_project, {attachments: false}).then(function(project_doc){
                                                  ppp = project_doc
                                                  update_jstree(project_doc)
                                                  $mdDialog.hide();
                                                })
                                              })
                                              
                                            })
                                                        
                                          
                                        }

                                     //}
                                     $("#chosen_project_tree_one_stop").jstree({
                                       'core' : {
                                         'data' : new_tree_structure
                                        }
                                     }).on('loaded.jstree', function() {
                                       $scope.selectedIndex = 0
                                     })




                                    }

                                    $scope.$apply();
                                  });
                                })
                              }

                              $scope.cancel = function(){
                                $mdDialog.hide();
                              }

                            }
                             $mdDialog.show({
                                controller: one_stop_controller,
                                templateUrl: 'one_stop_modal.html',
                                parent: angular.element(document.body),preserveScope : true,
                                autoWrap : false,
                                clickOutsideToClose:false,
                                multiple: true
                              })
                              .then(function() {
                                console.log("one_stop is applied.")
                              }, function() {
                                console.log("one_stop was not applied.")
                              });

                          }
                        }
                        ,"Edit":{
                           "label":"Edit Dataset",
                          "icon":"fa fa-edit",
                          "_disabled":!editable,
                          "action":function(obj){
                            nnn = $node
                            ooo = obj
                            
                            // open a modal to upload dataset.
                            $mdDialog.show({
                              locals: { node: clicked_node, activated_project:activated_project},
                              controller: ["$scope","$mdDialog","node", "activated_project",edit_data],
                              templateUrl: 'edit_data.html',
                              parent: angular.element(document.body),preserveScope : false,
                              clickOutsideToClose:false
                            })
                            .then(function(answer) {
                              $scope.status = 'You said the information was "' + answer + '".';
                            }, function() {
                              $scope.status = 'You cancelled the dialog.';
                            });
                            
                            
                            
                          }
                        }
                      }


                      return items;
                    }
                  }
                })
                .on('loaded.jstree', function() {
                    var deselect_all_interval = setInterval(function() {// unselect all nodes every 0.01 seconds to prevent mislicking from each module.
                      if($("#jstree").jstree("get_selected").length===0){
                        //clearInterval(deselect_all_interval)
                      }else{
                        $('#jstree').jstree("deselect_all");

                      }
                    }, 10);
                  })
                  .bind("select_node.jstree", function (event, data) {
                  // if the mainctrl.waiting_user_to_select_data is true, this means that the user is trying to select a dataset to analysis. Then check if the user selected the right format (.csv). If so, then check if the dataseleted match the module requirement. If so, select this project and parse the data to the module, make mainctrl.waiting_user_to_select_data false, and then $mdDialog.hide().
                  if(waiting_user_to_select_data){ // user is expecting to use a dataset.
                    console.log("single click triggered")
                    eee = event
                    ddd = data
                    ctrl.data_source = data.node
                    console.log("User is trying to select a dataset from the database.")
                    // 1. check if the user selected the right format
                    if(['subset','pca','mann_whitney_u_test','student_t_test','welch_t_test','paired_t_test','wilcoxon_signed_rank_test','anova','fdr_correction','welch_anova','kruskal_wallis_test','repeated_anova','friedman_test','two_way_anova','two_way_mixed_anova','jonckheere_terpstra_test','simple_linear_regression','logistic_regression','shapiro_wilk_test','fold_change','data_attach','one_way_boxplot','idexchanger','metamapp','chemrich','log_transformation','plsda','QRILC','rm_0_sd','power_transformation','boxcox_transformation','outlier_treatment','group_average','correlation','partial_correlation','heatmap','RFmiss','kNNmiss','SVDmiss','constImp','mTIC','sum_normalization','median_normalization','PQN_normalization','quantile_normalization','linear_normalization','liwong_normalization','cubic_normalization','batchratio_normalization','serrf_normalization','loess_normalization','volcano_plot'].includes(mainctrl.the_waiting_module)){ // this modules requires csv type file.
                    if(ddd.node.original.attachment_id === undefined){
                      console.log("User clicked a node with attachment_id undefined.")
                      return;
                    }
                    if(ddd.node.original.attachment_id.substr(ddd.node.original.attachment_id.length - 4) === '.csv'){
                      cfpLoadingBar.start();
                      console.log("user selected a right format dataset.")
                      // 2. read attachment. //!!! need a clock here indicating that the file is being downloading.
                      var req=ocpu.call("upload_dataset",{
                        path:"https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/project/"+ mainctrl.activated_project_id +"/"+ddd.node.original.attachment_id,
                        project_id:mainctrl.activated_project_id,
                        module:mainctrl.the_waiting_module,
                        index_of_data:index_of_data
                      },function(session){
                        console.log(session)
                        session.getObject(function(obj){
                          console.log(index_of_data)
                             if(index_of_data==1){
                               ooo = obj
                               ctrl.make_data_read_here(obj)
                             }else if(index_of_data==2){
                               ooo2 = obj
                               ctrl.make_data_read_here2(obj)
                             }else{
                               console.log("Error: Wrong index_of_data: " + index_of_data)
                             }
                             //mainctrl.waiting_user_to_select_data = false
                             console.log("Dataset read. Closing the panel.")
                             cfpLoadingBar.complete();
                             $mdSidenav('right').close();
                             $scope.$apply();
                        })
                      }).done(function(){
                        console.log("Data read from the database.")
                      }).fail(function(){
                        cfpLoadingBar.complete();
                        alert("Error: " + req.responseText)
                      })

                    }else{
                      if(ddd.node.icon == 'fa fa-folder'){ // if user clicked a folder, then user is probabaly trying to open a folder and select a dataset inside this folder. Then no need to warn user. Otherwise, warn user that you have to select '.csv' file.
                        console.log("user clicked a folder. It is fine.")
                      }else{
                        alert("You can only select '.csv' files.")
                      }
                    }
                    }else if(['data_attach_add_sample_info','data_attach_add_compound_info'].includes(mainctrl.the_waiting_module)){
                      cfpLoadingBar.start();
                      if(ddd.node.original.attachment_id === undefined){
                        console.log("User clicked a node with attachment_id undefined.")
                        cfpLoadingBar.complete();
                        return;
                      }
                      if(ddd.node.original.attachment_id.substr(ddd.node.original.attachment_id.length - 4) === '.csv'){
                        console.log("user selected a right format dataset.")
                        // 2. read attachment. //!!! need a clock here indicating that the file is being downloading.
                        Papa.parse("https://metda.fiehnlab.ucdavis.edu/db/project/"+ mainctrl.activated_project_id +"/"+ddd.node.original.attachment_id, {
                        	download: true,
                        	complete: function(results) {
                        		rrr = results;
                        		// 3 send dataset to the module. Make the results.data the format as the textarea.
                        		input_txt = results.data.map(x=>x.join("\t")).join("\n")
                		       var req=ocpu.call("upload_data_from_input",{
                             txt:input_txt
                           },function(session){
                             sss = session
                             session.getObject(function(obj){
                               ooo = obj
                               ctrl[special_function_name](obj,ddd.node.original.attachment_id,ddd.node.id) // special_function_name: apply the special_function_name function when the data is read from the database
                               //mainctrl.waiting_user_to_select_data = false
                               console.log("Dataset read. Closing the panel.")
                               $mdSidenav('right').close();
                               cfpLoadingBar.complete();
                               $scope.$apply();
                             })
                           }).done(function(){
                             console.log("Data read from the textarea.")
                           }).fail(function(){
                             alert("Error: " + req.responseText)
                             cfpLoadingBar.complete();
                           })
                        	}
                        });


                      }else{
                      if(ddd.node.icon == 'fa fa-folder'){ // if user clicked a folder, then user is probabaly trying to open a folder and select a dataset inside this folder. Then no need to warn user. Otherwise, warn user that you have to select '.csv' file
                        cfpLoadingBar.complete();
                        console.log("user clicked a folder. It is fine.")
                      }else{
                        cfpLoadingBar.complete();
                        alert("You can only select '.csv' files.")
                      }
                    }

                    }else{
                      cfpLoadingBar.complete();
                      alert("see console log."); console.log("Can't find the module "+ mainctrl.the_waiting_module +".")
                    }
                  }
                   })

              }


      mainctrl.toggleLeft = function(componentId = 'right',waiting_user_to_select_data=false, special_function_name='',index_of_data = 1) {
        $("#jstree").jstree("destroy");
        $("#jstree").text("Loading...")
        var db = new PouchDB('https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/user');
        // try to get the activated project. If there is activated project, extract tree and show it. Otherwise, display the project list as tree.
        db.get(mainctrl.user).then(function(user_doc){
          uuu = user_doc
          if(user_doc.activated_project !== null){
            var db_project = new PouchDB('https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/project');
            db_project.get(user_doc.activated_project, {attachments: false}).then(function(project_doc){
              activated_project = project_doc._id
              console.log(activated_project)
              mainctrl.activated_project_name = project_doc.name
              mainctrl.activated_project_id = project_doc._id
              update_jstree(project_doc,waiting_user_to_select_data,special_function_name,index_of_data)
              $scope.$apply()
            })
          }else{
            $("#jstree").text("No project is currently activated.")
            mainctrl.activated_project_name = "Select a Project"
            mainctrl.activated_project_id = undefined
            $scope.$apply()
          }


          mainctrl.change_project_modal = function(ev) {
            $mdDialog.show({
              controller: show_all_projects,
              templateUrl: 'projects.html',
              parent: angular.element(document.body),preserveScope : true,
              targetEvent: ev,autoWrap : false,
              clickOutsideToClose:false
            })
            .then(function() {
              console.log("activated project changed.")
            }, function() {
              console.log("activated project didn't change.")
            });
          };
        })

        //return function() {
          $mdSidenav(componentId).toggle();
        //};
        return(true)
      }

      function upload_data($scope, $mdDialog, node, activated_project){
        $scope.upload_dataset = function(file, errFiles){
          fff = file
          $scope.f = file;
          $scope.errFile = errFiles && errFiles[0];
          if (file) {
             var req=ocpu.call("upload_dataset",{
               path:file,
               project_id:"going_to_upload_dataset_to_database"
             },function(session){
               console.log("!")
               sss = session
               session.getObject(function(obj){
                 $scope.confirm_and_upload_dataset_button_show = true
                 ooo = obj
                 var dataSet = ooo.data_matrix
                 $scope.confirm_and_upload_text = "Confirm and Upload This Dataset"
                 $scope.confirm_and_upload_dataset = function(){
                   //var dataSet = ooo.data_matrix
                   $scope.confirm_and_upload_text = "Uploading"
                   nnn = node
                   aaa = activated_project
                   // add the data as .csv attachment. modify the jstree structure. refresh jstree.
                  var db_project = new PouchDB('https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/project');
                  db_project.get(activated_project, {attachments: true}).then(function(project_doc){
                    ppp = project_doc
                    var time_string = get_time_string()
                    var filename = fff.name
                    var fileid;
                    if(file.type==='text/csv'){
                      filename = filename.substring(0, filename.length - 4);
                    }else{
                      filename = filename.substring(0, filename.length - 5);
                    }
                    
                    var fileid = filename + "_" + time_string + ".csv"
                    var filename = filename + '.csv'
                    //!!! check if the filename is taken. If it is taken. Add a 2 at tail.
                    if(project_doc['_attachments']===undefined){
                      project_doc['_attachments'] = {}
                    }
                    var existing_attachment_name = Object.keys(project_doc['_attachments']).map(x => x.substring(0, x.length - 18)) // 18 = + "_".length + timestring.length + ".csv".length
                    if(existing_attachment_name.includes(filename.substring(0,filename.length - 4))){
                      var r = confirm("The Dataset '"+filename+"' already exists (same file name). Do you want to replace it?");
                      if(r){ // even replace, still use the new id because we want to track time.However, the dataSet is replaced and the tree structure should also be relaced.
                        // replace tree_structure.
                        // 1. locate node.
                        ppp = project_doc
                        var node_index = unpack(project_doc.tree_structure,"attachment_id").map(x => x===undefined? x:x.substring(x, x.length - 18)).indexOf(filename.substring(0,filename.length - 4));
                        // !!. Later, we can choose not to delete the attachment or the node if we think they are valuable.
                        // 2. delete corresponding attachment
                        var deleting_attachment_id = unpack(project_doc.tree_structure,"attachment_id")[node_index]
                        delete project_doc['_attachments'][deleting_attachment_id]
                        /*db_project.removeAttachment(activated_project, deleting_attachment_id, project_doc._rev, function(){
                          console.log("attachment deleted.")
                        }).catch(function(err){
                          console.log("Attachment is not deleted. Error: " + err)
                        })*/
                        // 3. delete this node.
                        project_doc.tree_structure.splice(node_index,1);
                        // 4. add new attachment
                        /*
                        project_doc['_attachments'][fileid] = {
                          content_type:"application/vnd.ms-excel",
                          "data": btoa(unescape(encodeURIComponent(Papa.unparse(dataSet))))
                        }*/
                        // 5. add new node.
                        project_doc.tree_structure.push({
                          "id":fileid,
                          "parent":node.id,
                          "text":filename,
                          "icon":"fa fa-file-excel-o",
                          "attachment_id":fileid,
                          "efp":true
                        })
                        var new_node = {
                          "id":fileid,
                          "parent":node.id,
                          "text":filename,
                          "icon":"fa fa-file-excel-o",
                          "attachment_id":fileid,
                          "efp":true
                        }

                      }else{ // if not replace, add a '+' to the filename.
                        filename = filename.substring(0, filename.length - 4);
                        filename = filename + "+" + ".csv"
                        /*project_doc['_attachments'][fileid] = {
                          content_type:"application/vnd.ms-excel",
                          "data": btoa(unescape(encodeURIComponent(Papa.unparse(dataSet))))
                        }*/
                        project_doc.tree_structure.push({
                          "id":fileid,
                          "parent":node.id,
                          "text":filename,
                          "icon":"fa fa-file-excel-o",
                          "attachment_id":fileid,
                          "efp":true
                        })
                        var new_node = {
                          "id":fileid,
                          "parent":node.id,
                          "text":filename,
                          "icon":"fa fa-file-excel-o",
                          "attachment_id":fileid,
                          "efp":true
                        }

                      }

                    }else{
                      /*project_doc['_attachments'][fileid] = {
                        content_type:"application/vnd.ms-excel",
                        "data": btoa(unescape(encodeURIComponent(Papa.unparse(dataSet))))
                      }*/
                      project_doc.tree_structure.push({
                        "id":fileid,
                        "parent":node.id,
                        "text":filename,
                        "icon":"fa fa-file-excel-o",
                        "attachment_id":fileid,
                        "efp":true
                      })
                      var new_node = {
                          "id":fileid,
                          "parent":node.id,
                          "text":filename,
                          "icon":"fa fa-file-excel-o",
                          "attachment_id":fileid,
                          "efp":true
                        }

                    }
                    /*db_project.put(project_doc).then(function(){
                      update_jstree(project_doc)
                      $mdDialog.hide();
                    })*/
                     var req = ocpu.call("confirm_and_upload_dataset",{
                       path:file,
                       project_id:mainctrl.activated_project_id,
                       new_node:new_node,
                       tree_structure:project_doc.tree_structure
                     },function(session){
                       $scope.confirm_and_upload_text = "Confirm and Upload This Dataset"
                       update_jstree(project_doc)
                       $mdDialog.hide();
                     }).fail(function(){
                         alert("Error: " + req.responseText)
                         $scope.confirm_and_upload_text = "Confirm and Upload This Dataset"
                       });

                  })
                 }

                 if(typeof(uploadDataTablePreview)!=='undefined'){
                   uploadDataTablePreview.destroy();
                   $('#upload_data_table_preview').empty();
                 }
                 uploadDataTablePreview = $('#upload_data_table_preview').DataTable({
                    data: dataSet,
                    columns: ooo.data_matrix[0].map(function(x, index){return {title:""}}),
                    "ordering": false,
                    "scrollX": true,
                    "scrollY": "200px",
                    "scrollCollapse": true,
                    deferRender:true,
                 });
                 $scope.upload_data_table_summary = "<p>Your dataset contains "+ooo.p.length+" samples and "+ooo.f.length+" compounds. Sample information includes <code>"+Object.keys(ooo.p[0]).join(", ")+"</code>, while compound information includes <code>"+Object.keys(ooo.f[0]).join(", ")+"</code>.</p>"
                 $scope.$apply();
               })
             }).done(function(){
               $scope.$apply(function(){file.progress = 100;})
             }).fail(function(){
               alert("Error: " + req.responseText)
             });
          }

        }

        $scope.cancel = function(){
          $mdDialog.hide();
        }
      }
      
      
      
      
      function edit_data($scope, $mdDialog, node, activated_project){
        $scope.download_text="Download"
        $scope.upload_text = "Upload the Edited File"
        $scope.download = function(){
          $scope.download_text ="Downloading"
          Papa.parse("https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/project/"+activated_project+"/"+node.original.attachment_id.replace('+',"%2B"), {
          	download: true,
          	complete: function(results) {
          	  $scope.download_text="Downloaded"
          		rrr = results
          		download_csv(Papa.unparse(rrr), node.original.text.substr(node.original.text.length - 4) === '.csv'? node.original.text : node.original.text+".csv")
          		$scope.$apply()
          	}
          });
        }
        
       nnn = node
       aaa = activated_project
        $scope.upload_dataset = function(file, errFiles){
          $scope.upload_text = "Uploading"
          var new_node = {
            "id":node.original.id,
            "parent":node.original.parent,
            "text":node.original.text,
            "icon":"fa fa-file-excel-o",
            "attachment_id":node.original.attachment_id,
            "efp":true
            }
            
            var db_project = new PouchDB('https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/project');
            db_project.get(activated_project, {attachments: false}).then(function(project_doc){
              ppp = project_doc
              var req = ocpu.call("confirm_and_upload_dataset",{
                 path:file,
                 project_id:activated_project,
                 new_node:new_node,
                 tree_structure:project_doc.tree_structure
               },function(session){
                 update_jstree(project_doc)
                 $scope.upload_text = "Edited Dataset Uploaded! closing in 2 seconds..."
                 $scope.$apply();
                 setTimeout(function () {
                   $mdDialog.hide();
                 }, 2000);
               }).fail(function(){
                   alert("Error: " + req.responseText)
                   $scope.upload_text = "Upload the Edited File"
                 });
              
            })
                    
                    

          
        }

        $scope.cancel = function(){
          $mdDialog.hide();
        }
      }
      

      function show_all_projects($scope, $mdDialog, $mdColorPalette) {



       $scope.show_tutorial = function(tutorial_name) {
          $mdDialog.show({
            locals: { tutorial_name:tutorial_name},
            controller: ["$scope","$mdDialog","$mdColorPalette","$sce","tutorial_name",tutorial_controller],
            templateUrl: 'tutorial.html',
            parent: angular.element(document.body),preserveScope : true,
            autoWrap : true,
            multiple : true,
            clickOutsideToClose:true
          })
        };





        var focused_project;
        $scope.new_project_modal = function() {
            var new_name = prompt("How would you like to name your new project?");
            if(new_name !== null){
            //check the validity of the new project
            var db = new PouchDB('https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/user');
            db.get(mainctrl.user).then(function(user_doc){
              if(unpack(user_doc.projects,"name").map(x=>x.toUpperCase()).includes(new_name.toUpperCase())){
                alert("The name '"+new_name+"' is already taken (case insensitive). Change a new one!")
              }else{
                var currentDate = new Date();
                var timestamp = currentDate.getTime();
                var new_project_id = new_name + "_" + timestamp
                // creat new project.add new project to project document. update user.projects.
                var db_project = new PouchDB('https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/project');
                var new_project = {
                  "_id":new_project_id,
                  "name":new_name,
                  "tree_structure":[{id:new_project_id, parent:"#", text:new_name, icon:"fa fa-folder"}],
                  "analysis_type":"new_project"
                }
                db_project.put(new_project).then(function(){
                  var new_project_in_user = {
                    id:new_project_id,
                    name:new_name,
                  }
                  user_doc.projects.push(new_project_in_user)
                  $scope.projects = user_doc.projects
                  $scope.$apply();
                db.put(user_doc).then(function(){
                  console.log("new project added")
                }).catch(function(err){
                  console.log(err)
                })
                }).catch(function (err) {
                  console.log(err)
                });
              }

            })
            }

          };

        $scope.delete_project_modal = function() {
          if(focused_project === undefined){
            console.log("No project is selected yet.")
          }else{
            var r = confirm("DO YOU REALLY WANT TO DELETE THE PROJECT '"+focused_project.name+"'?");
            if(r){
              // delete project from user doc. add deleted project to user doc. delete the view_project_tree
              // !!! check if this is a activated project!!!
              var db = new PouchDB('https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/user');
              db.get(mainctrl.user).then(function(user_doc){
                user_doc.projects.splice(unpack(user_doc.projects,"id").indexOf(focused_project.id),1)
                if(user_doc.deleted_projects===null || user_doc.deleted_projects === undefined){
                  user_doc.deleted_projects = [focused_project]
                }else{
                  user_doc.deleted_projects.push(focused_project)
                }
                db.put(user_doc).then(function(){
                  $scope.projects = user_doc.projects
                  $("#view_project_tree").text("select a project and view what's inside")
                  $scope.$apply();
                })
              })

            }else{
              console.log("cancelled.")
            }
          }

        }

        $scope.colors = Object.keys($mdColorPalette);

        var db = new PouchDB('https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/user');
        db.get(mainctrl.user).then(function(user_doc){
          uuu = user_doc
          $scope.projects = uuu.projects
          $scope.$apply();
        })

        $scope.view_project = function(project){
          focused_project = project
          var db = new PouchDB('https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/project');
          db.get(project.id).then(function(project_doc){
            $("#view_project_tree").jstree('destroy');
            console.log(project_doc.tree_structure)
            $("#view_project_tree").jstree({ 'core' : {
                'data' : project_doc.tree_structure
            }});
          })

        }



        $scope.activate_project = function(){
          if(focused_project === undefined){
            console.log("No project is selected yet.")
          }else{
            // make focused_project.id the activated project. update jstree.
            var db_project = new PouchDB('https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/project');
            db_project.get(focused_project.id).then(function(project_doc){
              var db_user = new PouchDB('https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/user');
              db_user.get(mainctrl.user).then(function(user_doc){
                activated_project = focused_project.id
                user_doc.activated_project = focused_project.id
                mainctrl.activated_project_name = focused_project.name
                mainctrl.activated_project_id = focused_project.id
                db_user.put(user_doc).then(function(){
                  update_jstree(project_doc)
                  $mdDialog.hide();
                }).catch(function(err){
                  console.log(err)
                })
              })
            })
          }

        }

        $scope.cancel = function(){
          $mdDialog.hide();
        }

      }


      mainctrl.select_project = function(){
            if(('#tree').jstree('get_selected') === undefined){
              alert("You have to select a project.")
            }else{
              var selected_project_id = ('#tree').jstree('get_selected')
              mainctrl.update_tree(selected_project_id)
            }
          }


      function save_result_to_database($scope, $mdDialog, $mdColorPalette, to_be_saved) {
      $scope.save_button_text = "Save"
      console.log(to_be_saved)
      var db_project = new PouchDB('https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/project');
          db_project.get(mainctrl.activated_project_id).then(function(project_doc){
            ppp = project_doc
            $("#tree_for_save").jstree("destroy");
            $("#tree_for_save").jstree({'core':{
              'data':ppp.tree_structure,
              'multiple':false, // cannot select multiple nodes.
              'expand_selected_onload':true,
              'check_callback' : true
            },
                      "plugins" : ["state"]}).bind("select_node.jstree", function (event, data) {
              eee = event;ddd = data;
            })
            /*.on('loaded.jstree', function() {
              $("#tree_for_save").jstree('open_all');
            });*/
          })

      $scope.save = function(){

        if(ddd.node.icon === 'fa fa-folder'){


          $scope.save_button_text = "Saving"

          var db_project = new PouchDB('https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/project');
          db_project.get(mainctrl.activated_project_id, {attachments: false}).then(function(project_doc){


              ttt = to_be_saved
              // trying to save result. The result must be in a form of [{},{},{}], which is a folder of the tree. In one of the {}, there is a main key indicating that this is the folder node. If the main is not found, then everything will be added to the user clicked node. For all the nodes that are not folder node, must have 'saving_content' and 'content_type' for adding the attachments. Also, these nodes's parent is to be determined by the user click.
              to_be_saved_to_the_tree = JSON.parse(JSON.stringify(to_be_saved));
              for(var i=0; i<to_be_saved.length;i++){
                if(to_be_saved_to_the_tree[i].main !== undefined){// this means this is the folder node.
                  delete to_be_saved_to_the_tree[i].attachment_id;
                  delete to_be_saved_to_the_tree[i].main;
                }
                // check if the filename (text) is taken.
                var sibling_node_indexes = getAllIndexes(unpack(project_doc.tree_structure,'parent'),ddd.node.id)
                var all_node_text = unpack(project_doc.tree_structure,'text')
                var sibling_names = sibling_node_indexes.map(x => all_node_text[x])

                while(sibling_names.includes(to_be_saved_to_the_tree[i].text)){
                  if(to_be_saved_to_the_tree[i].icon === "fa fa-folder"){
                    to_be_saved_to_the_tree[i].text = to_be_saved_to_the_tree[i].text + "+"
                  }else if(to_be_saved_to_the_tree[i].icon === "fa fa-file-excel-o"){
                    to_be_saved_to_the_tree[i].text = to_be_saved_to_the_tree[i].text.substring(0, to_be_saved_to_the_tree[i].text.length - 4) + "+" + ".csv"
                  }
                }
                delete to_be_saved_to_the_tree[i].saving_content;
                delete to_be_saved_to_the_tree[i].content_type;
                if(to_be_saved_to_the_tree[i].parent==undefined){to_be_saved_to_the_tree[i].parent = ddd.node.id}
                project_doc.tree_structure = project_doc.tree_structure.concat(to_be_saved_to_the_tree[i])
                console.log(i +' is done.')
              }
              console.log("Trying to put.")
              ppp = project_doc

              db_project.put(project_doc).then(function(){
                console.log("Putting the attachments")
                console.log(mainctrl.activated_project_id)
                tttt = to_be_saved
                var put_attachment_req = ocpu.call("put_attachment",{
                  project_ID:mainctrl.activated_project_id,
                  to_be_saved:to_be_saved
                },function(session){
                  console.log(session)
                  sss = session
                  $scope.save_button_text = "Save"
                  $mdDialog.hide();
                  mainctrl.toggleLeft()
                  console.log("Dataset Saved.")
                  $scope.$apply()
                })
              })
          })




        }else{
          alert("You can only select a 'folder' to save your result.")
        }

      }




      $scope.cancel = function(){
        $mdDialog.hide();
      }

    }

      mainctrl.save_result_modal = function(to_be_saved){
      $mdDialog.show({
        locals:{to_be_saved: to_be_saved},
        controller: save_result_to_database,
        templateUrl: 'save_result_to_database.html',
        parent: angular.element(document.body),preserveScope : true,
        //targetEvent: ev,
        clickOutsideToClose:false
      })
      .then(function() {
        console.log("activated project changed.")
      }, function() {
        console.log("activated project didn't change.")
      });
}









	})


//.Call(C_Cdqrls, x * wts, y * wts, tol, FALSE)




