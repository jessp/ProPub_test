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

let mySearcher = new searcher();
let scales;
let member_object;

window.onload = function(e){
	scales = new scale_maker(
		member_data["results"],
		voting_data,
		spending_data);

	member_object = 
		new member(member_data["results"],
		voting_data, 
		d3.select(".svgHolder").select("svg"));

}



