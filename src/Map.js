import React from 'react';
import logo from './logo.svg';
import * as d3 from 'd3';
// import { sliderBottom } from 'd3-simple-slider';
import { zoom } from 'd3-zoom'
import * as covid_fcc from "./data/covid_fccGEO.geo.json"
import * as countries from "./data/countries.geo.json"
import * as globe from "./data/custom.geo.json"
import './App.css';
import { drag } from 'd3';
import { gsap } from "gsap";

 // color scale
 let lowColor = '#f9f9f9'
 let highColor = '#bc2a66'

 let dataArray = []
 for (let i = 0; i < covid_fcc.features.length; i++){
   let element = covid_fcc.features[i]
   console.log('ELEMENT', element)
   console.log('CASE', element.properties.cases)
   dataArray.push(element.properties.cases)
 }

 var minVal = d3.min(dataArray)
   var maxVal = d3.max(dataArray)
   var ramp = d3.scaleLog().domain([minVal,maxVal]).range([lowColor,highColor])

   for (let i = 0; i < globe.features.length; i++){
     let world = globe.features[i]
     for (let j = 0; j < covid_fcc.features.length; j++){
       let data = covid_fcc.features[j]
       if (world.properties.name === data.properties.country || 
         world.properties.adm0_a3 === data.properties.country ||
         world.properties.sovereignt === data.properties.country ||
         world.properties.name_long === data.properties.country ||
         world.properties.admin === data.properties.country)  {
         world.properties["cases"] = data.properties.cases 
         world.properties["casesPerOneMillion"] = data.properties.casesPerOneMillion
       }
       else if (world.properties.name === 'Libya' && data.properties.country === 'Libyan Arab Jamahiriya'){
         world.properties["cases"] = data.properties.cases 
         world.properties["casesPerOneMillion"] = data.properties.casesPerOneMillion
       }
       else if (world.properties.admin === 'South Korea' && data.properties.country === 'S. Korea'){
         world.properties["cases"] = data.properties.cases 
         world.properties["casesPerOneMillion"] = data.properties.casesPerOneMillion
       }
       else if (world.properties.name_long === 'Lao PDR' && data.properties.country === `Lao People's Democratic Republic`){
         world.properties["cases"] = data.properties.cases 
         world.properties["casesPerOneMillion"] = data.properties.casesPerOneMillion
       }
       else if (world.properties.name_long === 'United Kingdom' && data.properties.country === "UK"){
         world.properties["cases"] = data.properties.cases 
         world.properties["casesPerOneMillion"] = data.properties.casesPerOneMillion
       }
       else if (world.properties.name_long === 'Democratic Republic of the Congo' && data.properties.country === "DRC"){
         world.properties["cases"] = data.properties.cases 
         world.properties["casesPerOneMillion"] = data.properties.casesPerOneMillion
       }
       else if (world.properties.name_long === 'Czech Republic' && data.properties.country === "Czechia"){
         world.properties["cases"] = data.properties.cases 
         world.properties["casesPerOneMillion"] = data.properties.casesPerOneMillion
       }
       else if (world.properties.name_long === 'Bosnia and Herzegovina' && data.properties.country === "Bosnia"){
         world.properties["cases"] = data.properties.cases 
         world.properties["casesPerOneMillion"] = data.properties.casesPerOneMillion
       }
       else if (world.properties.name_long === 'United Arab Emirates' && data.properties.country === "UAE"){
         world.properties["cases"] = data.properties.cases 
         world.properties["casesPerOneMillion"] = data.properties.casesPerOneMillion
       }
       else if (world.properties.name === 'Syria' && data.properties.country === "Syrian Arab Republic"){
         world.properties["cases"] = data.properties.cases 
         world.properties["casesPerOneMillion"] = data.properties.casesPerOneMillion
       }
     }
   }

// tooltip 
var tooltip = d3.select("body")
.append("div")
.style("position", "absolute")
.style("z-index", "10")
.style("visibility", "hidden")
.style("background", "rgba(255 255 255)")
.style("padding", "5px")
.style("border", "1px solid black")
.html("a simple tooltip <br> hello" );


var width = 1400;
var height = 700;

