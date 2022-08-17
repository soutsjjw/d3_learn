// 資料
var dataArr = [
  {
    label: "1月",
    value: 10.5,
  },
  {
    label: "2月",
    value: 70.5,
  },
  {
    label: "3月",
    value: 60.5,
  },
  {
    label: "4月",
    value: 10.5,
  },
  {
    label: "5月",
    value: 20.5,
  },
  {
    label: "6月",
    value: 30.5,
  },
];

var width = 450;
var height = 480;
var margin = 20;

// 建立畫布
var svg = d3
  .select(".d3Chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("background-color", "#1a3055");
var chart = svg
  .append("g")
  .attr("transform", `translate(${margin * 2}, ${margin})`);

// 分段比例尺
var xScale = d3
  .scaleBand()
  .range([0, 400])
  .domain(dataArr.map((s) => s.label));

// 線性比例尺
var yScale = d3.scaleLinear().range([400, 0]).domain([0, 100]);

// 座標軸
const xAxis = d3.axisBottom(xScale);
chart
  .append("g")
  .attr("class", "xAxis")
  .attr("transform", `translate(0, ${400})`)
  .call(xAxis);
const yAxis = d3
  .axisLeft()
  .scale(yScale)
  .tickFormat((d) => {
    return d + "%";
  });
chart.append("g").attr("transform", "translate(0, 0)").call(yAxis);

// 標籤
d3.select(".xAxis")
  .append("text")
  .attr("x", 400 / 2 - 12)
  .attr("y", 0)
  .attr("dy", 45)
  .style("font-size", "24px")
  .text("日期");

d3.selectAll(".d3Chart text").style("fill", "#fff");
d3.selectAll(".d3Chart line").style("stroke", "#fff");
d3.selectAll(".d3Chart path").style("stroke", "#fff");

// 繪製折線
let line = d3
  .line()
  .x(function (d) {
    return xScale(d.label);
  })
  .y(function (d) {
    return yScale(d.value);
  })
  .curve(d3.curveCardinal);
var lineChart = chart.append("g");

lineChart
  .selectAll()
  .data([dataArr])
  .enter()
  .append("path")
  .attr("class", (d, index) => "path" + index)
  .attr("d", function (d) {
    return line(d);
  })
  .attr("stroke", "#2e6be6")
  .attr("fill", "none")
  .attr("transform", `translate(${xScale.bandwidth() / 2}, 0)`);

// 繪製圓點
lineChart
  .selectAll()
  .data([dataArr])
  .enter()
  .append("g")
  .attr("class", (d, index) => "circleG" + index)
  .selectAll()
  .data((d) => d)
  .enter()
  .append("circle")
  .attr("cx", function (d) {
    return xScale(d.label);
  })
  .attr("cy", function (d) {
    return yScale(d.value);
  })
  .attr("r", 4)
  .attr("transform", `translate(${xScale.bandwidth() / 2}, 2)`)
  .attr("fill", "#fff")
  .attr("stroke", "rgba(56, 8, 228, .5)");

// 添加動畫(線)
svg
  .selectAll("path.path0")
  // stroke-dasharray 虛線長度
  .style("stroke-dasharray", function () {
    return d3.select(this).node().getTotalLength();
  })
  // stroke-dashoffset 虛線編移量
  .style("stroke-dashoffset", function () {
    return d3.select(this).node().getTotalLength();
  })
  .transition()
  .duration(2000)
  .ease(d3.easeLinear)
  .style("stroke-dashoffset", 0);

// 添加動畫(圓點)
svg
  .selectAll(".circleG0 > circle")
  .attr("r", 0)
  .style("stroke-width", 0)
  .transition()
  .duration(300)
  .delay(function (d, i) {
    return (i * 2000) / 5;
  })
  .ease(d3.easeLinear)
  .attr("r", 4)
  .style("stroke-width", 3);
