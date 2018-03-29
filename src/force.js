import * as d3 from "d3";
import "d3-selection-multi";
export default class Forces{
  constructor(){
    this.container = document.getElementById("forces-container");
    
    this.createLab();
  }
  createLab = () =>{
    let data = this.createData();
    console.log(data)
    let svg = d3.select("#forces-container").append("svg");
    let layout = svg.append("g").attrs({"class":"layout"});

    this.mainHandle({data:data,svg:svg,layout:layout});
  }
  mainHandle = (prams) => {
    this.setSize(prams);
    this.drawChart(prams);
  }
  setSize = (prams) => {
    let mW = this.container.clientWidth;
    let mH = this.container.clientHeight;
    prams.svg.attrs({
      width:mW,
      height:mH
    });
    prams.layout.attrs({
      width:mW,
      height:mH
    })
  }
  drawChart = (prams) => {
    let mW = this.container.clientWidth;
    let mH = this.container.clientHeight;
    let simulation = d3.forceSimulation()
                        .force("link", d3.forceLink().id((d)=>d.index ))
                        .force("collide",d3.forceCollide((d)=>d.r + 16 ).iterations(16))
                        .force("charge", d3.forceManyBody())
                        .force("center", d3.forceCenter(mW,0))
                        .force("y", d3.forceY(0))
                        .force("x", d3.forceX(0))
    // let simulation2 = d3.forceSimulation()
    //                     .force("link", d3.forceLink().id((d)=>d.index ))
    //                     .force("center",d3.forceCenter(0,0))
    let link = prams.svg.append("g")
                        .attr("class", "links")
                        .selectAll("line")
                        .data(prams.data.links)
                        .enter()
                        .append("line")
                        .attr("stroke", "black");
    let node = prams.svg.append("g")
                  .attr("class", "nodes")
                  .selectAll("circle")
                  .data(prams.data.nodes)
                  .enter().append("circle")
                  .attr("r", (d)=>d.r)
                  .call(d3.drag()
                      .on("start",(d) => dragstarted(d))
                      .on("drag", (d) => dragged(d))
                      .on("end", (d) => dragended(d)));
      let ticked = () => {
          link
              .attr("x1", (d)=>d.source.x)
              .attr("y1", (d)=>d.source.y)
              .attr("x2", (d)=>d.target.x)
              .attr("y2", (d)=>d.target.y);
          node
              .attr("cx", (d)=>d.x)
              .attr("cy", (d)=>d.y);
      }
      let dragstarted = (d) => {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      let dragged = (d) => {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
      }
      let dragended = (d) => {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
      } 
    simulation.nodes(prams.data.nodes)
                  .on("tick", ticked);
    simulation.force("link")
                  .links(prams.data.links);
    // simulation2.nodes(prams.data.nodes)
    //               .on("tick", ticked);
    // simulation2.force("link")
    //               .links(prams.data.links);
  }
  createData = () => {
    let range = 100;
    let data = {
      nodes: d3.range(0,range).map((d,i)=>{return{label:`node:${i}`,r:~~d3.randomUniform(8,28)()}}),
      links: d3.range(0,range).map((d)=>{return{source:~~d3.randomUniform(range)(),target:~~d3.randomUniform(range)()}})
    }
    
    return data;
  }
}