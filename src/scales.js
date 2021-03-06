//scale objects

import * as d3 from "d3";


class Scale{
	constructor(member_data, voting_data, spending_data, bill_info, statement_data) {
		//set with data from master
		this.member_data = member_data;
		this.voting_data = voting_data;
		this.spending_data = spending_data;
		this.bill_info = bill_info;
		this.statement_data = statement_data;
		//bind functions
		this.initiateScales = this.initiateScales.bind(this);
		this.initiatePercentScales = this.initiatePercentScales.bind(this);
		this.initiateSupportScales = this.initiateSupportScales.bind(this);

		//i included a short name for smaller screens in future iterations
		this.scales = {
			"seniority": {
				"scale": [],
				"full_name": "Seniority",
				"short_name": "seniority"
			},
			"median_travel_expenses": {
				"scale": [],
				"full_name": "Median Travel Expenses per Quarter",
				"short_name": "med. travel expenses"
			},
			"total_votes": {
				"scale": [],
				"full_name": "Total # Votes Cast",
				"short_name": "total votes"
			},
			"percent_yes": {
				"scale": [],
				"full_name": "Percent \"Yes\" Votes",
				"short_name": "perc. yes"
			},
			"percent_no": {
				"scale": [],
				"full_name": "Percent \"No\" Votes",
				"short_name": "perc. no"
			},
			"percent_support_rep": {
				"scale": [],
				"full_name": "Percent \"Yes\" on Republican Sponsored Bills",
				"short_name": "Perc. Republican Support"
			},
			"percent_support_dem": {
				"scale": [],
				"full_name": "Percent \"Yes\" on Democratic Sponsored Bills",
				"short_name": "Perc. Democratic Support"
			},
			"total_statements": {
				"scale": [],
				"full_name": "Total Statements",
				"short_name": "Total Statements"
			}
		};

		this.initiateScales();
	}

	initiateScales(){
		this.scales.seniority.scale = (d3.extent(this.member_data,
			 function(d){ return parseInt(d["seniority"])}));

		this.scales.total_votes.scale = (d3.extent(Object.values(this.voting_data),
			 function(d){
			 	let total_keys = 0;
			 	for (var i = 0; i < Object.keys(d).length; i++){
			 		total_keys += Object.keys(d[Object.keys(d)[i]]).length;
			 	}
			 	return total_keys
			}));

		this.scales.median_travel_expenses.scale = (d3.extent(Object.values(this.spending_data), function(d){
			let expenses = d3.median(d.map((e) => e.spending));
			return expenses;
		}));

		this.scales.total_statements.scale = (d3.extent(Object.values(this.statement_data), function(d){
			return d.length;
		}));

		this.scales.percent_yes.scale = this.initiatePercentScales(this.scales.percent_yes.scale, "Yes");
		this.scales.percent_no.scale = this.initiatePercentScales(this.scales.percent_no.scale, "No");
	
		this.scales.percent_support_dem.scale = this.initiateSupportScales(this.scales.percent_support_dem.scale, "D");
		this.scales.percent_support_rep.scale = this.initiateSupportScales(this.scales.percent_support_rep.scale, "R");
	}

	//initiate scales showing positive support for rep or dom bills
	initiateSupportScales(scale, search){
		let bill_info = this.bill_info;
		return d3.extent(Object.values(this.voting_data),
			 function(d){
			 	let total_votes_of_type = 0;
			 	let total_match = 0;
			 	for (var i = 0; i < Object.keys(d).length; i++){
			 		if (bill_info[Object.keys(d)[i]] && 
			 			bill_info[Object.keys(d)[i]]["sponsor_party"] === search){
			 			total_match += Object.values(d[Object.keys(d)[i]]).filter(function(d){ return d === "Yes"}).length;
			 			total_votes_of_type += Object.keys(d[Object.keys(d)[i]]).length;
			 		}
			 	}
			 	return total_match/total_votes_of_type;
			});
	}

	//initiate scales showing "yes" vs. "no votes"
	initiatePercentScales(scale, search){
		return d3.extent(Object.values(this.voting_data),
			 function(d){
			 	let total_keys = 0;
			 	let total_match = 0;
			 	for (var i = 0; i < Object.keys(d).length; i++){
			 		total_match += Object.values(d[Object.keys(d)[i]])
			 			.filter(function(e){ return e === search}).length;
			 		total_keys += Object.keys(d[Object.keys(d)[i]]).length;
			 	}
			 	return total_match/total_keys;
			});
	}

	returnScales(){
		return this.scales;
	}

}

export default Scale;