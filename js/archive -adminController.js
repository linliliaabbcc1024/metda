angular
    .module('blankapp').controller("adminController", function($scope, $rootScope, Upload, $timeout, $mdToast, $mdDialog){
ctrl = this;

/*AWS.config.update({
  region: "us-west-2",
  endpoint: 'http://localhost:8000',
  // accessKeyId default can be used while using the downloadable version of DynamoDB.
  // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
  accessKeyId: "fakeMyKeyId",
  // secretAccessKey default can be used while using the downloadable version of DynamoDB.
  // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
  secretAccessKey: "fakeSecretAccessKey"
});*/
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();
dynamodb.listTables({Limit: 10}, function(err, data) {
  if (err) {
    console.log("Error", err.code);
  } else {
    ctrl.TableNames = data.TableNames
    ctrl.see_table_name = ctrl.TableNames[0]
    console.log("Table names are ", data.TableNames);
  }
});

      ctrl.see_table = function(table_name) {
        var params = {
          TableName: table_name
        };
        ctrl.seeing_table = true

        dynamodb.describeTable(params, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else{
            ctrl.see_table_result = "<p>The <code>"+table_name+"</code> contains <code>"+data.Table.ItemCount+"</code> items. One keys are "+JSON.stringify(data.Table.KeySchema, null, 4)+" </p>"
            ctrl.seeing_table = false
            rrr = data
          };
          $scope.$apply();
        });
      }



      ctrl.create_new_table = function(new_table_name,primary_key){
        ctrl.creating_table = true
        var params = {
            TableName : new_table_name,
            KeySchema: [
                { AttributeName: primary_key, KeyType: "HASH"}
            ],
            AttributeDefinitions: [
                { AttributeName: primary_key, AttributeType: "S" }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        };
        console.log(params)

        dynamodb.createTable(params, function(err, data) {
          ctrl.creating_table = false
            if (err) {
              console.log("error")
              ctrl.new_table_result = JSON.stringify(err, undefined, 2)
            } else {
              console.log("good")
              ctrl.new_table_result =  JSON.stringify(data, undefined, 2)
            }
            $scope.$apply();
        });

      };

    ctrl.delete_table_confirm = function(ev, delete_table_name) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
            .title('Would you like to delete this table?')
            .textContent('Once deleted, it cannot be recovered!')
            .ariaLabel('Delete Table')
            .targetEvent(ev)
            .ok('Yes. Delete.')
            .cancel("No. Don't.");
      $mdDialog.show(confirm).then(function() {
        var params = {
            TableName : delete_table_name
        };
        dynamodb.deleteTable(params, function(err, data) {
            if (err) {
                ctrl.delete_table_result = "Error. Didn't delete."+delete_table_name
            } else {
                dynamodb.listTables({Limit: 10}, function(err, data) {
                  if (err) {
                    console.log("Error", err.code);
                  } else {
                    ctrl.TableNames = data.TableNames
                    ctrl.see_table_name = ctrl.TableNames[0]
                    console.log("Table names are ", data.TableNames);
                  }
                  $scope.$apply();
                });
                ctrl.delete_table_result = "Deleted."+delete_table_name
            }
            $scope.$apply();
        });

      }, function() {
        ctrl.delete_table_result = "Didn't delete."+delete_table_name
      });
    };




ctrl.changing_focused_table = false


ctrl.change_focused_table = function(focused_table_name){
  var params = {
    TableName: focused_table_name,
    Select: "ALL_ATTRIBUTES"
  };

  function doScan(response) {
  if (response.error) console.log(response.error); // an error occurred
  else {
      console.log(response.data); // successful response
      ddd=response.data
      ctrl.change_focused_table_result = "<p>The first item in this table is <code>" + JSON.stringify(ddd.Items[0]) + "</code>.</p><p>The values of first key are <code>"+unpack(ddd.Items,'id').map(x=>Object.values(x)[0]).join(", ")+"</code>.</p>"
      // More data.  Keep calling scan.
      if ('LastEvaluatedKey' in response.data) {
          response.request.params.ExclusiveStartKey = response.data.LastEvaluatedKey;
          dynamodb.scan(response.request.params)
              .on('complete', doScan)
              .send();
      }
  }
  }
  console.log("Starting a Scan of the table");
  dynamodb.scan(params)
  .on('complete', doScan)
  .send();
}



    ctrl.item_text= '{"year": 2015,"title": "The Big New Movie","info":{"plot":"Nothing happens at all.", "rating": 0}}'
    ctrl.create_item = function(focused_table_name, item_text){
        var params = {
            TableName :focused_table_name,
            Item:JSON.parse(item_text)
            }
        docClient.put(params, function(err, data) {
            if (err) {
                ctrl.create_item_result = JSON.stringify(err, undefined, 2)
            } else {
                ctrl.create_item_result = JSON.stringify(data, undefined, 2)
            }
            console.log('good')
            $scope.$apply();
        });
    };


    ctrl.read_item_text= '{"id": "001"}'
    ctrl.read_item = function(focused_table_name, read_item_text){
        var params = {
            TableName :focused_table_name,
            Key:JSON.parse(read_item_text)
            }
        docClient.get(params, function(err, data) {
            if (err) {
                ctrl.read_item_result = JSON.stringify(err, undefined, 2)
            } else {
                ctrl.read_item_result = JSON.stringify(data, undefined, 2)
            }
            console.log('good')
            $scope.$apply();
        });
    };


testing = function(){
    var docClient = new AWS.DynamoDB.DocumentClient();
    var table = "user";
    var id = "001";

    var read_params = {
            TableName :table,
            Key:{
              id:id
            }
    }
    // see this table
    docClient.get(read_params, function(err, data) {
        if (err) {
          console.log("Error: " + JSON.stringify(err, undefined, 2))
        } else {
          uuu = data
          console.log("Result: "+JSON.stringify(data, undefined, 2))
          console.log('good')
        }

    });

    // edit a item
    var params = {
        TableName:table,
        Key:{
            "id": id
        },
        UpdateExpression: "set activated_project=:a",
        ExpressionAttributeValues:{
            ":a":"project1"
        },
        ReturnValues:"UPDATED_NEW"
    };

    docClient.update(params, function(err, data) {
        if (err) {
            console.log(JSON.stringify(err, undefined, 2)) ;
        } else {
            console.log(JSON.stringify(data, undefined, 2));
        }
    });



}




















	})






























