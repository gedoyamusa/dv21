const mapSvg = d3.select("svg"),
  mapWidth = +mapSvg.attr("width"),
  mapHeight = +mapSvg.attr("height");

const path = d3.geoPath();
const projection = d3
  .geoMercator()
  .scale(70)
  .center([0, 20])
  .translate([mapWidth / 2, mapHeight / 2]);

let data = new Map();
const colorScale = d3
  .scaleThreshold()
  .domain([0, 5, 10, 15, 20, 25, 30, 35])
  .range(d3.schemeBlues[7]);

Promise.all([
  d3.json(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  ),
  d3.csv("energycountry.csv")
]).then(function (loadData) {
  let topo = loadData[0];
  let csvData = loadData[1];

  csvData.forEach(function (d) {
    data.set(d.name, +d.temperature);
  });

  mapSvg
    .append("g")
    .selectAll("path")
    .data(topo.features)
    .join("path")
    .attr("d", d3.geoPath().projection(projection))
    .attr("fill", function (d) {
      d.total = data.get(d.properties.name) || 0;
      return colorScale(d.total);
    });
});
