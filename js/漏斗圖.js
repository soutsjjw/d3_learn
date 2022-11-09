//#region 資料

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

//#endregion

//#region 添加畫布

var width = 900;
var height = 600;
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
  .attr("transform", `translate(${2 * margin}, ${2 * margin})`);

//#endregion

//#region 創建比例尺

// 以資料的最大值創建寬度比例尺
var widthScale = d3
  .scaleLinear()
  .domain([0, d3.max(dataArr, (d) => d.value)])
  .range([0, width * 0.5]);

// 顏色比例尺
var colorScale = d3.scaleOrdinal(d3.schemeSet3);

// 對資料排序，值大的在前面。為每個資料添加下一個資料的值，用於梯形座標計算。
var handleData = dataArr
  .sort((a, b) => b.value - a.value)
  .map((d, i, array) => {
    // 取得下一個資料的值，最後一個設置為0
    if (i !== array.length - 1) {
      d.nextValue = array[i + 1].value;
    } else {
      d.nextValue = 0;
    }
    return d;
  });

//#endregion

//#region 繪製梯形

// 創建梯形繪製組，移動到畫布中間開始繪製
var funnelChart = chart
  .append("g")
  .attr("transform", "translate(" + (width - 2 * margin) / 2 + ",0)");

// 計算梯形的點座標
function getPoints(topWidth, bottomWidth, height) {
  const points = [];

  points.push(-topWidth / 2 + "," + 0);
  points.push(topWidth / 2 + "," + 0);

  if (bottomWidth == 0) {
    // 最後一個以三角形結尾
    points.push(0 + "," + height);
  } else {
    points.push(bottomWidth / 2 + "," + height);
    points.push(-bottomWidth / 2 + "," + height);
  }

  return points.join(" ");
}

// 梯形高度
var funnelHeight = 60;
// 通過使用比例尺後的值，計算出每個梯形邊頂點的位置。
funnelChart
  .selectAll()
  .data(handleData)
  .enter()
  .append("polygon")
  .attr("class", (d, i) => "trap + trap-" + i)
  .attr("points", (d) =>
    getPoints(widthScale(d.value), widthScale(d.nextValue), funnelHeight)
  )
  .attr("transform", (d, i) => "translate(0," + i * (5 + funnelHeight) + ")")
  .attr("fill", (d) => colorScale(d.label));

//#endregion

//#region 繪製文本

// 計算出每個文本的位置，繪製到梯形中間
funnelChart
  .selectAll()
  .data(handleData)
  .enter()
  .append("text")
  .attr("class", (d, i) => "label + label-" + i)
  .text((d) => d.label)
  .attr("text-anchor", "middle")
  .attr("x", 0)
  .attr("y", function (d, i) {
    return (
      i * (5 + funnelHeight) + funnelHeight / 2 + this.getBBox().height / 4
    );
  })
  .attr("stroke", "#00000000");

//#endregion

//#region 添加互動

d3.selectAll(".trap")
  .on("mouseover", function (e, d) {
    d3.select(e.target).attr("fill", "white");
  })
  .on("mouseleave", function (e, d) {
    d3.select(e.target).attr("fill", colorScale(d.label));
  });

d3.selectAll(".label")
  .on("mouseover", function (e, d) {
    d3.select(".trap-" + d.index).attr("fill", "white");
  })
  .on("mouseleave", function (e, d) {
    d3.select(".trap-" + d.index).attr("fill", colorScale(d.label));
  });

//#endregion
