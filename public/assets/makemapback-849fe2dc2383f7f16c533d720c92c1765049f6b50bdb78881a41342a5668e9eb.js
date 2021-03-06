var MapperBack = (function () {
//any method here should be TESTABLE

  /**hexColorDivs
  */
  var hexColorDivs = function(baseColor, divisions)
  {
    //improve me
    // also feel free to improve the tests
    var colors = [];
    n = divisions - 1;
    var rdelta = (255-baseColor[0])/n;
    var gdelta = (255-baseColor[1])/n;
    var bdelta = (255-baseColor[2])/n;
    for(var i=1; i<divisions+1;i++)
    {
      var rval = Math.max(0, Math.floor(255 - rdelta * i)).toString(16);
      var gval = Math.max(0, Math.floor(255 - gdelta * i)).toString(16);
      var bval = Math.max(0, Math.floor(255 - bdelta * i)).toString(16);
      rval.length < 2 ? rval = "0" + rval: rval;
      gval.length < 2 ? gval = "0" + gval: gval;
      bval.length < 2 ? bval = "0" + bval: bval;
      var c = rval + gval + bval;

      colors.push("#" + c);
    }
    return colors;
  }
  /** color divs
    * @param {list} baseColor   base rgb color [r,g,b]
    * @param {number} divisions  color divisions
    * @return {list} return a list of colors from bot quartile to top
    */
  var colorDivs = function(baseColor, divisions)
  {
    //improve me
    // also feel free to improve the tests
    var colors = [];
    n = divisions - 1;
    rdelta = (255-baseColor[0])/n;
    gdelta = (255-baseColor[1])/n;
    bdelta = (255-baseColor[2])/n;
    for(var i=1; i<divisions+1;i++)
    {
      colors.push([Math.max(0, Math.floor(255 - rdelta * i)),
                   Math.max(0, Math.floor(255 - gdelta * i)),
                   Math.max(0, Math.floor(255 - bdelta * i))])
    }
    return colors;
  }


  /**
    * filter points
    * @param  {json} data data in json format,
    * @param  {number} filtermin  
    * @param  {number} filtermax
    * @param  {number} state
    * @return {list} data processed into a list
    */
  var filterPoints = function(data, filtermin, filtermax, state)
  {
    var points = data.points;
    var newPoints = [];
    for (var i=0;i<points.length;i++) {
      var point = points[i];
      if (point.filter_val >= filtermin && point.filter_val <= filtermax
            && (state == 0 || parseInt(point.location)/1000 == state)) {
        newPoints.push(point);
      }
    }

    return {points: newPoints};
  }


  /**
    * process points
    * @param  {json} data in json format, shrek is love shrek is life
    * @return {list} data processed into a list
    */
  var processPoints = function(data) {
    var points = data.points; //data points
    var avgs = []; //associative arry of averages. keys are location codes and values is weighted sum of each location
    var totalWeights = []; //associative array of total weights. keys are location codes and values are total weight of each location

    for (var i=0;i<points.length;i++) { //iterate through data points
      var point = points[i]; //the i-th point
      var loc = point.location; //location code of point
      if (avgs[loc] == undefined) { //if we haven't seen this location yet, add it to our arrays
        avgs[loc] = 0;
        totalWeights[loc] = 0;
      }
      avgs[loc] += point.weight * point.display_val; //increment this location's weighted sum
      totalWeights[loc] += point.weight; //increment this location's total weight
    }

    newData = [];
    for (loc in avgs) { //for each location encountered, add {location, weighted average} to newData
      newData.push({location: loc, value: avgs[loc]/totalWeights[loc]});
    }
    return newData
  }
  /**
    * getEnvironment
    * @return {string} the environment
    */
  var getEnvironment = function()
  {
    return 'development';
  }

  var getapiUrl = function()
  {
    // var env = getEnvironment();

    // if(env === 'production')
    // {
    //   apiUrl = 'https://mappr169.herokuapp.com/';
    // }

    // else if(env === 'development')
    // {
    //   apiUrl = 'http://localhost:3000/';
    // }
    // return apiUrl

    if (typeof location.origin === 'undefined') {
      location.origin = location.protocol + '//' + location.host;
    }
    console.log("Hello")
    console.log(location.origin)
    return location.origin + "/"
  }


    // PUBLIC METHODS
    // any private methods returned in the hash are accessible via Smile.key_name, e.g. Smile.start()
  return {
    hexColorDivs: hexColorDivs,
    filterPoints: filterPoints,
    getapiUrl: getapiUrl,
    getEnvironment: getEnvironment,
    processPoints: processPoints,
    colorDivs: colorDivs
  };
})();

