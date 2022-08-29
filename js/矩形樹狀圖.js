const dataTree = {
  name: "太刀",
  children: [
    {
      name: "礦石",
      children: [
        {
          name: "結晶框",
          children: [
            { name: "藍礦", num: 10 },
            { name: "黑鐵礦", num: 3 },
            { name: "白灰礦", num: 4 },
          ],
        },
      ],
    },
    {
      name: "木材",
      children: [
        {
          name: "稀木",
          children: [
            { name: "鈷木", num: 4 },
            { name: "黑木", num: 2 },
          ],
        },
        {
          name: "水木",
          children: [{ name: "藍木", num: 4 }],
        },
      ],
    },
    {
      name: "寶石",
      children: [
        {
          name: "太陽類",
          children: [
            { name: "日金石", num: 6 },
            { name: "熔岩石", num: 1 },
          ],
        },
        {
          name: "深海類",
          children: [
            { name: "寒鐵石", num: 2 },
            { name: "金晶石", num: 3 },
            { name: "玄冰結晶", num: 2 },
          ],
        },
      ],
    },
  ],
};

// 添加畫布
var width = 500;
var height = 500;
var margin = 30;
var svg = d3
  .select(".d3Chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("background-color", "#1a3055");
// 圖
var chart = svg
  .append("g")
  .attr("transform", `translate(${margin}, ${margin})`);

// 建立格式轉換器
// 生成層次結構數據 - 並為各個節點指定 層次結構數據
const rootTree = d3
  .hierarchy(dataTree)
  // 計算繪圖屬性value的值  -求和 其子節點所有.num屬性的和值
  .sum((d) => d.num)
  // 根據 上面計算出的 value屬性 排序
  .sort((a, b) => a.value - b.value);

console.log(
  "🚀 ~ file: 學習D3.js（十二）矩形樹狀圖.html ~ line 88 ~ rootTree",
  rootTree
);

const TreeMap = d3
  .treemap()
  .size([width - 2 * margin, height - 2 * margin])
  .round(true)
  .padding(1)(rootTree);

console.log(
  "🚀 ~ file: 學習D3.js（十二）矩形樹狀圖.html ~ line 99 ~ TreeMap",
  TreeMap
);

var colorScale = d3.scaleOrdinal(d3.schemeSet3);

// 繪製矩形
const rectChart = chart.append("g");

rectChart
  .selectAll()
  .data(rootTree.leaves())
  .enter()
  .append("rect")
  .attr("class", "cell")
  .attr("x", (d) => d.x0)
  .attr("y", (d) => d.y0)
  .attr("width", (d) => d.x1 - d.x0)
  .attr("height", (d) => d.y1 - d.y0)
  .attr("fill", (d, i) => colorScale(i));

rectChart
  .selectAll()
  .data(rootTree.leaves())
  .enter()
  .append("text")
  .attr("class", "cellText")
  .attr(
    "transform",
    (d) => `translate(${(d.x0 + d.x1) / 2}, ${(d.y0 + d.y1) / 2 + 6})`
  )
  .attr("fill", "#555")
  .attr("text-anchor", "middle")
  .text((d) => d.data.name)
  .text(function (d) {
    if (textWidthIsOk(d, this)) {
      return d.data.name;
    } else {
      return "...";
    }
  });

// 檢測文本長度是否合適
function textWidthIsOk(d, text) {
  const textWidth = text.getBBox().width;
  return d.x1 - d.x0 >= textWidth;
}

// 添加互動
var tooltips = d3
  .select("body")
  .append("div")
  .style("width", "auto")
  .style("height", "40px")
  .style("background-color", "#fff")
  .style("dispaly", "flex")
  .style("justify-content", "center")
  .style("padding", "10px")
  .style("border-radius", "5px")
  .style("opacity", 0);

d3.selectAll(".cell,.cellText")
  .on("mouseover", function (e, d) {
    tooltips
      .html(`材料：${d.data.name}<br /> 數量：${d.value}`)
      .style("position", "absolute")
      .style("left", `${e.clientX}px`)
      .style("top", `${e.clientY}px`)
      .style("opacity", 1);
  })
  .on("mouseleave", function (e, d) {
    tooltips.style("opacity", 0).style("left", `0px`).style("top", `0px`);
  });
