let tem = d3.selectAll(".d3");
console.log("tem", tem);

tem.data(["black", "red"]);
tem
  .style("background-color", (g) => g)
  .style("width", "100px")
  .style("height", "100px");