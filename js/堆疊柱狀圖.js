// 建立資料
var bColor = ["#4385F4", "#34A853", "#FBBC05", "#E94335", "#01ACC2", "#AAACC2"];
var dataArr = [
  {
    label: "1月",
    value: 10.5,
    value2: 20.5,
  },
  {
    label: "2月",
    value: 70.5,
    value2: 22.5,
  },
  {
    label: "3月",
    value: 60.5,
    value2: 30.5,
  },
  {
    label: "4月",
    value: 10.5,
    value2: 20.5,
  },
  {
    label: "5月",
    value: 20.5,
    value2: 40.5,
  },
  {
    label: "6月",
    value: 30.5,
    value2: 30.5,
  },
];

// 建立畫布
var svg = d3
  .select(".d3Chart")
  .append("svg")
  .attr("width", 500)
  .attr("height", 500)
  .style("background-color", "#1a3055");

// 建立比例尺
// X軸比例尺
var xScale = d3
  .scaleBand()
  .range([0, 400])
  .domain(dataArr.map((s) => s.label))
  .padding(0.4);
// Y軸比例尺
var yScale = d3.scaleLinear().range([400, 0]).domain([0, 100]);

// 繪製座標軸
var chart = svg.append("g").attr("transform", "translate(50, 40)");

chart
  .append("g")
  .attr("class", "xAxis")
  .attr("transform", "translate(15, 400)")
  .call(d3.axisBottom(xScale));
var makeYLines = () =>
  d3
    .axisLeft(yScale)
    .tickSize(-400)
    .tickFormat((d) => {
      return d + "%";
    });
chart
  .append("g")
  .attr("class", "yAxis")
  .attr("transform", "translate(15, 0)")
  .call(makeYLines());

// 標籤
d3.select(".yAxis")
  .append("g")
  .attr("transform", "translate(-40, 0)")
  .append("text")
  .attr("class", "axisTextY")
  .style("font-size", "24px")
  .attr("transform", "rotate(-90)")
  .text("比例(%)");
// 標籤居中
d3.select(".axisTextY").attr("x", function () {
  return -200 + this.getBoundingClientRect().height / 2;
});

d3.selectAll(".d3Chart text").style("fill", "#fff");
d3.selectAll(".d3Chart line").style("stroke", "#fff");
d3.selectAll(".d3Chart path").style("stroke", "#fff");

// stack() 組合堆疊 配置
const stack = d3
  .stack()
  .keys(["value", "value2"])
  .order(d3.stackOrderAscending);

// console.log('stack', stack(dataArr));

// 柱狀
const groups = chart.selectAll().data(stack(dataArr));
// 堆疊資料建立
const heaps = groups
  .enter()
  .append("g")
  .attr("class", (d) => "g " + d.key)
  .attr("fill", (d, i) => bColor[i]);

// 堆疊資料 拆解 柱資料 綁定到對應柱上
const bars = heaps.selectAll().data((d) => {
  return d.map((item) => {
    item.index = d.index;
    item.name = d.key;
    return item;
  });
});
// 在堆疊中繪製柱
bars
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", (d) => xScale(d.data.label) + xScale.bandwidth() / 2 - 4)
  .attr("y", (d) => yScale(d[1]))
  .attr("width", xScale.bandwidth())
  .attr("height", (d) => yScale(d[0]) - yScale(d[1]));

// 添加互動
var tooltips = d3
  .select("body")
  .append("div")
  .style("width", "100px")
  .style("height", "60px")
  .style("background-color", "#fff")
  .style("dispaly", "flex")
  .style("justify-content", "center")
  .style("padding", "10px")
  .style("border-radius", "5px")
  .style("opacity", 0);

d3.selectAll(".bar")
  .on("mouseenter", (e, g) => {
    tooltips
      .html(
        `月份：${g[`data`].label}<br /> 类型：${g["name"]}<br /> 数据：${
          g[`data`][g["name"]]
        }%`
      )
      .style("position", "absolute")
      .style("left", `${e.clientX}px`)
      .style("top", `${e.clientY}px`)
      .style("opacity", 1);
  })
  .on("mouseleave", (e, g) => {
    tooltips.style("opacity", 0).style("left", `0px`).style("top", `0px`);
  });
