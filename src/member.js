import * as d3 from "d3";


class Member{
	constructor(member_data, voting_data, holder) {
		this.holder = holder;
		this.member_data = member_data; 
		this.voting_data = voting_data;

		this.drawCharts = this.drawCharts.bind(this);

		this.drawCharts();
	}

	drawCharts(){

		let items = 
			this.holder
			.selectAll(".memberGraph")
			.data(this.member_data, function(d){ return d.id});

		let itemObjects = items.enter()
			.append("g")
			.attr("transform", function(d){
				return "translate(" + Math.random() * window.innerWidth +
						"," + Math.random() * window.innerHeight + ")";
			})
			.attr("class", "memberGraph");

		itemObjects.append("circle")
			.attr("fill", function(d){ return d["gender"] === "F" ? "pink" : "blue"})
			.attr("r", () => Math.random() * 25);

		itemObjects.append("text")
			.html(function(d) {return d.name})

	}
}

export default Member;