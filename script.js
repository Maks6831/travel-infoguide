
$(function(){
console.log("Travel Advisor Api... ");
const settings = {
     "async": true,
     "crossDomain": true,
     "url": "https://travel-advisor.p.rapidapi.com/locations/v2/auto-complete?query=eiffel%20tower&lang=en_US&units=km",
     "method": "GET",
     "headers": {
         "X-RapidAPI-Key": "d5d189dccbmsh2ab4d6cb457627ap192a53jsn3fd7cd6caa99",
         "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com"
     }
};
    
$.ajax(settings).then(function (response) {
    console.log(response);
});







})