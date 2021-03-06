function mapLocation(origin_lat, origin_lng, dest_lat, dest_lng) {
    var origin = new google.maps.LatLng(origin_lat, origin_lng);
    var destination = new google.maps.LatLng(dest_lat, dest_lng);
    var departureTime;
    var arrivalTime;
    var journey_date_element = document.getElementById("date_input");
    var journey_time_element = document.getElementById("journey_time");

    if (selected_datetime_option === 'now'){
        departureTime = new Date();
    }
    else if (selected_datetime_option === 'departureTime') {
        departureTime = new Date(Date.parse(journey_date_element.value + " " + journey_time_element.value));
    }
    else if (selected_datetime_option === 'arrivalTime') {
        arrivalTime = new Date(Date.parse(journey_date_element.value + " " + journey_time_element.value));
    }

    if(directionsRenderer){
        directionsRenderer.setMap(null);
    }

    var directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();

    directionsRenderer.setMap(map);

    calculateAndDisplayRoute(directionsService, directionsRenderer,origin, destination, arrivalTime, departureTime);
}


function calculateAndDisplayRoute(directionsService, directionsRenderer, origin, destination, arrivalTime, departureTime) {
    directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: 'TRANSIT',
        provideRouteAlternatives: true,
        transitOptions: {
            arrivalTime: arrivalTime,
            departureTime: departureTime,
            modes: ['BUS'],
            routingPreference: 'FEWER_TRANSFERS'
        },
        unitSystem: google.maps.UnitSystem.IMPERIAL
    }, function (response, status) {
        if (status === 'OK') {
            showing_journey_results = true;
            generate_directions_views();

            directionsRenderer.setDirections(response);

            let route_options_table = document.getElementById('route_options_container');
            route_options_table.innerHTML = "";

            var model_journeys = [];
            rendered_route_list = [];
            let rendered_route_index_list = [];

            for (i = 0; i < response.routes.length; i++) {
                let journey = {};
                let include = false;
                let steps_counter = 0;
                let steps_len = response.routes[i].legs[0].steps.length;

                let journey_icons_string = "";
                let first_bus_step_duetime = "";

                for (let step of response.routes[i].legs[0].steps) {
                    if(step.travel_mode === "WALKING"){
                        journey_icons_string += '<i class="material-icons" style="font-size:20px;color:black">directions_walk</i>';
                    }
                    else if(step.travel_mode === "TRANSIT"){
                        if(step.transit.line.vehicle.type !== "BUS"){
                            include = false;
                            break;
                        }

                        include = true;

                        if(first_bus_step_duetime === ""){
                            first_bus_step_duetime = step.transit.departure_time.value;
                        }

                        let current_route;

                        if(step.transit.line.short_name){
                             current_route = step.transit.line.short_name;
                        }
                        else{
                            current_route = step.transit.line.name;
                        }

                        let route_dict = {
                            "Origin_Lat": step.transit.departure_stop.location.lat(),
                            "Origin_Lon": step.transit.departure_stop.location.lng(),
                            "Dest_Lat": step.transit.arrival_stop.location.lat(),
                            "Dest_Lon": step.transit.arrival_stop.location.lng(),
                            "Origin": step.transit.arrival_stop.name,
                            "Destination": step.transit.headsign,
                            "Departure_Datetime": new Date(step.transit.departure_time.value)
                        };

                        journey[current_route] = route_dict;
                        journey_icons_string += '<i class="material-icons" style="font-size:20px;color:black">directions_bus</i>';
                        journey_icons_string += `<span class="bus_icon_route_num">${current_route}</span>`;
                    }

                    if (steps_counter < steps_len - 1){
                        journey_icons_string += '<i class="material-icons" style="font-size:20px;color:black">navigate_next</i>';
                    }

                    steps_counter += 1;
                }

                if(include === true){
                    let bus_duetime_text;
                    bus_duetime = Math.ceil((Date.parse(first_bus_step_duetime) - Date.parse(new Date())) / 60000);

                    if(selected_datetime_option === 'now' && bus_duetime <= 60){

                        if(bus_duetime < 1){
                            bus_duetime_text = "now";
                        }
                        else{
                            bus_duetime_text = "in " + bus_duetime + " minutes";
                        }
                    }
                    else{
                        let minutes = first_bus_step_duetime.getMinutes();

                        if(minutes < 10){
                            minutes = "0" + minutes;
                        }

                        bus_duetime_text = "at ~" + first_bus_step_duetime.getHours() + ":" + minutes + " on " + first_bus_step_duetime.toDateString();
                    }

                    route_options_table.innerHTML += `
                    <div class="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mdl-cell--4-col-phone">
                        <div class="demo-card-wide mdl-card mdl-shadow--2dp">
                            <div class="mdl-card__title">
                                <h2 id="journey_time_${i}" class="mdl-card__title-text journey_time_text"></h2>
                            </div>
                        
                            <div class="mdl-card__supporting-text">
                                ${journey_icons_string}
                            </div>
                            
                            <div class="mdl-card__supporting-text">
                                <span>Leaves </span>
                                <span style="color: #66BB6A">${bus_duetime_text}</span>
                            </div>
                            
                            <div class="mdl-card__actions mdl-card--border">
                                <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" id="${i}" onclick="render_route_at_index(${i})">
                                    Show Journey
                                </a>
                            </div>
                        </div>
                    </div>`;

                    componentHandler.upgradeAllRegistered();
                    model_journeys.push(journey);
                    rendered_route_list.push(response.routes[i]);
                    rendered_route_index_list.push(i);
                }
                directionsRenderer.setRouteIndex(parseInt(rendered_route_list[0]));
            }

            if(rendered_route_index_list.length > 0){
                Ajax_Model(JSON.stringify(model_journeys), rendered_route_index_list);
            }
            else{
                // No bus journey to display
            }

            document.getElementById("clear_route").style.display = "initial";
            return true;
        }
        else {
            window.alert('Could not get directions for this journey');
            return false;
        }
    });
}


function render_route_at_index(index){
    directionsRenderer.setRouteIndex(parseInt(index));
}
