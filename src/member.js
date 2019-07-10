import * as d3 from "d3";


class Member{
	constructor(data, holder, selection, scales, cb) {
		this.holder = holder;
		this.data = data; 
		this.cb = cb;
		this.colourScales = {
			"party": {"R": "IndianRed", "D": "DodgerBlue"},
			"gender": {"M": "LightSkyBlue", "F": "LightPink"}
		};
		this.margins = {
			"top": 40,
			"left": 60,
			"right": 0,
			"bottom": 40
		};
		this.width = this.holder.node().width.baseVal.value;
		this.height = this.holder.node().height.baseVal.value;

		this.holder
		.attr("viewBox", [0, 0, this.width, this.height]);

		this.selection = selection;
		this.scales = scales;
		this.drawCharts = this.drawCharts.bind(this);
		this.xScale = d3.scaleLinear()
			.range([this.margins.left, this.width - this.margins.left - this.margins.right]);
		this.xScale.domain(scales[selection["xAxis"]].scale);
		this.yScale = d3.scaleLinear()
			.range([this.height - this.margins.bottom, this.margins.top]);
		this.yScale.domain(scales[selection["yAxis"]].scale);
		this.sizeScale = d3.scaleLinear()
			.range([5, 20]);
		this.sizeScale.domain(scales[selection["size"]].scale);

		this.xAxis = this.holder.append("g").attr("class", "xAxis")
    		.attr("transform", "translate(0," + (this.height - this.margins.bottom) + ")")
    		.call(d3.axisBottom(this.xScale)
    				.ticks(this.width / 80).tickSizeOuter(0));
    
    	this.yAxis = this.holder.append("g").attr("class", "yAxis")
	    	.attr("transform", "translate(" + this.margins.left + ",0)")
	    	.call(d3.axisLeft(this.yScale)
    				.ticks(this.height / 80).tickSizeOuter(0));

		this.drawCharts();
	}

	setScales(selection){
		this.selection = selection;
		this.xScale.domain(this.scales[selection["xAxis"]].scale);
		this.yScale.domain(this.scales[selection["yAxis"]].scale);
		this.sizeScale.domain(this.scales[selection["size"]].scale);

		this.xAxis
    		.call(d3.axisBottom(this.xScale)
    				.ticks(this.width / 80).tickSizeOuter(0));

    	this.yAxis
    		.call(d3.axisLeft(this.yScale)
    				.ticks(this.height / 80).tickSizeOuter(0));

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

		this.holder
		.selectAll(".memberGraph")
		.select("text")
		.transition().duration(300)
		.attr("x", function(d){
				return sizeScale(d[selection["size"]]) + 5
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
			})
			.on("mouseenter", function(d){
				//little wobble animation on mouseenter
				d3.select(this)
					.transition()
					.duration(250)
					.attr("r", function(e){ return sizeScale(e[selection["size"]] + 20)})
					.transition()
					.duration(250)
					.attr("r", function(e){ return sizeScale(e[selection["size"]])});
			})
			.on("click", (d) => this.cb(d["id"]));

		itemObjects.append("text")
			.attr("x", function(d){
				return sizeScale(d[selection["size"]]) + 5
			})
			.attr("dy", 5)
			.html(function(d) {return d.name});

		items.exit().remove();

	}
}

export default Member;