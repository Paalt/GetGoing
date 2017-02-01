var moment = require("moment");
var Observable = require("FuseJS/Observable");
var context = require("Modules/context");

var locationText = Observable("skiba");

var updatePlaces = Observable(1);
var places = updatePlaces.map(function(x){ return context.getPlaces(locationText.value); }).inner();


function search(){
	updatePlaces.value += 1;
}



module.exports = {
	search: search,
	locationText: locationText,
	places: places,
	
	home: context.home,
	work: context.work,
	setWork: context.setWork,
	setHome: context.setHome
};
