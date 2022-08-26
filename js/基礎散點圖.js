var dataArr = [
  {
    x: 70.5,
    y: 0.5,
  },
  {
    x: 30.5,
    y: 30.5,
  },
  {
    x: 50.5,
    y: 20.5,
  },
  {
    x: 60.5,
    y: 10.5,
  },
  {
    x: 20.5,
    y: 70.5,
  },
  {
    x: 70.5,
    y: 70.5,
  },
  {
    x: 60.5,
    y: 90.5,
  },
  {
    x: 70.5,
    y: 10.5,
  },
  {
    x: 10.5,
    y: 30.5,
  },
  {
    x: 30.5,
    y: 20.5,
  },
];

// 初始化畫布
var width = 460;
var height = 450;
var margin = 20;

var svg = d3
  .select(".d3Chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("background-color", "#1a3055");

// 圖
var chart = svg
  .append("g")
  .attr("transform", `translate(${margin * 2}, ${margin})`);

// 建立比例尺
// 線性比例尺
var xScale = d3.scaleLinear().range([0, 400]).domain([0, 100]);
// 線性比例尺 - Y軸在底部 所以 400 坐標 對應Y軸 開始點
var yScale = d3.scaleLinear().range([400, 0]).domain([0, 100]);

// X坐標軸
const xAxis = d3.axisBottom(xScale).tickSize(-400);
chart.append("g").attr("transform", `translate(0, ${400})`).call(xAxis);
// Y坐標軸
const yAxis = d3
  .axisLeft()
  .scale(yScale)
  .tickSize(-400)
  .tickFormat((d) => {
    return d + "%";
  });
chart.append("g").attr("transform", "translate(0, 0)").call(yAxis);

d3.selectAll(".d3Chart text").style("fill", "#fff");
d3.selectAll(".d3Chart line").style("stroke", "#fff");
d3.selectAll(".d3Chart path").style("stroke", "#fff");

// 繪製散點
chart
  .append("g")
  .selectAll()
  .data(dataArr)
  .enter()
  .append("circle")
  .attr("class", "point")
  .attr("cx", (d) => xScale(d.x))
  .attr("cy", (d) => yScale(d.y))
  .attr("r", 0)
  .attr("fill", "#FBBC05")
  .attr("stroke", "rgb(56, 8, 228, .5)")
  .transition()
  .duration(1000)
  .attr("r", 8);

// 添加互動
var tooltips = d3
  .select("body")
  .append("div")
  .style("width", "130px")
  .style("height", "20px")
  .style("background-color", "#F1F3F4")
  .style("display", "flex")
  .style("justify-content", "center")
  .style("padding", "10px")
  .style("border-radius", "5px")
  .style("opacity", 0);

d3.selectAll(".point")
  .on("mouseover", (e, g) => {
    tooltips
      .html(`X:${g.x},Y:${g.y}`)
      .style("position", "absolute")
      .style("left", `${e.clientX}px`)
      .style("top", `${e.clientY}px`)
      .style("opacity", 1);
  })
  .on("mouseleave", (e, g) => {
    tooltips.style("opacity", 0).style("left", "0px").style("top", "0px");
  });
