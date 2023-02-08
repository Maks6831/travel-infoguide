
$(function(){

    const otmApiKey = '5ae2e3f221c38a28845f05b61b33349e006e82dfbec0fbaa34f9f984';
    let test = 'london';


function destinationInfo(searchinput){
    let lang = 'en'
    let latlongApi = 'http://api.opentripmap.com/0.1/' + lang + '/places/geoname?name=' + searchinput + '&apikey=' + otmApiKey;

    $.ajax({
        url: latlongApi,
        method: 'GET',
    }).then(function(response){
        console.log(response)
        let lat = response.lat;
        let lon = response.lon
        let objectApi = 'https://api.opentripmap.com/0.1/en/places/radius?radius=10000&lon='+ lon +'&lat=' + lat + '&rate=3h&apikey=' + otmApiKey;
        $.ajax({
            url: objectApi,
            method: 'GET'
        }).then(function(response){
            console.log('this is object list response:')
            console.log(response);
        })
    })
}

destinationInfo(test);
/*
function destinationHotels(searchinput){
    ajax call to hotel api (maybe we can use travel advisor for this)
    append on to page
}

function destinatNews(searchinput){
    ajax call to news api 
    append on to page. 
}






 search button event listener function(){
    we call the all the functions in the button event listener...

    destinationInfo(searchinput) -----> function for acquiring destination info
    destinationHotels(searchinput) ---------> function for acquiring hotels
    destinatNews(searchinput) --------------> function for acquiring news

}


also i think we need to create a function which stores the search history. 
*/
})