var dataArr = [
  {
    label: "1月",
    value: 40.5,
  },
  {
    label: "2月",
    value: 60.5,
  },
  {
    label: "3月",
    value: 35.5,
  },
  {
    label: "4月",
    value: 30.5,
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

// 添加畫布
var width = 700;
var height = 700;
var margin = 120;
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

// 創建比例尺
// 序數比例尺 - 顏色
let colorScale = d3
  .scaleOrdinal()
  .domain(d3.range(0, dataArr.length))
  .range(d3.schemeCategory10);

// 線性比例尺 根據值 獲取扇形的半徑長度
let scaleRadius = d3
  .scaleLinear()
  .domain([0, d3.max(dataArr.map((d) => d.value))])
  .range([0, d3.min([width - 4 * margin, height - 4 * margin]) * 0.5]);

// 繪制扇形
// 餅圖（pie）生成器  計算圖所需要的角度信息
let drawData = d3
  .pie()
  .value(function (d) {
    return d.value;
  })
  .startAngle(0)
  .endAngle(Math.PI * 2)(dataArr);

// 圖形繪制組
const arcs = chart
  .append("g")
  .attr("class", "pie")
  .attr(
    "transform",
    "translate(" +
      (width - 2 * margin) / 2 +
      "," +
      (height - 2 * margin) / 2 +
      ")"
  )
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1);

// 扇形
arcs
  .selectAll()
  .data(drawData)
  .enter()
  .append("path")
  .attr("class", (d, i) => "arc arc-" + i)
  .attr("fill", (d, i) => colorScale(i))
  .transition()
  .duration(1000)
  .attrTween("d", arcTween);

function arcTween(d) {
  // 半徑插值
  const interpolate = d3.interpolate(0, scaleRadius(d.value));
  // 弧度插值
  let fn = d3.interpolate(
    {
      endAngle: d.startAngle,
    },
    d
  );
  return function (t) {
    let arc = d3.arc().outerRadius(interpolate(t)).innerRadius(0);
    return arc(fn(t));
  };
}

// 繪製標籤
const textOffsetH = 10;
// 文本
// 線性比例尺 文本 根據弧度獲取偏移值
const scaleTextDx = d3
  .scaleLinear()
  .domain([0, Math.PI / 2])
  .range([textOffsetH, textOffsetH * 3]);

/**
 * 根據 扇形弧度
 * 計算文本水平偏移
 *
 * @param d （pie）生成器的 數據
 * @returns 文本偏移值
 */
function computeTextDx(d) {
  const middleAngle = (d.endAngle + d.startAngle) / 2;
  let dx = "";
  if (middleAngle < Math.PI) {
    dx = scaleTextDx(Math.abs(middleAngle - Math.PI / 2));
  } else {
    dx = -scaleTextDx(Math.abs(middleAngle - (Math.PI * 3) / 2));
  }
  return dx;
}

/**
 * @param outerRadius 半徑
 * @param d （pie）生成器的 數據
 * @param averageLength 是否放大半徑
 * @returns 扇形 中心點
 */
function getArcCentorid(outerRadius, d, averageLength) {
  if (averageLength) outerRadius = Math.sqrt(outerRadius * 600);

  return d3.arc().outerRadius(outerRadius).innerRadius(0).centroid(d);
}

// 文本
arcs
  .selectAll()
  .data(drawData)
  .enter()
  .append("text")
  .attr("text-anchor", (d) => {
    return (d.endAngle + d.startAngle) / 2 > Math.PI ? "end" : "start";
  })
  .attr("dy", "0.35em")
  .attr("dx", computeTextDx)
  .attr("transform", (d) => {
    return "translate(" + getArcCentorid(scaleRadius(d.value), d, true) + ")";
  })
  .text((d) => d.data.label + ": " + d.data.value);

// 生成連線的點
const linePoints = drawData.map((d) => {
  const line = [];
  // 文本位置點
  const tempPoint = getArcCentorid(scaleRadius(d.value), d, true);
  const tempDx = computeTextDx(d);
  const dx = tempDx > 0 ? tempDx - textOffsetH : tempDx + textOffsetH;
  line.push(getArcCentorid(scaleRadius(d.value) * 2, d));
  line.push(tempPoint);
  line.push([tempPoint[0] + dx, tempPoint[1]]);
  return line;
});

const generateLine = d3
  .line()
  .x((d) => d[0])
  .y((d) => d[1]);

arcs
  .selectAll()
  .data(linePoints)
  .enter()
  .insert("path", ":first-child")
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("d", generateLine);

// 添加互動
/**
 * 弧形動畫
 * */
function arcTweenMouse(type) {
  // 設置緩動函數,為鼠標事件使用
  return function () {
    d3.select(this)
      .transition()
      .attrTween("d", function (d) {
        let interpolate = null;
        if (type) {
          interpolate = d3.interpolate(
            scaleRadius(d.value),
            scaleRadius(d.value + 20)
          );
        } else {
          interpolate = d3.interpolate(
            scaleRadius(d.value + 20),
            scaleRadius(d.value)
          );
        }
        return function (t) {
          let arc = d3.arc().outerRadius(interpolate(t)).innerRadius(0);
          return arc(d);
        };
      });
  };
}
d3.selectAll(".arc")
  .on("mouseover", arcTweenMouse(true))
  .on("mouseout", arcTweenMouse(false));
