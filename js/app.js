(function () {
  angular.module('blankapp', ['ui.router','ngMaterial', 'ngMessages', 'ngMdIcons', 'ngSanitize', 'ngAnimate', 'ngRoute', 'ngFileUpload','ngCookies', 'mdColorPicker','angular-loading-bar'])
  .service("get_filename_service", function(){
      return {
        get_filename:function(tree_structure,pending_filename,sibling_id){
              // get filename.
              var tree = tree_structure
              var id=[];var parent=[];var text=[];
              tree.map(function(x){
                id.push(x.id);parent.push(x.parent);text.push(x.text)
              })
              var input_parent = parent[id.indexOf(sibling_id)]
              var sibling_text_index = parent.reduce((a, e, i) => (e === input_parent) ? a.concat(i) : a, [])
              var sibling_text = sibling_text_index.map(i => text[i]);
              var sibling_text_duplicates_index = sibling_text.reduce((a, e, i) => (e.indexOf(pending_filename)!==-1) ? a.concat(i) : a, [])
              if(sibling_text_duplicates_index.length==0){
                var filename =pending_filename
              }else{
                var sibling_text_duplicates = sibling_text_duplicates_index.map(i => sibling_text[i]);
                var sibling_text_duplicates_numbers = sibling_text_duplicates.map(function(x){ return Number(x.replace(pending_filename,"").replace("_",""))})
                if(isNaN(sibling_text_duplicates_numbers[0])){
                  sibling_text_duplicates_numbers = 0
                  var filename =pending_filename+"_"+1
                }else{
                  var filename =pending_filename+"_"+Number(Math.max(...sibling_text_duplicates_numbers)+1)
                }
              }
              return(filename)
        }
      }
    })
  .service("get_parent_service",function(){
      return {
        get_parent:function(tree_structure,sibling_id){
          var tree = tree_structure
          var id=[];var parent=[];var text=[];
          tree.map(function(x){
            id.push(x.id);parent.push(x.parent);text.push(x.text)
          })
          var input_parent = parent[id.indexOf(sibling_id)]
          return(input_parent)
        }
      }
    })
  .controller("main_controller", function($scope, $mdToast, $mdDialog, get_parent_service, get_filename_service){}).config(['ngMdIconServiceProvider', function(ngMdIconServiceProvider) {
        ngMdIconServiceProvider
            // Add single icon
            .addShape('standby', '<path d="M13 3.5h-2v10h2v-10z"/><path d="M16.56 5.94l-1.45 1.45C16.84 8.44 18 10.33 18 12.5c0 3.31-2.69 6-6 6s-6-2.69-6-6c0-2.17 1.16-4.06 2.88-5.12L7.44 5.94C5.36 7.38 4 9.78 4 12.5c0 4.42 3.58 8 8 8s8-3.58 8-8c0-2.72-1.36-5.12-3.44-6.56z"/>')
            // Get an existing icon
            .addShape('custom-delete', ngMdIconServiceProvider.getShape('delete'))
            // Add multiple icons
            .addShapes({
                'marker': '<path d="M18.632 8.21A6.632 6.632 0 0 1 12 14.843a6.632 6.632 0 0 1-6.632-6.63A6.632 6.632 0 0 1 12 1.578a6.632 6.632 0 0 1 6.632 6.63zM12 0C7.465 0 3.79 3.676 3.79 8.21c0 3.755 2.52 6.917 5.96 7.895L12 24l2.25-7.895c3.44-.978 5.96-4.14 5.96-7.894C20.21 3.677 16.536 0 12 0z">',
                'live_circle': '<path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM4 9.094h1.188v4.844h2.53v.968H4V9.094zm4.5 0h1.188v5.812H8.5V9.094zm1.78 0h1.345l1.28 4.375 1.345-4.377h1.313l-2 5.812h-1.25l-2.033-5.81zm5.845 0H20v.97l-2.688-.002v1.376h2.282v.937h-2.282v1.563H20v.968h-3.875V9.094z"/>'
            });
    }])
})();
