import css from './css/main.scss';
import searcher from "./searcher.js";
import member from "./member.js";
import scale_maker from "./scales.js";

import * as d3 from "d3";

//let's temporarily load data from a json file
//for prototyping etc.
import member_data from "./data/members.json";
import voting_data from "./data/voting_history.json";
import spending_data from "./data/spending_history.json";
import bill_info from "./data/bill_info.json";

let mySearcher = new searcher();
let scales;
let member_object;
let selected_dropdowns = {
	"xAxis": "seniority",
	"yAxis": "median_travel_expenses",
	"size": "total_votes",
	"colour": "party"
};
let combinedData = []; 


window.onload = function(e){
	combinedData = 
		combineData(member_data["results"],
		voting_data, spending_data);

	scales = new scale_maker(
		member_data["results"],
		voting_data,
		spending_data,
		bill_info);

	member_object = 
		new member(combinedData, 
		d3.select(".svgHolder").select("svg"),
		selected_dropdowns, scales.returnScales());

	//initialize our colour label dropdown
	let colourDropdown = 
		d3.select("#colorBy")
		.selectAll("option")
		.data([{"value": "party", "name": "Party"}, 
			{"value": "gender", "name": "Gender"}], 
			function(d){ return d.value})
		.enter()
		.append("option")
		.attr("value", function(d){ return d.value})
		.property("selected", function(d){ return d === selected_dropdowns["colour"]})
		.html(function(d){ return d.name});

	d3.select("#colorBy").on("change", function(d){
		let thisValue = this.value;
		setDropdown("colour", thisValue); 
	})

	//xAxis, yAxis and size dropdowns have the same options
	//and work the same way, so initialization is easy
	initiateDropdown(d3.select("#xSelect"), 
		selected_dropdowns["xAxis"],
		scales.returnScales(),
		"xAxis");

	initiateDropdown(d3.select("#ySelect"), 
		selected_dropdowns["yAxis"],
		scales.returnScales(),
		"yAxis");

	initiateDropdown(d3.select("#sizeBy"), 
		selected_dropdowns["size"],
		scales.returnScales(),
		"size");
}

function combineData(member_data, voting_data, spending_data){
	let newArray = [];
	for (var i = 0; i < member_data.length; i++){
		let member = 
		{	
			"id": member_data[i]["id"],
			"name": member_data[i]["name"],
			"party": member_data[i]["party"],
			"seniority": parseInt(member_data[i]["seniority"]),
			"gender": member_data[i]["gender"]
		};

		let total_keys = 0;
		let total_yes = 0;
		let total_no = 0;
		let d = voting_data[member["id"]];
		for (var j = 0; j < Object.keys(d).length; j++){
			total_yes += Object.values(d[Object.keys(d)[j]])
			 			.filter(function(e){ return e === "Yes"}).length;
			total_no += Object.values(d[Object.keys(d)[j]])
			 			.filter(function(e){ return e === "No"}).length;
			total_keys += Object.keys(d[Object.keys(d)[j]]).length;
		};

		member["total_votes"] = total_keys;
		member["percent_yes"] = total_yes/total_keys;
		member["percent_no"] = total_no/total_keys;

		let total_dem_support = 0;
		let total_dem_votes = 0;
		let total_rep_support = 0;
		let total_rep_votes = 0;
		for (var j = 0; j < Object.keys(d).length; j++){
			if (bill_info[Object.keys(d)[j]] && 
				bill_info[Object.keys(d)[j]]["sponsor_party"] === "R"){
				total_rep_support += Object.values(d[Object.keys(d)[j]]).filter(function(d){ return d === "Yes"}).length;
				total_rep_votes += Object.keys(d[Object.keys(d)[j]]).length;
			} else if (bill_info[Object.keys(d)[j]] && 
				bill_info[Object.keys(d)[j]]["sponsor_party"] === "D"){
				total_dem_support += Object.values(d[Object.keys(d)[j]]).filter(function(d){ return d === "Yes"}).length;
				total_dem_votes += Object.keys(d[Object.keys(d)[j]]).length;
			}
		}

		member["percent_support_rep"] = total_rep_support/total_rep_votes;
		member["percent_support_dem"] = total_dem_support/total_dem_votes;

		let median_spending = d3.median(spending_data[member["id"]], function (e){ return e.spending});
		member["median_travel_expenses"] = median_spending;
		newArray.push(member);
	}

	return newArray;
}

function setDropdown(prop, value){
	selected_dropdowns[prop] = value;
	member_object.setScales(selected_dropdowns);
}

function initiateDropdown(dd, selected, scale, value){
	let dropdown = 
		dd.selectAll("option")
			.data(Object.keys(scale), function(d){ return d; })
			.enter()
			.append("option")
			.property("selected", function(d){ return d === selected})
			.attr("value", function(d){ return d})
			.html(function(d){ return scale[d]["full_name"]});

	dd.on("change", function(d){
		let thisValue = this.value;
		setDropdown(value, thisValue);
	});

}



