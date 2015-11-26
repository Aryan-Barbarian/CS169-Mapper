var AddData = (function () {

  //wait for change and determine if valid file
  var file = [];
  $(".fileSelect").change(function(e) 
  { 
    console.log(e.target.files[0]);
    file = e.target.files[0];

  });
  $(".uploadbutton").click(function(){
    createDataSet();
  });

  var validFile = function(path) 
  {
    if (path.split('.').pop() != 'csv')
    {
      return false;
    }
    return true;
  }

  //location column always 1 (for now)
  //weight column always 2 (for now)
  var createDataSet = function()
  {
    var read = new FileReader();
    var path = $(".fileSelect").val();
    var toSend = {};
    var rawText = "";
    var vars = [];
    var columns = [];
    var nameOfSet = $(".datasetname").val();
    //toSend.append('owner', 1);
    //toSend.append('name', $(".datasetname").val());
    //toSend.append('datafile_raw', file);

    read.readAsBinaryString(file)
    read.onloadend = function() 
    {
      //console.log(read.result);
      rawText = read.result;
      vars = textToVars(rawText);
      //console.log(vars);

      //console.log(toSend);
      for(var i = 0; i < vars.length; i++)
      {
        //change this
        if(i == 0)
        {
          columns.push({name: vars[i],
                        column_type:"LOCATION",
                        detail_level:"countyfull"});
        }
        else
        {
          columns.push({name:vars[i],
                        column_type:"VARIABLE"});
        }
      }
      //console.log(columns);

      toSend = {'name': nameOfSet,
                'datafile_raw': rawText,
                'columns': columns
                };
      //toSend.append('columns',columns);
      console.log(toSend);
      toSend = JSON.stringify(toSend)
      console.log(toSend)
      $.ajax({
          type: "POST",
          url: "/datasets",
          data: toSend,
          success: function(data) 
          {
            window.alert("created successfully");
          },
          error: function(data)
          {

          },
          dataType: 'json',
          contentType: 'application/json',

          xhrFields: 
          {
            withCredentials: true
          },
          headers: 
          {
            'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
          }

       });
    }

    //console.log($(".fileSelect").val());
    //console.log(csvVars(path));
    //console.log($('fileSelect').file);
    
  }
  var textToVars = function(text)
  {
    var allTextLines = text.split(/\r\n|\n/);
    var entries = allTextLines[0].split(',');
    return entries;
  }

  //return the json that is submitted to the backend to create a dataset
  var csvVars = function(path)
  {
    //var vars = "";
    //var isDone = false;
    var vars = "";
    $.ajax({
        type: "GET",
        url: path,
        dataType: "text",
        async: false,
        success: function(data) {processData(data);}
     });

    function processData(allText) 
    {
      //var record_num = 5;  // or however many elements there are in each row
      var allTextLines = allText.split(/\r\n|\n/);
      var entries = allTextLines[0].split(',');
      console.log(allTextLines[0]);
      vars = allTextLines[0];    
    }   
    return vars; 
  }
    // PUBLIC METHODS
    // any private methods returned in the hash are accessible via Smile.key_name, e.g. Smile.start()
  return {
    validFile:validFile,
    csvVars:csvVars,
  };
})();

