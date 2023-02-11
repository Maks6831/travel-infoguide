// Global variables
let searchArray = JSON.parse(window.localStorage.getItem("travelSearches")) ?? [];
console.log(searchArray)

$(document).ready(function () {
    if (searchArray.length > 0) {
        $("search-input").val(searchArray[0]);
        //TBC TODO do we need a general fucntion for display that includes all the functions?
        renderRecentSearches();
    }
});

function storeInput() {
    const searchInput = $("#search-input").val().trim();
    console.log(searchInput);
    if (searchInput === null || searchInput === "") {
        return
    };
    if (searchArray.indexOf(searchInput) !== 0) {
        searchArray.unshift(searchInput);
        localStorage.setItem("travelSearches", JSON.stringify(searchArray));
    };
    renderRecentSearches();
}

    function renderRecentSearches() {
    $("#search-history").empty();
    for (i = 0; i < 5; i++) {
        if (i >= searchArray.length)  { break; }
        let cityBtn = $("<button id='city-button'>").addClass('bg-primary btn my-1 text-white').text(searchArray[i]);
        $("#search-history").append(cityBtn);
    }   
}

// // Function to get and display the destination info
// const otmApiKey = '5ae2e3f221c38a28845f05b61b33349e006e82dfbec0fbaa34f9f984';
// let test = 'Berlin';


// function destinationInfo(searchinput) {
//     let lang = 'en'
//     let latlongApi = 'http://api.opentripmap.com/0.1/' + lang + '/places/geoname?name=' + searchinput + '&apikey=' + otmApiKey;

//     $.ajax({
//         url: latlongApi,
//         method: 'GET',
//     }).then(function (response) {
//         //console.log(response)
//         let lat = response.lat;
//         let lon = response.lon
//         let objectApi = 'https://api.opentripmap.com/0.1/en/places/radius?radius=10000&lon=' + lon + '&lat=' + lat + '&rate=3h&apikey=' + otmApiKey;
//         $.ajax({
//             url: objectApi,
//             method: 'GET'
//         }).then(function (response) {
//             //console.log('this is object list response:')
//             //console.log(response);

//         })
//     })
// }

// destinationInfo(test);

// // function destinationHotels(searchinput){
// function destinationHotels(searchinput) {
//     const settings = {
//         "async": true,
//         "crossDomain": true,
//         "url": "https://hotels-com-provider.p.rapidapi.com/v2/regions?locale=en_GB&query=" + searchinput + "&domain=AE",
//         "method": "GET",
//         "headers": {
//             "X-RapidAPI-Key": "74a15b002emshee3653482cfa191p103ec8jsn685748d41dba",
//             "X-RapidAPI-Host": "hotels-com-provider.p.rapidapi.com"
//         }
//     };

//     $.ajax(settings).done(function (response) {
//         console.log("hello im lookking for...")
//         //console.log(response);
//         let idNumber = response.data[0].gaiaId;
//         console.log(idNumber);
//         const settings = {
//             "async": true,
//             "crossDomain": true,
//             "url": "https://hotels-com-provider.p.rapidapi.com/v2/hotels/search?domain=AE&sort_order=REVIEW&locale=en_GB&checkout_date=2023-09-27&region_id=" + idNumber + "&adults_number=1&checkin_date=2023-09-26&available_filter=SHOW_AVAILABLE_ONLY&meal_plan=FREE_BREAKFAST&guest_rating_min=8&price_min=10&page_number=1&children_ages=4%2C0%2C15&amenities=WIFI%2CPARKING&price_max=500&lodging_type=HOTEL%2CHOSTEL%2CAPART_HOTEL&payment_type=PAY_LATER%2CFREE_CANCELLATION&star_rating_ids=3%2C4%2C5",
//             "method": "GET",
//             "headers": {
//                 "X-RapidAPI-Key": "74a15b002emshee3653482cfa191p103ec8jsn685748d41dba",
//                 "X-RapidAPI-Host": "hotels-com-provider.p.rapidapi.com"
//             }
//         };

//         $.ajax(settings).done(function (response) {
//             console.log('Hello this is the response im looking for');
//             console.log(response);
//             let object = response.properties;
//             for(let i = 0; i < 5; i++){
//             let name = $('<p style="margin: 3px;">').text(response.properties[i].name);
//             let source = response.properties[i].propertyImage.image.url;
//             let img = $('<img>').attr('src', source);
//             img.css("max-width", '15rem')


//             let score = $('<p style="margin: 3px;">').text('Score: ' + response.properties[i].reviews.score);
//             let star = $("<p>").text(JSON.parse(response.properties[i].star) + ' Stars');
//             let card = $('<div class="card col-lg-3 card-styling" style="max-width: 18rem;">')
//             let cardBody = $('<div class="card-body">')
//             cardBody.append(img, name, score, star);
//             card.append(cardBody);
//             $('#hotel-info').append(card);

//             }

//         });
//     });
// }

// destinationHotels(test);

// Function to get and display the news query 
function newsInfo() {
    const newsQueryURL = "https://content.guardianapis.com/search?page=2&q=berlin&api-key=7bdfba43-4614-4c0d-b1ee-bc1a140b8136";
    //console.log(newsQueryURL);

    $.ajax({
        url: newsQueryURL,
        method: 'GET',
    }).then(displayNews)
}


function displayNews(response) {
    console.log(response)
    response = response.response
   

    for (let i = 0; i < 5; i++) {
        let result = response.results[i];

        let newsCard = $("<div>").addClass("news-cards");
        $("#news-info").append(newsCard)

        let articleTitle = $("<h6>").text(result.webTitle);
        let articleButton = $("<button id='news-url-btn'>").addClass('btn-primary text-white').text("Read");

        $("#news-url-btn").on('click', (event) => window.location.href = result.webUrl);

        newsCard.append(articleTitle, articleButton);
    }
}
newsInfo();


// // Function to get and display a picture in the result header
// let resultsHeader = $("#resultsHeader");

// function renderResultsHeader(city) {

//     let url="https://api.unsplash.com/search/photos?query="+ city + " landmark tourism" + "&client_id=lLSAxvpFjby7KiDmDgbl3Wk9IpyV5xru0EHXxgXo9uY&per_page=60"

//     $.ajax({
//         method: 'GET',
//         url: url,
//         success:function(data){
//             console.log(data);
//             let imgURL = data.results[0].urls.full;
//             console.log(imgURL);

        

//         const htmlpage = $("<html>")
//          const headerTitle = $("<h1>").text(city).addClass("resultsTitle");
//          //htmlpage.css("background-image", "url(" + imgUrl + ")  " );

//        // no-repeat center center fixed; --webkit-background-size: cover;
//          resultsHeader.append(headerTitle);
       
//          resultsHeader.css("background-image", "url(" + imgURL + ")");

//         }
//     })
// }


/*
 search button event listener function(){
    we call the all the functions in the button event listener...

    destinationInfo(searchinput) -----> function for acquiring destination info
    destinationHotels(searchinput) ---------> function for acquiring hotels
    destinatNews(searchinput) --------------> function for acquiring news

}
*/

$("#search").click(function (event) { 
    event.preventDefault();
    const searchinput = $("#search-input").val().trim();
    // destinationInfo(searchinput);
    // destinationHotels(searchinput);
    // NewsInfo(searchinput);
    storeInput()
    console.log(searchinput);
});
