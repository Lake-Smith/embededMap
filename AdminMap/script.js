

//const destination = {lat: 35.61362, lng: -82.56101};
var vehicleLocations = [
  [1, 'ponder',35.615160, -82.568470, false],
  [2, 'health and wellness',35.61362, -82.56101, false],
  [3, 'unca parking lot',35.61808, -82.56339, false],
  [4, 'unca quad',35.61597, -82.56631, false],
  [5, 'unca track',35.61650, -82.56874, false],
  [6, 'west ridge residence hall',35.61417, -82.56927, false]
];


function searchTime(){
  //takes in data from the 4 text boxes and creates a search term apon being clicked
  console.log("clicked");
}



function initMap (){
  const unca = {lat: 35.6144 , lng: -82.5666};
 
  const map = new google.maps.Map(document.getElementById("map"),{
      zoom: 16,
      center: unca
  });
  
  for (let i = 0; i < vehicleLocations.length; i++){
      var cartLocation =  {lat: vehicleLocations[i][2], lng:  vehicleLocations[i][3]};
      const marker = new google.maps.Marker({
        position:cartLocation,
        map: map
    });
  }
}