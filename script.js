//Array of graffitis
var graffitiList = [];
var markerList = [];
var currentInfoWindow = [];


//function that initialize the map
function initializeMap() {

  //map options
  var options = {
    center: {lat:37.7749295 , lng:-122.419415500000010000 },
    zoom: 13,
    disableDefaultUI: false,
    scrollwheel: true,
    draggable: true,
    maxZoom: 30,
    minZoom:9,
    zoomControl: true,
    panControl: true,
    streetViewControl: false,

    zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_BOTTOM,
      style: google.maps.ZoomControlStyle.SMALL
    },

    panControlOptions: {
      position: google.maps.ControlPosition.LEFT_BOTTOM
    },

  };
  //HTML element that will hold the map.
  var mapElement = $('#map-canvas')[0];
  //create map object
  var map = new google.maps.Map(mapElement, options);

  return map;

}

//function to close the previous info windows whenever the user clicks on
//a new marker
function closeInfoWindows(){

  if (currentInfoWindow.length > 0){
    //detach the info window from it's current marker
    currentInfoWindow[0].set("marker", null);
    //close it
    currentInfoWindow[0].close();
    //blank the array
    currentInfoWindow.length = 0;
  }

}

//Creat marker and add it to the map
//lat: 37.791350, lng: -122.4312883
function createMarker(mapReference, latitude, longitude, icon_url){

  var marker = new google.maps.Marker({
    position: { lat: latitude, lng: longitude },
    map: mapReference,
    icon:icon_url,
    title: 'Click here to see info about the graffiti in this location'
  });

return marker;


}

function createInfoWindow(windowContent){

  var infoWindow = new google.maps.InfoWindow({
    content: windowContent
  });
  return infoWindow;
}


//create a marker and show it
function showInfoWindow(map, graffiti, marker){
   var infoWindow = createInfoWindow(graffiti.type);
   infoWindow.open(map, marker);//open the infoWindow
}



function createPanorama(lat, long, map){

  var panoElement = $('#pic-panorama')[0];

  var panoramaOptions = {
    position: { lat: lat, lng: long }
  };
  var panorama = new google.maps.StreetViewPanorama(panoElement, panoramaOptions);
  map.setStreetView(panorama);
}


$(document).ready(function(){


var mapObject = initializeMap();

//Call the graffiti dataset API. Create a marker for each open graffiti, put it on the map and also
//put it in the list of markers. Then put the graffiti in the graffiti list
  $.ajax({

                url: "http://data.sfgov.org/resource/p6sg-7yp7.json",
                type: "GET",
                dataType: "json",

                success: function(data){
                  console.log('SUCCESS');

                  $.each(data, function(index, graffiti){
                    if (graffiti.status=="Open"){
                      marker = createMarker(mapObject, Number(graffiti.position.latitude),Number(graffiti.position.longitude), 'museum_art_2.png');
                      google.maps.event.addListener(marker,'click', function(e){

                        showInfoWindow(mapObject, graffiti, marker);
                        createPanorama(Number(graffiti.position.latitude), Number(graffiti.position.longitude), mapObject);

                      });
                      markerList.push(marker);
                      graffitiList.push(graffiti);
                    }
                  });

                },

                error: function() {
                  return console.log("Failed");

                }



    });

//When the Ajax call is complete
$(document).ajaxComplete(function(){
   console.log(graffitiList.length);
   console.log(markerList.length);

  //add marker cluster
  markerClusterer = new MarkerClusterer(mapObject, markerList);

//Create artificial click event
var e = $.Event('click');
$(markerList[0]).trigger(e);
});








});




