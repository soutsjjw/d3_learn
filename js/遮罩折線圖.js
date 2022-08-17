// 資料
var bColor = ["#4385F4", "#34A853", "#FBBC05", "#E94335", "#01ACC2", "#AAACC2"];
var dataArr = [
  {
    label: "1月",
    value: 10.5,
    value2: 70.5,
  },
  {
    label: "2月",
    value: 70.5,
    value2: 10.5,
  },
  {
    label: "3月",
    value: 60.5,
    value2: 10.5,
  },
  {
    label: "4月",
    value: 10.5,
    value2: 30.5,
  },
  {
    label: "5月",
    value: 20.5,
    value2: 10.5,
  },
  {
    label: "6月",
    value: 30.5,
    value2: 3.5,
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
  .text("時間");

d3.selectAll(".d3Chart text").style("fill", "#fff");
d3.selectAll(".d3Chart line").style("stroke", "#fff");
d3.selectAll(".d3Chart path").style("stroke", "#fff");

//轉換資料格式，便於繪製
let items = [];
dataArr.forEach((row) => {
  let index = 0;
  Object.keys(row).forEach((key) => {
    if (key != "label") {
      if (items[index]) {
        items[index].push([row.label, row[key], key, index]);
      } else {
        items[index] = [[row.label, row[key], key, index]];
      }
      index++;
    }
  });
});

// 繪製折線
let line = d3
  .line()
  .x(function (d) {
    return d[0];
  })
  .y(function (d) {
    return d[1];
  });

const groups = chart.selectAll().data(items);

const lines = groups
  .enter()
  .append("g")
  .selectAll()
  .data((d) => [d]);

lines
  .enter()
  .append("path")
  .attr("class", "lines")
  .attr("d", function (d) {
    const row = d.map((item) => {
      const itemS = [];
      itemS.push(xScale(item[0]));
      itemS.push(yScale(item[1]));
      return [...itemS];
    });
    return line(row);
  })
  .attr("stroke", (d, i) => bColor[d[0][3]])
  .attr("fill", "none")
  .attr("transform", `translate(${xScale.bandwidth() / 2}, 0)`);

// 繪製圓點
const circles = groups
  .enter()
  .append("g")
  .attr("class", "Gcircle")
  .selectAll()
  .data((d) => d);

circles
  .enter()
  .append("circle")
  .attr("cx", (d) => {
    return xScale(d[0]);
  })
  .attr("cy", (d) => {
    return yScale(d[1]);
  })
  .attr("r", 4)
  .attr("transform", `translate(${xScale.bandwidth() / 2}, 0)`)
  .attr("fill", "#fff")
  .attr("stroke", "rgba(56, 8, 228, .5)");

// 繪製遮罩層
const generateArea = d3
  .area()
  .x((d) => d[0])
  .y0((d) => d[1])
  .y1((d) => 400);

lines
  .enter()
  .append("path")
  .attr("class", "area")
  .attr("d", function (d) {
    const row = d.map((item) => {
      const itemS = [];
      itemS.push(xScale(item[0]));
      itemS.push(yScale(item[1]));
      return [...itemS];
    });
    return generateArea(row);
  })
  .attr("fill", (d, i) => bColor[d[0][3]])
  .attr("fill-opacity", "0.5")
  .attr("transform", `translate(${xScale.bandwidth() / 2}, 0)`);
