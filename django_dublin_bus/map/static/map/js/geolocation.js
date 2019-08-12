console.log("geolocation.js Loaded!");

// centering the the initial map position on dublin
window.lat = 53.3498;
window.lng = -6.2603;



function getUserLocation(){
    // console.log("Called getUserLocation function!");
    // Test to see if the browser has HTML5 geolocation
    function getLocation() {
        // console.log("Called getLocation function!");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(updatePosition);
        }
        return null;
    }

    // Updates the map position values to users location
    function updatePosition(position) {
        if (position) {
            pos={
                lat:position.coords.latitude,
                lng:position.coords.longitude
            };
            window.lat = position.coords.latitude;
            window.lng = position.coords.longitude;
            geo_for_emptystring.length = 0;
            geo_for_emptystring.push(position.coords.longitude);
            geo_for_emptystring.push(position.coords.latitude);
            getnearby(pos);
        }
    }

    // interval in ms
    setInterval(function () {
        // console.log("Called setInterval function!");
        updatePosition(getLocation());

    }, 10000);
}

function currentLocation() {
    return {lat: window.lat, lng: window.lng};
}

function initialiseUserLocation(){
    console.log("Called initialiseUserLocation function!");
    window.initialize = initialize;
    var first_load = true;
    var redraw = function (payload) {
        lat = payload.message.lat;
        lng = payload.message.lng;

        user_location_marker.setPosition({lat: lat, lng: lng, alt: 0});
        if (first_load) {
            map.setCenter({lat: lat, lng: lng, alt: 0});
            map.setZoom(16);
            first_load = false;
        }
    };
}