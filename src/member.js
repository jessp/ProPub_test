import * as d3 from "d3";


class Member{
	constructor(data, holder, selection, scales) {
		this.holder = holder;
		this.data = data; 
		this.colourScales = {
			"party": {"R": "navy", "D": "red"},
			"gender": {"M": "blue", "F": "pink"}
		};

		this.selection = selection;
		this.scales = scales;
		this.drawCharts = this.drawCharts.bind(this);
		this.xScale = d3.scaleLinear()
			.range([0, this.holder.node().width.baseVal.value]);
		this.xScale.domain(scales[selection["xAxis"]].scale);
		this.yScale = d3.scaleLinear()
			.range([this.holder.node().height.baseVal.value, 0]);
		this.yScale.domain(scales[selection["yAxis"]].scale);
		this.sizeScale = d3.scaleLinear()
			.range([5, 20]);
		this.sizeScale.domain(scales[selection["size"]].scale);

		this.drawCharts();
	}

	setScales(selection){
		this.selection = selection;
		this.xScale.domain(this.scales[selection["xAxis"]].scale);
		this.yScale.domain(this.scales[selection["yAxis"]].scale);
		this.sizeScale.domain(this.scales[selection["size"]].scale);
		this.drawCharts();
	}

	drawCharts(){

		let items = 
			this.holder
			.selectAll(".memberGraph")
			.data(this.data, function(d){ return d.id});

		let colourScales = this.colourScales[this.selection["colour"]];
		
		let xScale = this.xScale;
		let yScale = this.yScale;
		let sizeScale = this.sizeScale;
		let selection = this.selection;

		let itemObjects = items.enter()
			.append("g")
			.attr("transform", function(d){
				return "translate(" + xScale(d[selection["xAxis"]]) +
						"," + yScale(d[selection["yAxis"]]) + ")";
			})
			.attr("class", "memberGraph");

		this.holder
			.selectAll(".memberGraph").transition().duration(300)
			.attr("transform", function(d){
					return "translate(" + xScale(d[selection["xAxis"]]) +
							"," + yScale(d[selection["yAxis"]]) + ")";
			})
			.select("circle")
			.transition().duration(300)
			.attr("fill", function(d){ 
				if (colourScales[d[selection["colour"]]]){
					return colourScales[d[selection["colour"]]];
				} else {
					return "#444";
				}
			})
			.attr("stroke", function(d){
				if (colourScales[d[selection["colour"]]]){
					return d3.color(colourScales[d[selection["colour"]]]).darker();
				} else {
					return d3.color("#444").darker(0.25);
				}
			})
			.attr("r", function(d){
				return sizeScale(d[selection["size"]])
			});

		itemObjects.append("circle")
			.attr("fill", function(d){ 
				if (colourScales[d[selection["colour"]]]){
					return colourScales[d[selection["colour"]]];
				} else {
					return "#444";
				}
			})
			.attr("stroke-width", 2)
			.attr("stroke", function(d){
				if (colourScales[d[selection["colour"]]]){
					return d3.color(colourScales[d[selection["colour"]]]).darker();
				} else {
					return d3.color("#444").darker(0.25);
				}
			})
			.attr("r", function(d){
				return sizeScale(d[selection["size"]])
			});

		itemObjects.append("text")
			.html(function(d) {return d.name});

		items.exit().remove();

	}
}

export default Member;