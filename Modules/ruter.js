var baseUrl = "https://reisapi.ruter.no";

var stopsUrl = "https://data.smartbydata.no/api/action/datastore_search_sql";
var stopsSQL = function(id){
	return ('?sql=SELECT * from "7a04703d-d1fc-42bd-9a38-63249eaa5803" WHERE stop_id = ' + id + "&format=json");
};

function ruter(resource, method){
	return fetch(baseUrl + "/" + resource,
		  {
			  method: method,
			  headers : {
				  'Content-Type': 'txt/json'
			  }
		  })
		.then(function(result){
			console.log("Status: " + result.status);
			return result.json();
		}).then(function(json){
			//console.log("JSON: " + json);
			return json;
		});
}

function get(resource) {
	return ruter(resource, 'get');
}

function getHeartbeat(){
	console.log("Getting heartbeat");
	return get("Heartbeat/Index");
}

function fetchPlaces(searchString){
	let resource = "Place/GetPlaces/" + searchString;
	return get(resource);
}

function fetchStop(id){
	console.log("Fetching stop: " + id);
	var url = encodeURI(stopsUrl + stopsSQL(id));
	console.log("URL: " + url);
	return fetch(url)
		.then(function(response){ return response.text(); })
		.then(function(text){
			let t = text.replace(/sql.*WHERE.*,/g, "");
			console.log("Text: " + text);
			console.log("              ");
			console.log("T: " + t);
			return JSON.parse(text);
		});
}


function fetchTravelProposals(from, to){
	return get("Travel/GetTravels?fromPlace=" + from.ID + "&toPlace=" + to.ID + "&isafter=true");
}

module.exports = {
	fetchPlaces: fetchPlaces,
	fetchTravelProposals: fetchTravelProposals,
	fetchStop: fetchStop
};
