var piotrDirectionsDisplay;
var karoDirectionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

var clerkenwell = new google.maps.LatLng(51.521985, -0.110212);
var piotrwork = new google.maps.LatLng(51.5248645, -0.0916461);
var karowork = new google.maps.LatLng(51.511881, -0.117111);

var karoline = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.7,
    strokeWeight: 6
};

function initialize() {
    piotrDirectionsDisplay = new google.maps.DirectionsRenderer(
        {preserveViewport: true});
    karoDirectionsDisplay = new google.maps.DirectionsRenderer(
        {polylineOptions: karoline,
         hideRouteList: true,
         preserveViewport: true});

    var mapOptions = {
        zoom:15,
        center: clerkenwell
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    piotrDirectionsDisplay.setMap(map);
    piotrDirectionsDisplay.setPanel(document.getElementById('piotr-directions-panel'));
    karoDirectionsDisplay.setMap(map);
    karoDirectionsDisplay.setPanel(document.getElementById('karo-directions-panel'));
}

var last_from_selected = true;
function recalculate(){
    if (last_from_selected){
        calcFromSelected();
    } else {
        calcFromInput();
    }
}

function calcFromSelected() {
    last_from_selected = true;
    var start = document.getElementById('start').value;
    calcRoute(start);
}

function calcFromInput() {
    last_from_selected = false;
    var flat_loc = document.getElementById('flat_loc').value;
    calcRoute(flat_loc);
}

function calcRoute(start) {

    var selectedmode = document.getElementById('mode').value;
    var travelmode = google.maps.TravelMode[selectedmode];

    var piotrrequest = {
        origin:start,
        destination:piotrwork,
        travelMode: travelmode
    };
    directionsService.route(piotrrequest, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            piotrDirectionsDisplay.setDirections(response);
            console.log("piotr:");
            var duration = response.routes[0].legs[0].duration.text;
            console.log(duration);
        }
    });

    var karorequest = {
        origin:start,
        destination:karowork,
        travelMode: travelmode
    };
    directionsService.route(karorequest, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            karoDirectionsDisplay.setDirections(response);
            console.log("karo:");
            var duration = response.routes[0].legs[0].duration.text;
            console.log(duration);
        }
    });
}

google.maps.event.addDomListener(window, 'load', initialize);


function searchKeyPress(e)
{
    // look for window.event in case event isn't passed in
    e = e || window.event;
    if (e.keyCode == 13){
        calcFromInput();
    }
}
