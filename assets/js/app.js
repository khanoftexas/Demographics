// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(demographicData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(demographicData, d => d[chosenXAxis]) * 0.8,
      d3.max(demographicData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}
// function used for updating y-scale var upon click on axis label
function yScale(demographicData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(demographicData, d => d[chosenYAxis]) * 0.8,
      d3.max(demographicData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);
 console.log(yLinearScale);
  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating xAxis var upon click on axis label
function renderyAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
  ;
  // chartGroup.selectAll(".stateText")
  //   .data(demographicData)
  //   .enter()
  //   .append("text")
  //   .text(function (d) {
  //       return d.abbr;
  //   })
  //   .attr("x", function (d) {
  //       return xLinearScale(d[chosenXAxis]);
  //   })
  //   .attr("y", function (d) {
  //       return yLinearScale(d[chosenYAxis]);
  //   })
  //   .attr("font-size", "9px")
  //   .attr("text-anchor", "middle")
  //   .attr("class",".stateText");

  return circlesGroup;
}

function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    textGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));

    return textGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var label = "Poverty %:";
  }
  else if (chosenXAxis === "age") {
    var label = "Age:";
  }
  else {
    var label = "Income:";
  }

  if (chosenYAxis === "obesity") {
    var labely = "obesity %:";
  }
  else if (chosenYAxis === "smokes") {
    var labely = "smokes:";
  }
  else {
    var labely = "lacks health insurance:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosenXAxis]}<br>${labely} ${d[chosenYAxis]}`)
     });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data)
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("../assets/data/data.csv", function(demographicData) {
    // Visualize the data
    BuildCharts(demographicData);
  });


 /**
  * 
  * @param {DemographicData} data 
  */ 
function BuildCharts(demographicData){
//  if (err) throw err;

  // parse data
  demographicData.forEach(function(data) {
    // data.abbr = data.abbr;
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
    data.age = +data.age;
    data.income = +data.income;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
    data.healthcare = +data.healthcare;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(demographicData, chosenXAxis);

  // Create y scale function
  // var yLinearScale = d3.scaleLinear()
  //   .domain([0, d3.max(demographicData, d => d.obesity)])
  //   .range([height, 0]);
  var yLinearScale  = yScale(demographicData, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(demographicData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .attr("fill", "Royalblue")
    .attr("opacity", ".5");

    chartGroup.selectAll(".stateText")
    .data(demographicData)
    .enter()
    .append("text")
    .text(function (d) {
        return d.abbr;
    })
    .attr("x", function (d) {
        return xLinearScale(d[chosenXAxis]);
    })
    .attr("y", function (d) {
        return yLinearScale(d[chosenYAxis]);
    })
    .attr("font-size", "9px")
    .attr("text-anchor", "middle")
    .attr("class",".stateText");

  
  

  // Create group for  3 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty %");

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  // append y axis
  // Create group for  3 y- axis labels
    var labelsGroupY = chartGroup.append("g")
  //   .attr("transform", `translate(-40,${height / 2})rotate(270)`);
  // chartGroup.append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("y", 0 - margin.left)
  //   .attr("x", 0 - (height / 2))
  //   .attr("dy", "1em")
  //   .classed("axis-text", true)
  //   .text("Obese %");

  var obeseLabel = labelsGroupY.append("text")
    // .attr("transform", "rotate(-90)")
    .attr("transform", `translate(-80,${height / 2})rotate(270)`)
    // .attr("x", 0 - (height / 2))
    // .attr("y", 0 - margin.left)
    .attr("value", "obesity")
    .classed("active", true)
    .text("Obesity %");

  var smokeLabel = labelsGroupY.append("text")
    // .attr("transform", "rotate(-90)")
    .attr("transform", `translate(-60,${height / 2})rotate(270)`)
    // .attr("x", 0 - (height / 2))
    // .attr("y", 0 - margin.left + 20)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smoke (%)");

  var healthcareLabel = labelsGroupY.append("text")
  .attr("transform", `translate(-40,${height / 2})rotate(270)`)
    // .attr("transform", "rotate(-90)")
    // .attr("x", 0 - (height / 2))
    // .attr("y", 0 - margin.left + 40)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .text("Lacks  Healthcare (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      d3.select(".stateText").html("");
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        console.log(chosenYAxis);
        console.log(chosenXAxis);

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(demographicData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis);
          
        //update text with new x values
        textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "poverty") {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);  
        }
        else {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);  
        }
      }
    });

  // y axis labels event listener
  labelsGroupY.selectAll("text")
  .on("click", function() {
    // get value of selection
    d3.select(".stateText").html("");
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

      // replaces chosenYAxis with value
      chosenYAxis = value;

      console.log(chosenYAxis);
      console.log(chosenXAxis);

      // functions here found above csv import
      // updates y scale for new data
      yLinearScale = yScale(demographicData, chosenYAxis);

      // updates y axis with transition
      yAxis = renderyAxes(yLinearScale, yAxis);

      // updates circles with new y values
      circlesGroup = renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis);
      
      //update text with new y values
      textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
      
      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenYAxis === "obesity") {
        obeseLabel
          .classed("active", true)
          .classed("inactive", false);
        smokeLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenYAxis === "smokes") {
        obeseLabel
          .classed("active", false)
          .classed("inactive", true);
        smokeLabel
          .classed("active", true)
          .classed("inactive", false);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);  
      }
      else {
        obeseLabel
          .classed("active", false)
          .classed("inactive", true);
        smokeLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);  
      }
    }
  });

}
