//Array that holds the current infoWindow
var currentInfoWindow = [];
var markerList = [];

//function that initialize the map
function initializeMap() {

  //map options
  var options = {
    center: {lat:37.7749295 , lng:-122.419415500000010000 },
    zoom: 13,
    disableDefaultUI: false,
    scrollwheel: true,
    draggable: true,
    minZoom:11,
    zoomControl: true,
    mapTypeControl: false,
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
function createMarker(mapReference, latitude, longitude, icon_url){

  var marker = new google.maps.Marker({
    position: { lat: latitude, lng: longitude },
    map: mapReference,
    icon:icon_url,
    title: 'Click here to see info about the graffiti in this location'
  });

return marker;


}


//Function that creates an info Window using the infobox.js constructor
function createInfoWindow(options){

  var infoWindow = new InfoBox(options);
  return infoWindow;
}


// Create an info window and attach it to a  marker on the map.
function showInfoWindow(map, graffiti, marker){

  var type = graffiti.type || "Graffiti";
  var address = graffiti.address;
  var picture = (!graffiti.media_url) ? "NA" : "<a href="+graffiti.media_url.url+
  " target='_blank' title='Click to open the picture of the graffiti' >Link to picture</a>";
  var status = graffiti.status;
  var content = "<strong>"+type+"</strong><br><br>"+"<strong>Address: </strong>"+address+"<br><strong>Status: </strong>"+
  status+"<br><strong>Picture: </strong>"+ picture;
   var infoboxOptions = {
      content: content
      ,disableAutoPan: false
      ,maxWidth: 0
      ,pixelOffset: new google.maps.Size(-10, 0)
      ,zIndex: null
      ,boxClass: "myInfobox"
      ,closeBoxMargin: "2px"
      ,closeBoxURL: "close_icon.png"
      ,infoBoxClearance: new google.maps.Size(1, 1)
      ,visible: true
      ,pane: "floatPane"
      ,enableEventPropagation: false

};
   var infoWindow = createInfoWindow(infoboxOptions);
   infoWindow.open(map, marker);//open the infoWindow
   //add the freshly created info window to the currentInfoWindow table in order to be able to close it later.
   currentInfoWindow[0]= infoWindow;
}


//create the StreetView Panorama
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

  $.ajax({

                url: "http://data.sfgov.org/resource/p6sg-7yp7.json",
                type: "GET",
                dataType: "json",

                success: function(data){
                  console.log('SUCCESS');

                  $.each(data, function(index, graffiti){

                      var latitude = Number(graffiti.position.latitude);
                      var longitude = Number(graffiti.position.longitude);
                      var marker = createMarker(mapObject, latitude, longitude, 'museum_art_2.png');

                      markerList.push(marker);
                     //This line makes sure that the infowindows get shown on their respective markers when clicked.
                      mapObject.setCenter(marker.getPosition());
                      google.maps.event.addListener(marker,'click', function(e){

                        //close the info window that is currently open.
                        closeInfoWindows();

                        showInfoWindow(mapObject, graffiti, marker);
                        createPanorama(latitude, longitude, mapObject);

                      });


                  });

                },

                error: function() {
                  return console.log("Failed");

                }



    });

//When the Ajax call is complete
$(document).ajaxComplete(function(){
   //for testing purposes
   console.log(markerList.length);

  //add marker cluster
  markerClusterer = new MarkerClusterer(mapObject, markerList);

//Create artificial click event
var e = $.Event('click');
$(markerList[0]).trigger(e);
});








});




