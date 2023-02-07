
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

/*
function destinationInfo(searchinput){
    ajax call to travel advisor
    append on to page
}

function destinationHotels(searchinput){
    ajax call to hotel api (maybe we can use travel advisor for this)
    append on to page
}

function destinatNews(searchinput){
    ajax call to news api 
    append on to page. 
}






 search button event listener function(){

    destinationInfo(searchinput) -----> function for acquiring destination info
    destinationHotels(searchinput) ---------> function for acquiring hotels
    destinatNews(searchinput) --------------> function for acquiring news

}


also i think we need to create a function which stores the search history. 
*/
})