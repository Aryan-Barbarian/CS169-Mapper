var Mapper = (function () {
// nothing here can be tested, keep it simple


    var allPoints;
    var currPoints;
    var currColor;
    var apiUrl;
    var varList = null
    var datasetList = null
    var datasets = null

    var fipsState = {
       "01": "Alabama",
       "02": "Alaska",
       "04": "Arizona",
       "05": "Arkansas",
       "06": "California",
       "08": "Colorado",
       "09": "Connecticut",
       "10": "Delaware",
       "11": "District of Columbia",
       "12": "Florida",
       "13": "Geogia",
       "15": "Hawaii",
       "16": "Idaho",
       "17": "Illinois",
       "18": "Indiana",
       "19": "Iowa",
       "20": "Kansas",
       "21": "Kentucky",
       "22": "Louisiana",
       "23": "Maine",
       "24": "Maryland",
       "25": "Massachusetts",
       "26": "Michigan",
       "27": "Minnesota",
       "28": "Mississippi",
       "29": "Missouri",
       "30": "Montana",
       "31": "Nebraska",
       "32": "Nevada",
       "33": "New Hampshire",
       "34": "New Jersey",
       "35": "New Mexico",
       "36": "New York",
       "37": "North Carolina",
       "38": "North Dakota",
       "39": "Ohio",
       "40": "Oklahoma",
       "41": "Oregon",
       "42": "Pennsylvania",
       "44": "Rhode Island",
       "45": "South Carolina",
       "46": "South Dakota",
       "47": "Tennessee",
       "48": "Texas",
       "49": "Utah",
       "50": "Vermont",
       "51": "Virginia",
       "53": "Washington",
       "54": "West Virginia",
       "55": "Wisconsin",
       "56": "Wyoming"
    }

    var geoList = ["USA", "Alabama", 
                                    "Alaska", 
                                    "Arizona",
                                    "Arkansas", 
                                    "California", 
                                    "Colorado", 
                                    "Connecticut", 
                                    "Delaware",
                                    "Florida", 
                                    "Georgia", 
                                    "Hawaii", 
                                    "Idaho", 
                                    "Illinois", 
                                    "Indiana", 
                                    "Iowa", 
                                    "Kansas", 
                                    "Kentucky", 
                                    "Louisiana", 
                                    "Maine", 
                                    "Maryland", 
                                    "Massachusetts", 
                                    "Michigan", 
                                    "Minnesota", 
                                    "Mississippi", 
                                    "Missouri", 
                                    "Montana",
                                    "Nebraska", 
                                    "Nevada", 
                                    "New Hampshire", 
                                    "New Jersey", 
                                    "New Mexico", 
                                    "New York", 
                                    "North Carolina", 
                                    "North Dakota", 
                                    "Ohio", 
                                    "Oklahoma", 
                                    "Oregon", 
                                    "Pennsylvania", 
                                    "Rhode Island", 
                                    "South Carolina", 
                                    "South Dakota", 
                                    "Tennessee", 
                                    "Texas", 
                                    "Utah", 
                                    "Vermont", 
                                    "Virginia", 
                                    "Washington", 
                                    "West Virginia", 
                                    "Wisconsin", 
                                    "Wyoming"]

    
    var state_codes = {
                                   "1": "Alabama",
                                   "2": "Alaska",
                                   "4": "Arizona",
                                   "5": "Arkansas",
                                   "6": "California",
                                   "8": "Colorado",
                                   "9": "Connecticut",
                                   "10": "Delaware",
                                   "11": "District of Columbia",
                                   "12": "Florida",
                                   "13": "Georgia",
                                   "15": "Hawaii",
                                   "16": "Idaho",
                                   "17": "Illinois",
                                   "18": "Indiana",
                                   "19": "Iowa",
                                   "20": "Kansas",
                                   "21": "Kentucky",
                                   "22": "Louisiana",
                                   "23": "Maine",
                                   "24": "Maryland",
                                   "25": "Massachusetts",
                                   "26": "Michigan",
                                   "27": "Minnesota",
                                   "28": "Mississippi",
                                   "29": "Missouri",
                                   "30": "Montana",
                                   "31": "Nebraska",
                                   "32": "Nevada",
                                   "33": "New Hampshire",
                                   "34": "New Jersey",
                                   "35": "New Mexico",
                                   "36": "New York",
                                   "37": "North Carolina",
                                   "38": "North Dakota",
                                   "39": "Ohio",
                                   "40": "Oklahoma",
                                   "41": "Oregon",
                                   "42": "Pennsylvania",
                                   "44": "Rhode Island",
                                   "45": "South Carolina",
                                   "46": "South Dakota",
                                   "47": "Tennessee",
                                   "48": "Texas",
                                   "49": "Utah",
                                   "50": "Vermont",
                                   "51": "Virginia",
                                   "53": "Washington",
                                   "54": "West Virginia",
                                   "55": "Wisconsin",
                                   "56": "Wyoming"
    }

    var mapId = null
    var datasetId = 1 //TODO: Make sure this is kept safe!
    var userId = 1
    var displayval; //string
    var filterval; //string
    var geoval; //string

    //methods dealing with front end

  var makeSlider = function() {
    var displayPoints = (allPoints.points).map(function(point) { return point.filter_val })
    var minVal = Math.max(0, Math.floor(Math.min.apply(null, displayPoints)))
    var maxVal = Math.floor(Math.max.apply(null, displayPoints))


    $( "#slider-range" ).slider({
        range: true,
        min: minVal,
        max: maxVal,
        values: [ minVal, maxVal ],
        slide: function( event, ui ) {
          $( "#range-display" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] );
        }
      });
      $( "#range-display" ).val($( "#slider-range" ).slider( "values", 0 ) +
        " - " + $( "#slider-range" ).slider( "values", 1 ) );

      $('#select-range').on("click", function() {
      });
      
      $('#select-range').on("click", function() {
        var filtermin = $("#slider-range").slider("values",0);
        var filtermax = $( "#slider-range" ).slider( "values", 1);


        var dataPoints = MapperBack.processPoints(MapperBack.filterPoints(allPoints, filtermin, filtermax, null));
        currPoints = dataPoints; //in makeslider
        drawMap(dataPoints);
      });
    }


    var loadDatasets = function() {
        // Loads all legal datasets
        var datasetsUrl = apiUrl + "/datasets"
        
        var success = function(data) {
            datasets = new Array()
            datasetList = new Array()

            $("#iddataset").empty()
            for (var i = data.length - 1; i >= 0; i--) {
                datasets.push(data[i])
                datasetList.push(data[i].name)
                $("#iddataset").append("<option> " + data[i].name + " </option>")
            }

            // $("#iddataset").on('input propertychange paste autocompleteselect', function() {
            $("#iddataset").on('change', function() {
                datasetName = this.value
                dataset = findDatasetByName($('#iddataset').val())
                datasetId = dataset.id
                loadColumnsAsync(dataset.columns)
            });

            $("#iddataset").append("<option value=\"\" disabled selected class=\"disabled\"> Select a Dataset </option>")

        }



        makeGetRequest(datasetsUrl, null, success)
    }

    var loadColumns = function(datasetId_param) {
        // Loads all legal columns
        var datasetUrl = apiUrl + "/datasets/" + datasetId_param
        var success = function(dataset) {
            var columns = dataset.columns
            datasetId = dataset.id
            $("#iddataset").val(dataset.name)
            loadColumnsAsync(columns)
        }


        makeGetRequest(datasetUrl, null, success)
    }


    var loadColumnsAsync = function(columns) {
        $("#idfilteringvar").empty()
        $("#idvar").empty()

        varList = new Array()

        for (var i = columns.length - 1; i >= 0; i--) {
            var column = columns[i]
            if (column.column_type === "VARIABLE") {
                varList.push(column.name)
                $("#idfilteringvar").append("<option> " + column.name + " </option>")
                $("#idvar").append("<option> " + column.name + " </option>")
            }
        };

        $("#idfilteringvar").append("<option value=\"\"> None </option>")
        $("#idfilteringvar").append("<option value=\"\" disabled selected class=\"disabled\"> Select a Filter Variable </option>")
        $("#idvar").append("<option value=\"\" disabled selected class=\"disabled\"> Select a Display Variable </option>")
        startAutocomplete()
    }

    /* makes histogram in scattercanvas */
    var stateClickHandler = function(d) {
        $("#scattercanvas svg").remove();
        var filtermin = $("#slider-range").slider("values",0);
        var filtermax = $( "#slider-range" ).slider( "values", 1);
        var statePoints = MapperBack.filterPoints(allPoints, filtermin, filtermax, d.id);
        var values = (statePoints.points).map(function(point) {return point.display_val});
        var formatCount = d3.format(",.0f");
        var minVal = Math.max(0, Math.floor(Math.min.apply(null, values)))
        var maxVal = Math.floor(Math.max.apply(null, values))
        var margin = {top: 30, right: 30, bottom: 30, left: 30},
            width = $("#scattercanvas").width() - margin.left - margin.right,
            height = $("#scattercanvas").height() - margin.top - margin.bottom;
        var x = d3.scale.linear()
            .domain([minVal, maxVal])
            .range([0, width]);
        var data = d3.layout.histogram()
            .bins(x.ticks(9))
            (values);

        var y = d3.scale.linear()
            .domain([0, d3.max(data, function(d) { return d.y; })])
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var svg = d3.select("#scattercanvas").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var bar = svg.selectAll(".bar")
            .data(data)
          .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

        console.log(width);
        console.log(x(data[0].dx));

        bar.append("rect")
            .attr("x", 1)
            .attr("width", 20 - 1)
            .attr("height", function(d) { return height - y(d.y); });

        bar.append("text")
            .attr("dy", ".75em")
            .attr("y", 6)
            .attr("x", 20 / 2)
            .attr("text-anchor", "middle")
            //.text(function(d) { return formatCount(d.y); });

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
    }

    var startAutocomplete = function() {
        // $("#idvar").autocomplete({
        //  source: varList,
        //  minLength: 0,
        //  scroll: true,
  //     autoFocus: true
        // }).focus(function() {
        //      $(this).autocomplete("search", "");
        // });

        // $("#iddataset").autocomplete({
        //  source: datasetList,
        //  minLength: 0,
        //  scroll: true,
            
  //     autoFocus: true
        // }).focus(function() {
        //      $(this).autocomplete("search", "");
        // });

        // $("#idfilteringvar").autocomplete({
        //  source: varList,
        //  minLength: 0,
        //  scroll: true
        // }).focus(function() {
        //      $(this).autocomplete("search", "");
        // });

        // $("#idgeo").autocomplete({
        //  source: geoList,
        //  minLength: 0,
        //  scroll: true
        // }).focus(function() {
        //      $(this).autocomplete("search", "");
        // });
    }

    var submitClickHandler = function() {
        $( "body" ).on( "click", "#idsubmit", function() {
            //set values
            apiUrl = MapperBack.getapiUrl();
            displayval = $("#idvar").val();
            filterval = $("#idfilteringvar").val();
            geoval = $("#idgeo").val();
            datasetId_possible = findDatasetByName($('#iddataset').val())
            if (datasetId_possible) {
                datasetId = datasetId_possible.id
            }


            //set URL
            // apiUrl += '&display_val=' + displayval.toUpperCase().replace(' ', '_');
            // if (filterval) '&filter_val=' + filterval.toUpperCase().replace(' ', '_');

            //hide stuff
            $("div#canvas").html('');
            $("#legend").html('')
            $(".secondContainer").removeClass('hidden');
            $(".firstContainer").addClass('hidden');
            start();

        });
    }

    var submitHomeClickHandler = function() {
            $( "body" ).on( "click", "#idsubmit", function() {
                //set values
                apiUrl = MapperBack.getapiUrl();
                displayval = $("#idvar").val();
                filterval = $("#idfilteringvar").val();
                geoval = $("#idgeo").val();

                params = gatherMapVariables()
                saveUrl = apiUrl + "maps/"

                $.redirect(saveUrl, params, "POST")

        });
    }

    var makeGetRequest = function(url, params, onSuccess, onFailure) {
        makeAjaxRequest(url, "GET", params, onSuccess, onFailure)
    };

    var makePutRequest = function(url, params, onSuccess, onFailure) {
        makeAjaxRequest(url, "PUT", params, onSuccess, onFailure)
    };

    var makePostRequest = function(url, params, onSuccess, onFailure) {
        makeAjaxRequest(url, "POST", params, onSuccess, onFailure)
    };

    /**
    * HTTP request 
    * @param  {string}   url       URL path, e.g. "/api/smiles"
    * @param  {function} onSuccess   callback method to execute upon request success (200 status)
    * @param  {function} onFailure   callback method to execute upon request failure (non-200 status)
    * @return {None}
    */
    var makeAjaxRequest = function(url, http_method, params, onSuccess, onFailure) {
        console.log ("making a request to : " + url)
        $.ajax({
            type: http_method,
            url: url,
            data: params,
            dataType: "json",
            success: onSuccess,
            error: onFailure,
            xhrFields: {
                withCredentials: true
            },
            headers: {
              'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
            }
        });
    };

    //Methods dealing with the map
    //adds title to our graph
    var addTitle = function(svg)
    {
        svg.append("text")
                .attr("x", 100)             
                .attr("y", 50)
                .attr("text-anchor", "middle")  
                .style("font-size", "16px") 
                .style("text-decoration", "underline")  
                // .text("Make me a pretty title");
    }

    //add the legend to the plot
    var addLegend = function (svg, data_quantize) 
    {
        $("#legend").html("");
        //improve this 
        //legend should show each color and what range its for
        // heres an example http://bl.ocks.org/ZJONSSON/3918369
        var data_buckets = data_quantize.range()

        var colors = d3.scale.quantize()
            .range(MapperBack.hexColorDivs(currColor,10));
        var legend = d3.select('#legend')
            .append('ul')
                .attr('class', 'list-inline');
        // debugger
        // colors.range().pop();

        var keys = legend.selectAll('li.key').data(colors.range());
        var bucket_i = 0
        keys.enter().append('li')
            .attr('class', 'key')
            .style('border-top-color', String)
            .text(function(d) {
                var bucket = data_buckets[bucket_i]
                bucket_i += 1
                var r = colors.invertExtent(d);
                var curr_range = data_quantize.invertExtent(bucket)
                var first = Math.round(curr_range[0]*100)/100;
                var second = Math.round(curr_range[1]*100)/100;
                return first + " - " + second;
            });
        d3.selectAll('li.key')
            .style('border-top-width', '15px')
            .style('border-top-style', 'solid')
            .style('width', '10%')
            .style('font-size:','.75em');

    }

    var listToColor = function(c)
    {
        return "rgb("+c[0] + "," +c[1] + "," +c[2] + ")";
    }
    //apply the colors to the map
    var applyColors = function(svg, color, divs)
    {
        //debugger;
        var colors = MapperBack.colorDivs(color, divs);
        for (var i = colors.length - 1; i >= 0; i--) 
        {
            //debugger;
            var quart = ".q" + i + "-" + divs;
            var c = colors[i];
            var colorString = "rgb("+c[0] + "," +c[1] + "," +c[2] + ")";
            
            d3.selectAll(quart).style("fill", colorString);

        }
    }
  //color should be in hex format
  var changeColor = function(color)
  {
    //debugger;
    var R = parseInt(color.substring(1,3),16)
    var G = parseInt(color.substring(3,5),16)
    var B = parseInt(color.substring(5,7),16)
    currColor = [R,G,B];
    var colors = MapperBack.hexColorDivs([R,G,B], 10);
    for (var i = colors.length - 1; i >= 0; i--) 
    {
      //debugger;
      var quart = ".q" + i + "-" + 10;
      d3.selectAll(quart).style("fill", colors[i]);

    }


    //Tony make me work pls
    
    var colors = d3.scale.quantize()
      .range(colors);
    // debugger
    //colors.range().pop();


    var keys = d3.selectAll('li.key').data(colors.range());
    keys.enter().append('li')
      .attr('class', 'key')
      .style('border-top-color', String)


    var legendColors = MapperBack.hexColorDivs(currColor,10);
    $('li.key').each(function(i) {
      $(this).css('border-top-color', legendColors[i]);
    });


  }

     /** createQuantize
        * @param {list} color   base color to start with
        * @param {number} divs  number of divisions
        * @return {quantize} return the quantization var we draw with
        */
    var createQuantize = function(color, divs, dataPoints)
    {
        var displayPoints = dataPoints.map(function(point) { return point.value })
        var minVal = Math.min.apply(null, displayPoints)
        var maxVal = Math.max.apply(null, displayPoints)
        // var quantize = d3.scale.quantize()
        //     .domain([Math.min.apply(Math,dataPoints.map(function(o) {return o.value;})), 
        //       Math.max.apply(Math,dataPoints.map(function(o) {return o.value;}))])
        //     .range(d3.range(divs).map(function(i) { return "q" + i + "-" + divs; }));

        var quantize = d3.scale.quantize()
                .domain([minVal, maxVal])
                .range(d3.range(divs).map(function(i) { return "q" + i + "-" + divs; }));
 
        return quantize;

    }

    var resize = function (){
        // get width/height with container selector (body also works)
        // or use other method of calculating desired values
        var width = $('#canvas').width(); 

        var height = $('#canvas').height(); 

        // set attrs and 'resume' force 
        //svg = $('#svgMap')
        mapSvg.attr('width', width);
        mapSvg.attr('height', height);
        mapSvg.attr('max-width', width);
        mapSvg.attr('max-height', height);
    }

    // var resize = function() {

    //   width = parseInt(d3.select('#canvas').style('width'))
    //   height = parseInt(d3.select('#canvas').style('height'))
    //   debugger

    //   // update projection
    //   proj.translate([width / 2, height / 2]).scale(width);

    //   // resize the map container
    //   mapSvg.style('width', width + 'px').style('height', height + 'px');

    //   // // resize the map
    //   mapSvg.select('.land').attr('d', path);
    //   mapSvg.selectAll('.state').attr('d', path);
    // }

    
    var proj; //the global variable for projection
    var mapSvg; //the global variable for svg
    var centered = null; /* Global variable for whether map is zoomed in */

    /** drawState
        * @param {string} res   draw land, states, or counties
        * @param {string} canvas  id of element ot draw on ('#canvas')
        * @return {svg} return the svg var we draw with
        */

    var drawUSA = function(res, canvas, quantize, rateById)
    {   
        var background = $(canvas);
        var width = background.width();
        var height = background.height();
        
        var projection = d3.geo.albersUsa()
                .scale(1000)
                .translate([width / 2, height / 2]);
        proj = projection;

        var path = d3.geo.path()
                .projection(projection);

        var svg = d3.select(canvas).append("svg")
                .attr("width", width)
                .attr("height", height);

        svg.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height)
            .on("click", function(d) { zoomMap(d, width, height, path) });

        mapSvg = svg;

        d3.json("/scripts/us.json", function(error, us) {
            if (error) throw error;
            svg.append("g")
                    .attr("class", "states")
                .selectAll("path")
                    .data(topojson.feature(us, us.objects.states).features)
                .enter().append("path")
                    .attr("class", function(d) { return quantize(rateById.get(d.id)); })
                    .attr("d", path)
                    .on("click", function(d) { zoomMap(d, width, height, path) })
                    .attr("state",function(d) { return d.id })
                    // .call(d3.helper.tooltip(
                    //     function(d, i){
                    //         console.log(d.properties);
                    //         return "<b>"+d.properties.name;
                    //     }
                    // ));


            // svg.select("g").append("path")
            //         .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a == b || a !== b; }))
            //         .attr("class", "states")
            //         .attr("d", path)

            
            applyColors(null,currColor, 10);
        });

        d3.select(self.frameElement).style("height", height + "px");
        return svg;
    }

    var zoomMap = function (d, width, height, path) {
        stateClickHandler(d)
        var x, y, k;
        var g = d3.select("g");
        var changed = false;
        if (d && centered !== d) {
            var centroid = path.centroid(d);
            x = centroid[0];
            y = centroid[1];
            k = 4;
            if (centered !== null) {
                highlightState(d, true, centered)
            }
            centered = d;
            changed = true;
            highlightState(d, false, centered);
        } else {
            x = width / 2;
            y = height / 2;
            k = 1;
            highlightState(d, true, centered)
            centered = null;
        }
        // g.selectAll("path")
        //     .classed("active", centered && function(d) { return d === centered; });

        g.transition()
            .duration(750)
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
            .style("stroke-width", 1 / k + "px");

    }

    var highlightState = function(d, isZoomed, centered) {
        if (isZoomed) {
            d3.select("path[state=\"" + centered.id + "\"]")
                .style("stroke-width", 1 + "px")
                .style("stroke", null);
        } else {
            d3.select("path[state=\"" + centered.id + "\"]")
                .style("stroke-width", 3 + "px")
                .style("stroke", "black");

            d3.select("svg").selectAll("path").sort(function(a, b) {
                if (a.id != d.id) {
                    return -1;
                } else {
                    return 1;
                }
            })
        }
    }

    var initialize = function(display_variable, filter_variable, user_id, dataset_id) {
        displayval = display_variable
        filterval = filter_variable
        apiUrl = MapperBack.getapiUrl();
        userId = user_id

        if (dataset_id === null) {
            dataset_id = 1
        }
        datasetId = dataset_id

        loadDatasets()
        loadColumns(datasetId)
        
    }

    var drawMap = function(dataPoints) {
        $("#canvas").html("");
        var quantize = createQuantize(currColor, 10, dataPoints);

        var width = 870,
          height = 505;

        var rateById = d3.map();

        for (var i = 0; i < dataPoints.length; i++) {
          var location = parseInt(dataPoints[i].location) / 1000
          rateById.set(location, dataPoints[i].value);
        }
        var svg = drawUSA("state", "#canvas", quantize, rateById);

        document.getElementsByTagName('svg')[0].id = 'svgMap';   
        addLegend(svg, quantize);
        addTitle(svg);
        //changeColor('#ff0000');

        d3.select(self.frameElement).style("height", height + "px");
    }

    var start = function() {   
        currColor = [10,10,100];
        var onSuccess = function(data) {
            allPoints = data;
            currPoints = data;
            makeSlider();
            var dataPoints = MapperBack.processPoints(data);
            drawMap(dataPoints);
        };

        var onFailure = function() {
            console.error('failed to fetch points'); 
        }

        params = gatherPointVariables()
        var pointUrl = apiUrl + "datasets/" + datasetId + "/points"
        makeGetRequest(pointUrl, params,  onSuccess, onFailure);
    };

    var findDatasetById = function(datasetId) {
        for (var i = datasets.length - 1; i >= 0; i--) {
            if (datasets[i].id === datasetId) {
                return datasets[i]
            }
        };
        return null
    }
    var findDatasetByName = function(datasetName) {
        for (var i = datasets.length - 1; i >= 0; i--) {
            if (datasets[i].name === datasetName) {
                return datasets[i]
            }
        };
        return null
    }

    var gatherPointVariables = function() {
        // TODO: Get these from displayval etc.
        var ans = {}
        ans["display_val"] = displayval
        ans["filter_val"] = filterval
        ans["dataset_id"] = datasetId
        ans["num_points"] = 20000
        return ans
    }

    var gatherMapVariables = function() {
        // TODO: Do me
        var ans = {}
        ans["name"] = "My Fun Map"
        ans["display_variable"] = displayval
        ans["filter_variable"] = filterval
        ans["user_id"] = userId
        ans["dataset_id"] = datasetId
        return ans
    }

    var setMapId = function(newMapId) {
        mapId = newMapId
    }

    var saveMap = function() {
        var url = window.location.href;
        window.prompt("Copy to clipboard to share:", url);
    }

    d3.select(window).on('resize', resize);


    // PUBLIC METHODS
    // any private methods returned in the hash are accessible via Smile.key_name, e.g. Smile.start()
    
    return {
    makeSlider: makeSlider,
    changeColor: changeColor,
        createQuantize: createQuantize,
        drawUSA: drawUSA,
        start: start,
        initialize: initialize,
        submitClickHandler: submitClickHandler,
        stateClickHandler: stateClickHandler,
        submitHomeClickHandler: submitHomeClickHandler,
        startAutocomplete: startAutocomplete,
        resize: resize,
        saveMap: saveMap,
    };
})();
