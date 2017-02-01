var moment = require("moment");
var Observable = require("FuseJS/Observable");
var context = require("Modules/context");

var locationText = Observable("skiba");

var updatePlaces = Observable(1);
var updateProposals = Observable(1);
var places = updatePlaces.map(function(x){ return context.getPlaces(locationText.value); }).inner();
var proposals = updateProposals.map(function(x){ return context.getTravelProposals(); }).inner();

var nextPlan = Observable();

var travelTypes = [
	"Walking",
	"AirportBus",
	"Bus",
	"Dummy",
	"AirportTrain",
	"Boat",
	"Train",
	"Tram",
	"Metro"
];

function search(){
	updatePlaces.value += 1;
}

function getTravelProposals(){
	updateProposals.value += 1;
}

var markers = Observable();

function selectStop(arg){
	markers.clear();

	var data = arg.data;
	if (data.DepartureStop) {
		console.log("ID: " + data.DepartureStop.ID);
		context.getStop(data.DepartureStop.ID)
			.then(function(stops){
				stops.forEach(function(stop){
					markers.add({ lat: stop.Latitude, long: stop.Longitude });
				});
			});
	}
	if (data.ArrivalStop) {
		console.log("ID: " + data.DepartureStop.ID);
		context.getStop(data.ArrivalStop.ID)
			.then(function(stops){
				stops.forEach(function(stop){
					markers.add({ lat: stop.Latitude, long: stop.Longitude });
				});
			});
	}
	console.log("Markers: " + markers.toString());
}

module.exports = {
	selectStop: selectStop,
	markers: markers,
	search: search,
	getTravelProposals: getTravelProposals,
	locationText: locationText,
	places: places,
	proposals: proposals.map(function(x){
		
		x.travelTime = "" + x.TotalTravelTime;
		x.Stages.forEach(function(s){
			if (s.DepartureTime) {
				s.departsIn = moment(s.DepartureTime).fromNow();
			}
			if (s.ArrivalTime) {
				s.arrivesIn = moment(s.ArrivalTime).fromNow();
			}
			if (s.DepartureStop) {
				s.hasDepartName = true;
				s.departName = s.DepartureStop.Name;
			}
			if (s.ArrivalStop) {
				s.hasArriveName = true;
				s.arriveName = s.ArrivalStop.Name;
			}
			if (s.LineName) {
				s.line = s.LineName;
			}
			if (s.Transportation === 0) {
				s.isWalking = true;
				s.walkingTime = moment(s.ArrivalTime).diff(s.DepartureTime, 'minutes');
			}
			
			s.travelType = travelTypes[s.Transportation];
		});
		return x;
	}),
	nextPlan: nextPlan,
	home: context.home,
	work: context.work,
	setWork: context.setWork,
	setHome: context.setHome
};
