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

// 顏色比例尺
var colorScale = d3.scaleOrdinal(d3.schemeSet3);

// 轉換資料為d3樹形資料結構，並對每個層級排序
const rootTree = d3
  .hierarchy(dataTree)
  // 計算繪圖屬性value的值，-求和 其子節點所有.num屬性的和值
  .sum((d) => d.num)
  // 根據上面計算出的value屬性排序
  .sort((a, b) => a.value - b.value);

// 建立一個新的樹布局
// .size() 設置布局的尺寸
const treeData = d3.tree().size([width - 4 * margin, height - 4 * margin]);

//#endregion

//#region 繪製樹

// 樹節點和線條分開繪製，建立兩個繪製群組
const linkChart = chart.append("g");
const rectChart = chart.append("g");

/**
 * 處理結點 點擊
 * @param {Object} ev 事件
 * @param {Object} d 資料
 */
function handle_node_click(ev, d) {
  // 樹狀圖點擊節點，可以收起子節點，再次點擊，展開子節點
  d.sourceX = d.x;
  d.sourceY = d.y;

  if (d.depth !== 0) {
    if (d.children) {
      d._children = d.children;
      d.children = undefined;

      draw();
    } else if (d._children) {
      for (let a of d._children) {
        a.originX = a.parent.x;
        a.originY = a.parent.y;
      }
      d.children = d._children;

      draw();
    }
  }
}

/**
 *
 * @param {boolean} init 是否第一次載入
 */
function draw(init = false) {
  // 為資料添加位置訊息
  let root = treeData(rootTree);
  // 取得所有節點資料
  let nodes = root.descendants();

  const rectNode = rectChart
    .selectAll(".node")
    .data(nodes, (d) => d.data.name)
    .join(
      (enter) => {
        let $gs = enter.append("g").attr("transform", (d) => {
          let x, y;
          if (d.originX) {
            x = d.originX;
            delete d.originX;
          } else {
            x = d.x;
          }
          if (d.originY) {
            y = d.originY;
            delete d.originY;
          } else {
            y = d.y;
          }

          return `translate(${x}, ${y})`;
        });

        $gs
          .append("circle")
          .attr("r", 24)
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("fill", (d) =>
            d.children || d._children ? colorScale(1) : colorScale(2)
          );

        $gs
          .append("text")
          .attr("class", "text")
          .text((d) =>
            d.data.name.length < 3
              ? d.data.name
              : d.data.name.slice(0, 1) + "..."
          )
          .attr("fill", "#000000")
          .style("font-size", "12px")
          .attr("dx", (d) => {
            return -12;
          })
          .attr("dy", function () {
            return this.getBBox().height / 4;
          });

        return $gs;
      },
      (update) => update,
      (exit) => {
        // 刪除多出 節點 添加動畫
        exit
          .transition()
          .duration(init ? 0 : 1000)
          .attr("opacity", 0)
          .attr("transform", (d) => `translate(${d.parent.x}, ${d.parent.y})`)
          .remove();
      }
    )
    .attr("class", "node")
    .style("cursor", "pointer")
    .on("click", handle_node_click)
    // 節點載入時添加動畫
    .transition()
    .duration(init ? 0 : 1000)
    .attr("opacity", 1)
    .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

  // 取得線條 位置訊息
  let links = root.links();
  linkChart
    .selectAll(".link")
    .data(links, (d, i) => d.target.data.name)
    .join(
      (enter) =>
        enter
          .append("path")
          .attr("class", "link")
          .attr("fill", "none")
          .attr("stroke", "gray")
          .attr("d", (d) => {
            let s = d.source;
            let origin = `${s.sourceX || s.x},${s.sourceY || s.y}`;
            return `M ${origin} L ${origin}`;
          }),
      (update) => update,
      (exit) =>
        exit
          .transition()
          .duration(init ? 0 : 1000)
          .attr("d", (d) => {
            let s = d.source;
            let origin = `${s.x},${s.y}`;

            return `M ${origin} L ${origin}`;
          })
          .remove()
    )
    .transition()
    .duration(init ? 0 : 1000)
    .attr("d", (d) => {
      let s = d.source;
      let t = d.target;
      return `M ${s.x},${s.y} L ${t.x},${t.y}`;
    });
}

draw(true);

//#endregion
