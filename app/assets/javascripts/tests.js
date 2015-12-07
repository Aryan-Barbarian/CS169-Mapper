  QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});
QUnit.test( "processed test", function( assert ) {
  var sampleData = {"points":[{"location":"44007","display_val":"1","filter_val":"23","weight":2349}],
	  "num_points":1,
	  "location_type":"COUNTYFIPS"};
  var correctData = [{"location": "44007", "value":1}];
  var processed = MapperBack.processPoints(sampleData);
  //console.log(processed);
  assert.deepEqual(processed, correctData , "Make sure process points puts out the correct amount of points");

});
QUnit.test( "2 location codes", function( assert ) {
  var sampleData = {"points":[{"location":"44007","display_val":"1","filter_val":"23","weight":2349},
  	  {"location":"44008","display_val":"1","filter_val":"18","weight":9150}],
	    "num_points":2,
	  "location_type":"COUNTYFIPS"};
  
  var processed = MapperBack.processPoints(sampleData);
  //console.log(processed);
  assert.deepEqual(processed.length, 2, "Test with 2 counties different locations");

});
QUnit.test( "Dev environment test", function( assert ) {
  
  var env = MapperBack.getEnvironment();
  //console.log(processed);
  assert.equal(env, "development", "determine environment");

});

QUnit.test( "Filter Points test", function( assert ) {
  var sampleData = {"points":[{"location":"44007","display_val":"1","filter_val":"23","weight":2349},
      {"location":"44008","display_val":"1","filter_val":"18","weight":9150}],
      "num_points":2,
      "location_type":"COUNTYFIPS"};
  var filtered = MapperBack.filterPoints(sampleData, 10,20, 0);
  var correctData = {points:[{"location":"44008","display_val":"1","filter_val":"18","weight":9150}]};
  //console.log(processed);
  assert.deepEqual(filtered, correctData,  "filter points first test");

});

QUnit.test( "Get colors test", function( assert ) {
  //feel free to change this
  var colors = MapperBack.colorDivs([255,127,0], 3);
  var correctColors = [[255,191,127],[255,127,0],[255,63,0]];
  //console.log(processed);
  assert.deepEqual(colors, correctColors,  "make sure correct color divs are created");

});

QUnit.test( "Colors length", function( assert ) {
  //feel free to change this
  var colors = MapperBack.colorDivs([255,127,0], 10);
  var len = colors.length;
  //console.log(processed);
  assert.deepEqual(len, 10,  "make sure correct num of colors are created");

});

QUnit.test( "Hex Colors", function( assert ) {
  //feel free to change this
  var colors = MapperBack.hexColorDivs([255,0,0], 2);
  var correct = ["#ff0000","#ff0000"]
  //console.log(processed);
  assert.deepEqual(colors, correct,  "make sure correct num of colors are created");

});

QUnit.test( "Hex Colors 2", function( assert ) {
  var colors = MapperBack.hexColorDivs([255,0,0], 10);
  var correct = ["#ffffff","#ff0000"];
  var len = colors.length;
  //console.log(processed);
  assert.equal(len, 10,  "make sure correct num of colors are created");

});

QUnit.test( "draw USA test", function( assert ) {
  //feel free to change this
  Mapper.drawUSA('states','#canvas');
  //console.log(processed);
  assert.equal(1, 1,  "you should see the USA drawn somewhere, with states");

});



QUnit.test( "good file test", function( assert ) {
  var path = "/testCSV/wrongfile.txt"
  var valid = AddData.validFile(path);
  //console.log(processed);
  assert.equal(valid, false,  "ensure that the program identifies correct file format");

});

QUnit.test( "get vars in csvfile test", function( assert ) {
  var path = "/testCSV/sampledata.csv"
  var vars = AddData.csvVars(path);
  var correct = 'head1,head2,head3,head4,head5'
  //console.log(processed);
  assert.equal(vars, correct, "correct variables read from csv");

});