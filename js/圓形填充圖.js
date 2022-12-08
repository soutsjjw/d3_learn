//#region 資料

const dataTree = {
  name: "太刀",
  children: [
    {
      name: "礦石",
      children: [
        {
          name: "結晶礦",
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
            { name: "熔巖石", num: 1 },
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

//#endregion

//#region 添加畫布

//初始化畫布
var width = 500;
var height = 500;
var margin = 30;
var svg = d3
  .select(".d3Chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("background-color", "#1a3055");
//圖
var chart = svg
  .append("g")
  .attr("transform", `translate(${2 * margin},${2 * margin})`);

//#endregion

//#region 比例尺

//顏色比例尺
const colorScale = d3.scaleOrdinal(d3.schemeSet3);

//修改數據訊息，為其添加樹形結構訊息並排序
const rootTree = d3
  .hierarchy(dataTree)
  .sum((d) => d.num) // 計算繪圖屬性value的值  -求和 其子節點所有.num屬性的和值
  .sort((a, b) => a.value - b.value); // 根據 上面計算出的value屬性 排序

//使用.pack()創建圓形布局信息，並對數據添加位置信息
const pack = d3.pack().size([width - 4 * margin, height - 4 * margin])(
  rootTree
);

//#endregion

//#region 繪製圓形

//創建繪制組
const rectChart = chart.append("g");

//對每一個節點創建單獨的繪制組
const rectChartG = rectChart
  .selectAll()
  .data(pack.descendants()) //.descendants() 返回後代節點數組
  .enter()
  .append("g")
  .attr("class", (d, i) => "g g-" + i);

//繪制圓形
rectChartG
  .append("circle")
  .attr("class", "circle")
  .attr("cx", (d) => d.x)
  .attr("cy", (d) => d.y)
  .attr("r", (d) => d.r)
  .attr("fill", (d, i) => colorScale(d.data.name));

//繪制文本
rectChartG
  .append("text")
  .attr("class", "text")
  .attr("transform", (d) => `translate(${d.x},${d.y})`)
  .text((d) => d.data.name)
  .attr("fill", "#000000")
  .attr("text-anchor", "middle")
  .attr("dy", function () {
    return this.getBBox().height / 4;
  })
  .text(function (d) {
    if (d.children) return;
    if (textWidthIsOk(d, this)) {
      return d.data.name;
    } else {
      return "...";
    }
  });

//檢測文本長度是否合適
function textWidthIsOk(d, text) {
  const textWidth = text.getBBox().width;
  return d.r * 2 >= textWidth;
}

//#endregion

//#region 添加互動

//創建信息框
var tooltips = d3
  .select("body")
  .append("div")
  .style("width", "auto")
  .style("height", "40px")
  .style("background-color", "#fff")
  .style("display", "flex")
  .style("justify-content", "center")
  .style("padding", "10px")
  .style("border-radius", "5px")
  .style("opacity", 0);

//監聽鼠標事件，獲取對象信息展示在對應位置
d3.selectAll(".g > .circle")
  .on("mouseover", function (e, d) {
    mouseover(e, d, e.target);
  })
  .on("mouseleave", function (e, d) {
    mouseleave(d, e.target);
  });

d3.selectAll(".g > .text")
  .on("mouseover", function (e, d) {
    mouseover(e, d, e.target.previousSibling);
  })
  .on("mouseleave", function (e, d) {
    mouseleave(d, e.target.previousSibling);
  });

function mouseover(e, d, target) {
  tooltips
    .html(`類型：${d.data.name}<br />數據：${d.value}%`)
    .style("position", "absolute")
    .style("left", `${e.clientX}px`)
    .style("top", `${e.clientY}px`)
    .style("opacity", 1);

  d3.select(target).attr("fill", "white");
}

function mouseleave(d, target) {
  tooltips.style("opacity", 0).style("left", "0px").style("top", "0px");
  d3.select(target).attr("fill", colorScale(d.data.name));
}

//#endregion
