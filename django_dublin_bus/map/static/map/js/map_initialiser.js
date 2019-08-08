console.log("map_initialiser.js Loaded!");
var user_marker_image = ""; // Not doing anything yet but to be used for customer user location marker
var bus_marker_image = ""; // Not doing anything yet but to be used for busstop location marker


var map; // for initialising the maps map object
var geocoder; // for initialising the maps geocoder object
var user_location_marker;
var markers = []; // storing the markers as we create them
var origin_searchbox;
var destination_searchbox;
var directionsRenderer;

var rendered_route_list = [];

var sunrise;
var sunset;

$.ajax({
    url: get_sun_url,
    type: 'POST',
    success:function (data){
        loadData(data);
    }
});


function loadData(data) {
        sunrise = data.sunrise;
        sunset = data.sunset;
        console.log("Sunrise: "+ sunrise);
        console.log("Sunset: "+ sunset);
}


var initialize = function () {
    console.log("Called initialise map function!");
    getUserLocation();

    set_night_mode();

    // look at changing where this is positioned in script to resolve marker jumping from O'connell street
    user_location_marker = new google.maps.Marker({position: {lat: lat, lng: lng}, map: map});

    loopBusStops();

    var markerCluster = new MarkerClusterer(map, markers,
        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});


    initialiseUserLocation();

    geocoder = new google.maps.Geocoder();

    generateRouteSearch();

};
