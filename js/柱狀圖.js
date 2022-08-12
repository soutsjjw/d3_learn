var bColor = ["#4385F4", "#34A853", "#FBBC05", "#E94335", "#01ACC2", "#AAACC2"];
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

// 建立畫布
var svg = d3
  .select(".d3Chart")
  .append("svg")
  .attr("width", 450)
  .attr("height", 440)
  .style("background-color", "#1A3055");

// 建立一個組移動位置
var chart = svg.append("g").attr("transform", "translate(20, 10)");

// 建立序數分段比例尺
// 設置輸出值0~400，輸入為X軸的分段標題
var xScale = d3
  .scaleBand()
  .range([0, 400])
  .domain(dataArr.map((s) => s.label))
  .padding(0.4);
// 繪製X軸
chart
  .append("g")
  .attr("transform", "translate(15, 400)")
  .call(d3.axisBottom(xScale));

// 建立定量的線性比例尺
var yScale = d3.scaleLinear().range([400, 0]).domain([0, 100]);
var makeYlines = () =>
  d3
    .axisLeft()
    .scale(yScale)
    .tickSize(-400)
    .tickFormat((d) => {
      return d + "%";
    });
// 繪製Y軸
chart.append("g").attr("transform", "translate(15, 0)").call(makeYlines());

// 修改顏色
d3.selectAll("text").style("fill", "#fff");
d3.selectAll(".d3Chart text").style("fill", "#fff");
d3.selectAll(".d3Chart line").style("stroke", "#fff");
d3.selectAll(".d3Chart path").style("stroke", "#fff");

// 繪製柱狀
// 選中當前組子節點綁定資料，建立元素佔位符，對佔位符建立元素
var barG = chart.selectAll().data(dataArr).enter().append("g");
barG
  .append("rect")
  .style("fill", (d, i) => bColor[i])
  .attr("x", (g, i) => xScale(g.label) + xScale.bandwidth() / 2)
  .attr("y", (g) => yScale(g.value))
  .attr("width", xScale.bandwidth())
  .attr("height", (g) => 400 - yScale(g.value));

// 繪製標題
barG
  .append("text")
  .style("font-size", "14px")
  .style("fill", "#fff")
  .attr("x", (g, i) => xScale(g.label) + xScale.bandwidth() / 2 + 2)
  .attr("y", (g) => yScale(g.value) - 10)
  .text((g) => `${g.value}%`);

// 建立提示框
var tooltips = d3
  .select("body")
  .append("div")
  .style("width", "100px")
  .style("height", "40px")
  .style("background-color", "#fff")
  .style("display", "flex")
  .style("justify-content", "center")
  .style("padding", "10px")
  .style("border-radius", "5px")
  .style("opacity", 0);
// 對每個柱狀添加交互
barG
  .append("rect")
  .style("fill", (d, i) => bColor[i])
  .attr("x", (g, i) => xScale(g.label) + xScale.bandwidth() / 2)
  .attr("y", (g) => yScale(g.value))
  .attr("width", xScale.bandwidth)
  .attr("height", (g) => 400 - yScale(g.value))
  .on("mouseenter", (e, g) => {
    tooltips
      .html(`月份：${g.label}<br /> 資料：${g.value}`)
      .style("position", "absolute")
      .style("left", `${e.clientX}px`)
      .style("top", `${e.clientY}px`)
      .style("opacity", 1);
  })
  .on("mouseleave", (e, g) => {
    tooltips.style("opacity", 0).style("left", `0px`).style("top", `0px`);
  });

barG
  .append("text")
  .style("font-size", "14px")
  .style("fill", "#fff")
  .attr("x", (g, i) => xScale(g.label) + xScale.bandwidth() / 2 + 2)
  .attr("y", (g) => yScale(g.value) - 10)
  .text((g) => `${g.value}%`);
