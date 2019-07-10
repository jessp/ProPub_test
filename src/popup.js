import * as d3 from "d3";


class Popup{
	constructor(){
		this.core_data = null;
		this.holder = d3.select("#blocker");

		this.makeVisible = this.makeVisible.bind(this);
	}

	makeVisible(core_data, statement_data){
		this.core_data = core_data;
		this.statement_data = statement_data;
		this.holder.classed("hidden", false);

		this.holder.select(".footer")
			.selectAll("a")
			.classed("hidden", false);

		this.holder
			.select(".header")
			.select("h1")
			.html(core_data["name"]);

		this.holder
			.select(".seniorityField")
			.html(core_data["seniority"]);

		let party_dict = {
			"R": "Republican",
			"D": "Democrat"
		};

		this.holder
			.select(".partyField")
			.html(party_dict[core_data["party"]] ? party_dict[core_data["party"]] : core_data["party"]);
	
		if (core_data["twitter_id"]){
			this.holder.select(".twitter")
				.attr("url", "https://twitter.com/" + core_data["twitter_id"])
				.select(".url")
				.html(core_data["twitter_id"]);
		} else {
			d3.select(".twitter").classed("hidden", true);
		}

		if (core_data["facebook_account"]){
			this.holder.select(".facebook")
				.attr("url", "https://facebook.com/" + core_data["facebook_account"])
				.select(".url")
				.html(core_data["facebook_account"]);
		} else {
			d3.select(".facebook").classed("hidden", true);
		}

		if (core_data["youtube_id"]){
			this.holder.select(".youtube")
				.attr("url", "https://youtube.com/" + core_data["youtube_id"])
				.select(".url")
				.html(core_data["youtube_id"]);
		} else {
			d3.select(".youtube").classed("hidden", true);
		}

		if (statement_data){
			this.holder.select(".all_statements")
				.selectAll(".card")
				.data(statement_data, function(d){ return d})
				.enter()
				.append("div")
				.attr("class", "card")
				.each(function(d){
					let thisCard = d3.select(this);
					thisCard.append("h4").html(d["title"]);
					let theSpan = thisCard.append("h6");

					theSpan.append("span")
						.attr("class", "bold")
						.html("Date: ");

					theSpan.append("span")
						.html(d["date"]);

					theSpan.append("span")
						.attr("class", "bold")
						.html("Type: ");

					theSpan.append("span")
						.html(d["type"]);
				})
		} else {
			this.holder.select(".all_statements")
				.append("div")
				.attr("class", "card")
				.append("h4").html("No statements...");

		}

	}
}

export default Popup;