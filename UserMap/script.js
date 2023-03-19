

//const destination = {lat: 35.61362, lng: -82.56101};
var vehicleLocations = [
  [1, 'ponder',35.615160, -82.568470, false],
  [2, 'health and wellness',35.61362, -82.56101, false],
  [3, 'unca parking lot',35.61808, -82.56339, false],
  [4, 'unca quad',35.61597, -82.56631, false],
  [5, 'unca track',35.61650, -82.56874, false],
  [6, 'west ridge residence hall',35.61417, -82.56927, false]
];

var currentLocation;


//called to find the distance bewteen 2 points on the map
function cartDistance(user, cart) {
  console.log(user);
  var userLat = user.lat;
  var userLng = user.lng;
  var cartLat = cart.lat;
  var cartLng = cart.lng;
  var R = 3958.8; // Radius of the Earth in miles
  var rlat1 =  userLat* (Math.PI/180); // Convert degrees to radians
  var rlat2 = cartLat * (Math.PI/180); // Convert degrees to radians
  var difflat = rlat2-rlat1; // Radian difference (latitudes)
  var difflon = (cartLng-userLng) * (Math.PI/180); // Radian difference (longitudes)

  var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
  console.log("return  data: ",d);
  return d;
}

const getNearestCart = () =>{
  var start = currentLocation;
  var curr;
  var length = 0;
  //iderate through the vehicles
  for(let i = 0; i < vehicleLocations.length; i++){
    if(vehicleLocations[i][4] === false){
      var lattitude = vehicleLocations[i][2];
      var longitude = vehicleLocations[i][3];
      var end = {
        lat: lattitude, 
        lng: longitude
      };
      var distance = 0;
      distance = cartDistance(start, end);
      /*
      var currRoute = directionsService.route({
        origin: start,
        destination: end,
        travelMode: 'WALKING'
      });
      var distance = 0;
      currRoute.then(function(result){
        console.log(`distance cart${i+1}`,result.routes[0].legs[0].distance.text);
        distance = result.routes[0].legs[0].distance.text;
      });
      //set length to value of disstance of curr route if it is less than length
      */
     
      if(distance < length || i === 0){
        length = distance; 
        curr = end;
      }

    }

  }
  console.log(curr);
  return curr ;
}

function getDestination(map, start, end){
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const directionsService = new google.maps.DirectionsService();
  directionsService.route({
    origin: start,
    destination: end,
    travelMode: 'WALKING'
  })
  .then((response) => {
    directionsRenderer.setDirections(response);
  })
  .catch((e)=> window.alert("Direction request failed"+status));
  directionsRenderer.setMap(map);

}



const searchBar = (campus, map, autocomplete, infowindow) =>{
  var place;
  const marker = new google.maps.Marker();
  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    place = autocomplete.getPlace();
    if (!place.geometry) {
        window.alert("Autocomplete's returned place contains no geometry");
        return;
    }

    // If the place has a geometry, then present it on a map.
    
    marker.setIcon(({
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
    }));
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
//displays address for the new point,
    var address = '';
    if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
    }

    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
    infowindow.open(map, marker);
    
    const destination = {lat: place.geometry.location.lat(), lng:  place.geometry.location.lng()};
    var cart = getNearestCart();
    getDestination(map, currentLocation, cart);
    getDestination(map, cart, destination);
  });
  
 
  
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

const getCurrLocation = async()=>{
  var position;
  if (navigator.geolocation) {
    setInterval(navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        currentLocation = pos;
        console.log("data of my locations",pos);
      }
      
    ),1000);
    console.log("test test 1", position);
   
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
  console.log("test test 2", position);
  return position;

}

getCurrLocation();
//setInterval(getCurrLocation(), 1000);

function createCartButton(map){
  const cartButton = document.createElement("button");
  cartButton.style.backgroundColor = "#fff";
  cartButton.style.border = "2px solid #fff";
  cartButton.style.borderRadius = "3px";
  cartButton.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  cartButton.style.color = "rgb(25,25,25)";
  cartButton.style.cursor = "pointer";
  cartButton.style.fontFamily = "Roboto,Arial,sans-serif";
  cartButton.style.fontSize = "16px";
  cartButton.style.lineHeight = "38px";
  cartButton.style.margin = "8px 0 22px 500px";
  cartButton.style.padding = "0 20px";
  cartButton.style.textAlign = "center";
  cartButton.textContent = "Find cart ";
  cartButton.title = "Click to find Nearest Cart";
  cartButton.type = "button";

  cartButton.addEventListener("click", () =>{
    var cart = getNearestCart();
    getDestination(map, currentLocation, cart);
  });

  return cartButton;
}

function createResetButton(map){
  const button = document.createElement("button");
  button.style.backgroundColor = "#fff";
  button.style.border = "2px solid #fff";
  button.style.borderRadius = "3px";
  button.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  button.style.color = "rgb(25,25,25)";
  button.style.cursor = "pointer";
  button.style.fontFamily = "Roboto,Arial,sans-serif";
  button.style.fontSize = "16px";
  button.style.lineHeight = "38px";
  button.style.margin = "8px 0 22px 500px";
  button.style.padding = "0 20px";
  button.style.textAlign = "center";
  button.textContent = "Reset Map";
  button.title = "Click to find Nearest Cart";
  button.type = "button";

  cartButton.addEventListener("click", () =>{

  });

  return button;
}

function initMap (){
  const unca = {lat: 35.6144 , lng: -82.5666};
 
  const map = new google.maps.Map(document.getElementById("map"),{
      zoom: 16,
      center: unca
  });

 //auto complease data
  var input = document.getElementById('searchInput');
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);
  var infowindow = new google.maps.InfoWindow();
  searchBar(unca, map, autocomplete, infowindow);

//cals function that creates a button that makes route to nearest cart
  const cartButtonDiv = document.createElement("div");
  cartButtonDiv.appendChild(createCartButton(map));
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(cartButtonDiv);

//cals function that creates a button that makes route to nearest cart
  const resetButtonDiv = document.createElement("div");
  resetButtonDiv.appendChild(createResetButton(map));
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(resetButtonDiv);


  const marker = new google.maps.Marker({
    position: currentLocation,
    map: map
  });
 
  
  // Try HTML5 geolocation.
  

  //get route mapped to searched location
  
}