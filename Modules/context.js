var Observable = require("FuseJS/Observable");
var localCache = require("localCache");
var ruter = require("Modules/ruter");

var home = Observable(null);
var work = Observable(null);


function setHome(arg){
	home.value = arg.data;
	localCache.saveConfig({ home: home.value, work: work.value });
}

function setWork(arg){
	work.value = arg.data;
	localCache.saveConfig({ home: home.value, work: work.value });
}

function loadConfig(){
	var c = localCache.loadConfig();
	console.log("CC:: " + c);
	if (c === null) return;
	home.value = c.home;
	work.value = c.work;
};

loadConfig();

function getPlaces(searchText) {
	var ret = Observable();
	ruter.fetchPlaces(searchText)
		.then(function(places){
			ret.replaceAll(places);
		});
	return ret;
}

function getTravelProposals() {
	var ret = Observable();
	if (home.value !== null && work.value !== null) {
		ruter.fetchTravelProposals(home.value, work.value)
			.then(function(proposals){
				//console.log(JSON.stringify(proposals));
				ret.replaceAll(proposals.TravelProposals);
			}).catch(function(err){
				console.log("Err " + err);
			});
	}
	return ret;
}

function getStop(id){
	return ruter.fetchStop(id)
		.then(function(stop){
			return stop.result.records;
		}).catch(function(err){
			console.log("err: " + err);
		}); 
}

module.exports = {
	getTravelProposals: getTravelProposals,
	getPlaces: getPlaces,
	getStop: getStop,
	setHome: setHome,
	setWork: setWork,
	home: home,
	work: work
};
