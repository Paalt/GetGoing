var localCache = require("localCache");
var Observable = require("FuseJS/Observable");

var baseUrl = "https://reisapi.ruter.no";

function ruter(resource, method){
	return fetch(baseUrl + "/" + resource,
		  {
			  method: method,
			  headers : {
				  'Content-Type': 'application/json'
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

var locationText = Observable("skiba");
var places = Observable();

function getPlaces(searchString, location){
	var loc = "";
	if (location) {
		loc = "?location=" + location;
	}
	let resource = "Place/GetPlaces/" + searchString + loc;
	//console.log("Resource: " + resource);
	return get(resource);
}

function searchForPlace(){
	getPlaces(locationText.value)
		.then(function(pl){
			/*pl.forEach(function(p){
				console.log("Name: " + p.Name);
			});*/
			places.replaceAll(pl);
		});
}

searchForPlace();

var home = Observable();
var work = Observable();

function setHome(arg){
	home.value = arg.data;
	var name = arg.data.Name;
	console.log("Saving home: " + name);
	localCache.saveConfig({ home: home.value, work: work.value });
}

function setWork(arg){
	work.value = arg.data;
	var name = arg.data.Name;
	console.log("Saving work: " + name);
	localCache.saveConfig({ home: home.value, work: work.value });
}

function loadConfig(){
	var c = localCache.loadConfig();
	console.log("C::: " + JSON.stringify(c));
	if (c === null) return;
	home.value = c.home;
	work.value = c.work;
	console.log("C: " + JSON.stringify(c));
};

loadConfig();

module.exports = {
	locationText: locationText,
	searchForPlace: searchForPlace,
	places: places.map(function(p){
		p.status = home.combineLatest(work, (function(home,work){
			if (home && home.Name === p.Name) { return "home"; }
			else if (work && work.Name === p.Name) { return "work"; }
			else {
				return "unknown";
			}
		}));
		return p;
	}),
	work: work,
	home: home,
	setHome: setHome,
	setWork: setWork
};