class Map extends React.Component {
  constructor(){
    super()
    // this.click = this.click.bind(this);
  }


componentDidMount(){

  var minimizeWorld = false; 
  var minimizeZoo = false;
  var maximizeWorld = false; 
  var maximizeZoo = false; 

const container = d3.select(this.refs.jsx_map)


.call(d3.zoom().on("zoom", zoomed));


    // Create SVG

    var svg = container
    .append( 'svg' )
    .attr( 'width', width )
    .attr( 'height', height )
    .attr("id", "chart")
    .attr("zIndex", "100")
    .append("g")

// original path 
    var albersProjection = 
    d3.geoMercator()
    .scale(150)
    // .rotate([71.057,0])
    .center([0, 40])
    .translate([width/2,height/2])

    var geoPath = d3.geoPath()
    .projection(albersProjection);

    // left Side path 

    var leftSideProjection = 
    d3.geoMercator()
    .scale(75)
    // .rotate([71.057,0])
    .center([0, 40])
    .translate([width/4,height/2])

    var leftSidePath = d3.geoPath()
    .projection(leftSideProjection);

    // right side path 

        var rightSideProjection = 
        d3.geoMercator()
        .scale(75)
        // .rotate([71.057,0])
        .center([0, 40])
        .translate([width/1.5,height/2])
    
        var rightSidePath = d3.geoPath()
        .projection(rightSideProjection);

    //corner path 

    var cornerProjection = 
    d3.geoMercator()
    .scale(25)
    // .rotate([71.057,0])
    .center([0, 40])
    .translate([width/12,height/6])

    var cornerPath = d3.geoPath()
    .projection(cornerProjection);

        
      
          var world = svg
          .append( "g" )
          
      
           world.selectAll( "path" )
          .data( globe.features )
          .enter()
          .append( "path" )
          .attr("fill", function(d) {
            if (d.properties.cases > 0){
            return ramp(d.properties.cases) }
          else {
              return '#ccc'
          }
           })
          .attr( "stroke", "#333")
          .attr( "d", geoPath )
          .attr("class", "data")
          .attr("zIndex", "100")
          .on("mouseover", function(d){
           if (d.properties.cases){
              tooltip.html(`${d.properties.name_long} <br> 
              ${d.properties.cases} cases`); 
              return tooltip.style("visibility", "visible").style("text-align", "center");
           }
            })
          .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
          .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
          .on("click", clickWorld);


         function clickWorld(){
          if (!maximizeWorld){
            maximizeWorld = true

            world.selectAll('path')
            .transition()
            .duration(750)
            .attr('d', geoPath)

            minimizeZoo = true
            zoo.selectAll('path')
            .transition()
            .duration(750)
            .attr('d', cornerPath)
          }
          else {
            maximizeWorld = false
            d3.selectAll('path')
            .transition()
            .duration(750)
            .attr('d', cornerPath)

            minimizeZoo = false 
            zoo.selectAll('path')
            .transition()
            .duration(750)
            .attr('d', geoPath)
            
          }
          }

          var zoo = svg
          .append( "g" )
          
      
           zoo.selectAll( "path" )
          .data( globe.features )
          .enter()
          .append( "path" )
          .attr("fill", '#ccc')
          .attr( "stroke", "#333")
          .attr( "d", cornerPath )
          .attr("class", "data")
          // .on("mouseover", function(d){
          //  if (d.properties.cases){
          //     tooltip.html(`${d.properties.name_long} <br> 
          //     ${d.properties.cases} cases`); 
          //     return tooltip.style("visibility", "visible").style("text-align", "center");
          //  }
          //   })
          // .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
          // .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
          .on("click", clickZoo);

          function clickZoo(){
          if (!maximizeZoo){
              maximizeZoo = true
              zoo.selectAll('path')
              .transition()
              .duration(750)
              .attr('d', geoPath)

              minimizeWorld = true 
              world.selectAll('path')
              .transition()
              .duration(750)
              .attr('d', cornerPath)
          }
          else {
            maximizeZoo = false; 
            zoo.selectAll('path')
              .transition()
              .duration(750)
              .attr('d', cornerPath)

              minimizeWorld = false
              world.selectAll('path')
              .transition()
              .duration(750)
              .attr('d', geoPath)

          }
            }

      

      
        
          function zoomed () {
            svg.attr("transform", d3.event.transform.toString())
            world.attr("transform", d3.event.transform.toString())
            zoo.attr("transform", d3.event.transform.toString())
          }
        
}


    
    render(){
      return (
        <div className="MapGraphic">
          <div ref="jsx_map" id="map"></div>
        </div>
      );
      }
    }

    export default Map;