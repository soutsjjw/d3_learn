var bColor = ["#4385F4", "#34A853", "#FBBC05", "#E94335", "#01ACC2", "#AAACC2"];
var dataArr = [
  [
    {
      x: 70.5,
      y: 0.5,
      shape: 0,
    },
    {
      x: 30.5,
      y: 30.5,
      shape: 0,
    },
    {
      x: 50.5,
      y: 20.5,
      shape: 0,
    },
    {
      x: 60.5,
      y: 10.5,
      shape: 0,
    },
    {
      x: 20.5,
      y: 70.5,
      shape: 0,
    },
    {
      x: 70.5,
      y: 70.5,
      shape: 0,
    },
    {
      x: 60.5,
      y: 90.5,
      shape: 0,
    },
    {
      x: 70.5,
      y: 10.5,
      shape: 0,
    },
    {
      x: 10.5,
      y: 30.5,
      shape: 0,
    },
    {
      x: 30.5,
      y: 20.5,
      shape: 0,
    },
  ],
  [
    {
      x: 71.5,
      y: 2.5,
      shape: 1,
    },
    {
      x: 30.5,
      y: 60.5,
      shape: 1,
    },
    {
      x: 50.5,
      y: 70.5,
      shape: 1,
    },
    {
      x: 60.5,
      y: 50.5,
      shape: 1,
    },
    {
      x: 10.5,
      y: 70.5,
      shape: 1,
    },
    {
      x: 60.5,
      y: 60.5,
      shape: 1,
    },
    {
      x: 90.5,
      y: 90.5,
      shape: 1,
    },
    {
      x: 70.5,
      y: 10.5,
      shape: 1,
    },
    {
      x: 20.5,
      y: 30.5,
      shape: 1,
    },
    {
      x: 80.5,
      y: 10.5,
      shape: 1,
    },
  ],
];

// 初始化畫布
var width = 450;
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

//　建立比例尺
// 線性比例尺
var xScale = d3.scaleLinear().range([0, 400]).domain([0, 100]);
// 線性比例尺
var yScale = d3.scaleLinear().range([400, 0]).domain([0, 100]);
// 序數比例尺 顏色
let colorScale = d3
  .scaleOrdinal()
  .domain(d3.range(0, dataArr.length))
  .range(bColor);

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
const groups = chart.append("g").selectAll().data(dataArr);

const points = groups
  .enter()
  .append("g")
  .attr("fill", (d, i) => bColor[i])
  .selectAll()
  .data((d) => d);

points
  .enter()
  .append("path")
  .attr("transform", (d) => `translate(${xScale(d.x)},${yScale(d.y)})`)
  .attr("class", "pathCircle")
  .attr(
    "d",
    d3
      .symbol()
      .type(function (d) {
        return d3.symbolsFill[d.shape];
      })
      .size(1)
  )
  .transition()
  .duration(1000)
  .attr(
    "d",
    d3
      .symbol()
      .type(function (d) {
        return d3.symbolsFill[d.shape];
      })
      .size(100)
  );

// 添加互動
function arcTweenMouse(type) {
  return function () {
    d3.select(this)
      .transition()
      .attr(
        "d",
        d3
          .symbol()
          .type(function (d) {
            return d3.symbolsFill[d.shape];
          })
          .size(type ? 300 : 100)
      );
  };
}
d3.selectAll(".pathCircle")
  .on("mouseover", arcTweenMouse(true))
  .on("mouseout", arcTweenMouse(false));
