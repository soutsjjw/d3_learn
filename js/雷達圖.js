var dataArr = [
  {
    label: "1月",
    value: [15.5, 10],
  },
  {
    label: "2月",
    value: [10.5, 60],
  },
  {
    label: "3月",
    value: [40.5, 100],
  },
  {
    label: "4月",
    value: [50.5, 40],
  },
  {
    label: "5月",
    value: [20.5, 10],
  },
  {
    label: "6月",
    value: [90.5, 20],
  },
];

// 添加畫布
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
  .attr("transform", `translate(${margin}, ${margin})`);

// 繪制雷達圖層級

/**
 * @param {*} vertexNum 頂點數
 * @param {*} radius 圖半徑
 * @param {*} tickNum 層級數
 */
function getPolygonPoints(vertexNum, radius, tickNum) {
  const points = []; // 點數組
  let polygon = []; // 多邊形

  // 計算 頂點間的弧度
  const anglePiece = (Math.PI * 2) / vertexNum;
  // 每個層級高度
  const radiusReduce = radius / tickNum;

  for (let r = radius; r > 0; r -= radiusReduce) {
    polygon = [];
    // 獲取 每個層頂點位置
    for (let i = 0; i < vertexNum; i++) {
      polygon.push(
        Math.sin(i * anglePiece) * r + "," + Math.cos(i * anglePiece) * r
      );
    }

    points.push(polygon.join(" "));
  }
  return points;
}
const points = getPolygonPoints(dataArr.length, 100, 5);

// 繪製正六邊形
const axes = chart
  .append("g")
  .attr("class", "axes")
  .attr(
    "transform",
    `translate(${(width - margin * 4) / 2},${(height - margin * 2) / 2})`
  );

axes
  .selectAll()
  .data(points)
  .enter()
  .append("polygon")
  .attr("class", "axis")
  .attr("points", (d) => d)
  .attr("fill", (d, i) => (i % 2 === 0 ? "white" : "#ddd"))
  .attr("stroke", "gray");

// 繪製正六邊形中心至頂點直線
const pointsTop = points[0].split(" ").map((d) => d.split(","));
const line = d3.line();

axes
  .selectAll()
  .data(pointsTop)
  .enter()
  .append("path")
  .attr("class", "line")
  .attr("d", (d) => {
    return line([
      [0, 0],
      [d[0], d[1]],
    ]);
  })
  .attr("stroke", "gray");

// 繪製標籤
function computeTextAnchor(num, i) {
  const angle = (i * 360) / num;
  if (angle === 0 || Math.abs(angle - 180) < 0.01) {
    return "middle";
  } else if (angle > 180) {
    return "end";
  } else {
    return "start";
  }
}
axes
  .selectAll()
  .data(dataArr)
  .enter()
  .append("text")
  .attr("fill", "#fff")
  .attr("x", (d, i) => Math.sin((i * Math.PI * 2) / dataArr.length) * 120)
  .attr("y", (d, i) => Math.cos((i * Math.PI * 2) / dataArr.length) * 120)
  .attr("text-anchor", (d, i) => computeTextAnchor(dataArr.length, i))
  .attr("dy", 6.5) // 對齊文字中部
  .text((d) => d.label);

// 繪製數據
let newData = [];
dataArr[0].value.forEach((item, j) => {
  const row = [];
  dataArr.forEach((item, i) => {
    row.push(item.value[j]);
  });
  newData.push(row);
});

const colorScale = d3.scaleOrdinal(d3.schemeSet2);

// 計算多邊形的頂點並生成頂點圓圈
function generatePolygons(d, index) {
  const points = [];
  const anglePiece = (Math.PI * 2) / d.length;

  d.forEach((item, i) => {
    const x = Math.sin(i * anglePiece) * item;
    const y = Math.cos(i * anglePiece) * item;

    // 添加互動
    axes
      .append("circle")
      .attr("fill", "white")
      .attr("stroke", colorScale(index))
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 3)
      .transition()
      .duration(1000)
      .attr("cx", x)
      .attr("cy", y);

    points.push(x + "," + y);
  });

  return points.join(" ");
}

axes
  .selectAll()
  .data(newData)
  .enter()
  .append("polygon")
  .attr("class", "polygon")
  .attr("fill", "none")
  .attr("stroke", (d, i) => colorScale(i))
  .attr("stroke-width", "2")
  .attr("points", (d, i) => {
    const miniPolygon = [];
    d.forEach(() => {
      miniPolygon.push("0,0");
    });
    return miniPolygon.join(" ");
  })
  .transition()
  .duration(1000)
  .attr("points", generatePolygons);

// 添加互動
d3.selectAll(".polygon")
  .on("mouseover", function (e, d) {
    d3.select(e.target).attr("stroke-width", "5");
  })
  .on("mouseleave", function (e, d) {
    d3.select(e.target).attr("stroke-width", "2");
  });
