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

// 初始化畫布
var width = 700;
var height = 700;
var margin = 60;

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

// 序數比例尺 顏色
let colorScale = d3
  .scaleOrdinal()
  .domain(d3.range(0, dataArr.length))
  .range(d3.schemeCategory10);

// 繪製扇形
// 半徑
var radius = (Math.min(width, height) * 0.5) / 2;
// .pie() 是shape中的 餅圖（pie）生成器 計算圖所需要的角度信息
// .startAngle()  起始角度設置
// .endAngle()  終止角度設置
// .padAngle()  餅圖扇形之間的間隔設置
let drawData = d3
  .pie()
  .value(function (d) {
    return d.value;
  })
  .startAngle(0)
  .endAngle(Math.PI * 2);

// .arc() 是shape中的 弧形生成器
// innerRadius() 設置內半徑
// outerRadius() 設置外半徑
// cornerRadius() 設置拐角圓滑
let arc = d3.arc().innerRadius(0).outerRadius(100);

const arcs = chart
  .append("g")
  .attr(
    "transform",
    `translate(${radius * 2 - margin},${radius * 2 - margin})`
  );

arcs
  .selectAll()
  .data(drawData(dataArr))
  .enter()
  .append("path")
  .attr("class", "pieArc")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1)
  .attr("fill", function (d) {
    return colorScale(d.index);
  })
  .attr("d", function (d, i) {
    // 根據 pie 數據計算路徑
    return arc(d);
  })
  .transition()
  .duration(1000)
  .attrTween("d", function (d) {
    // 初始加載時的過渡效果
    let interpolate = d3.interpolate({ endAngle: d.startAngle }, d);
    return function (t) {
      return arc(interpolate(t));
    };
  });

// 繪製標籤
const arc2 = d3
  .arc()
  .outerRadius(100 * 3.5)
  .innerRadius(0);

// 計算文字水平偏移
const textOffsetM = 10;
const scaleTextDx = d3
  .scaleLinear()
  .domain([0, Math.PI / 2])
  .range([textOffsetM, textOffsetM * 3]);

function computeTextDx(d) {
  // 計算文字水平偏移
  const middleAngle = (d.endAngle + d.startAngle) / 2;
  let dx = "";
  if (middleAngle < Math.PI) {
    dx = scaleTextDx(Math.abs(middleAngle - Math.PI / 2));
  } else {
    dx = -scaleTextDx(Math.abs(middleAngle - (Math.PI * 3) / 2));
  }
  return dx;
}

arcs
  .selectAll()
  .data(drawData(dataArr))
  .enter()
  .append("text")
  .attr("text-anchor", (d) => {
    return (d.endAngle + d.startAngle) / 2 > Math.PI ? "end" : "start";
  })
  .attr("stroke", "steelblue")
  .attr("dy", "0.35em")
  .attr("dx", computeTextDx)
  .attr("transform", (d) => {
    return "translate(" + arc2.centroid(d) + ")";
  })
  .text((d) => d.data.label + ": " + d.data.value);

// 生成連線的點
const linePoints = drawData(dataArr).map((d) => {
  const line = [];
  const tempPoint = arc2.centroid(d);
  const tempDx = computeTextDx(d);
  const dx = tempDx > 0 ? tempDx - textOffsetM : tempDx + textOffsetM;
  line.push(arc.centroid(d));
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
  .classed("line", true)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("d", generateLine);

// 弧形動畫
function arcTween(outerRadius) {
  return function () {
    d3.select(this)
      .transition()
      .attrTween("d", function (d) {
        let interpolate = d3.interpolate(100, 100 + outerRadius);
        return function (t) {
          let arcT = d3.arc().outerRadius(interpolate(t)).innerRadius(0);
          return arcT(d);
        };
      });
  };
}

d3.selectAll(".pieArc")
  .on("mouseover", arcTween(20))
  .on("mouseout", arcTween(0));
