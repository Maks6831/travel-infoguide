





/* const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://hotels4.p.rapidapi.com/locations/v3/search?q=new%20york&locale=en_US&langid=1033&siteid=300000001",
        "method": "GET",
        "headers": {
            "X-RapidAPI-Key": "d5d189dccbmsh2ab4d6cb457627ap192a53jsn3fd7cd6caa99",
            "X-RapidAPI-Host": "hotels4.p.rapidapi.com"
        }
    };
    
    $.ajax(settings).done(function (response) {
        console.log(response);
    });*/

const otmApiKey = '5ae2e3f221c38a28845f05b61b33349e006e82dfbec0fbaa34f9f984';
let test = 'Berlin';


function destinationInfo(searchinput) {
    let lang = 'en'
    let latlongApi = 'http://api.opentripmap.com/0.1/' + lang + '/places/geoname?name=' + searchinput + '&apikey=' + otmApiKey;

    $.ajax({
        url: latlongApi,
        method: 'GET',
    }).then(function (response) {
        //console.log(response)
        let lat = response.lat;
        let lon = response.lon
        let objectApi = 'https://api.opentripmap.com/0.1/en/places/radius?radius=10000&lon=' + lon + '&lat=' + lat + '&rate=3h&apikey=' + otmApiKey;
        $.ajax({
            url: objectApi,
            method: 'GET'
        }).then(function (response) {
            //console.log('this is object list response:')
            //console.log(response);

        })
    })
}

destinationInfo(test);

/*
function destinationHotels(searchinput){
    ajax call to hotel api (maybe we can use travel advisor for this)
    append on to page
}
*/


function destinationHotels(searchinput) {
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://hotels-com-provider.p.rapidapi.com/v2/regions?locale=en_GB&query=" + searchinput + "&domain=AE",
        "method": "GET",
        "headers": {
            "X-RapidAPI-Key": "d5d189dccbmsh2ab4d6cb457627ap192a53jsn3fd7cd6caa99",
            "X-RapidAPI-Host": "hotels-com-provider.p.rapidapi.com"
        }
    };

    $.ajax(settings).done(function (response) {
        console.log("hello im lookking for...")
        //console.log(response);
        let idNumber = response.data[0].gaiaId;
        console.log(idNumber);
        const settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://hotels-com-provider.p.rapidapi.com/v2/hotels/search?domain=AE&sort_order=REVIEW&locale=en_GB&checkout_date=2023-09-27&region_id=" + idNumber + "&adults_number=1&checkin_date=2023-09-26&available_filter=SHOW_AVAILABLE_ONLY&meal_plan=FREE_BREAKFAST&guest_rating_min=8&price_min=10&page_number=1&children_ages=4%2C0%2C15&amenities=WIFI%2CPARKING&price_max=500&lodging_type=HOTEL%2CHOSTEL%2CAPART_HOTEL&payment_type=PAY_LATER%2CFREE_CANCELLATION&star_rating_ids=3%2C4%2C5",
            "method": "GET",
            "headers": {
                "X-RapidAPI-Key": "367120e2b5msh04f869f7abd582ep132881jsn80a5f6064c53",
                "X-RapidAPI-Host": "hotels-com-provider.p.rapidapi.com"
            }
        };

        $.ajax(settings).done(function (response) {
            console.log('Hello this is the response im looking for');
            console.log(response);
            let object = response.properties;
            for(let i = 0; i < 5; i++){
            let name = $('<p style="margin: 3px;">').text(response.properties[i].name);
            let source = response.properties[i].propertyImage.image.url;
            let img = $('<img>').attr('src', source);
            img.css("max-width", '15rem')


            let score = $('<p style="margin: 3px;">').text('Score: ' + response.properties[i].reviews.score);
            let star = $("<p>").text(JSON.parse(response.properties[i].star) + ' Stars');
            let card = $('<div class="card col-lg-3 card-styling" style="max-width: 18rem;">')
            let cardBody = $('<div class="card-body">')
            cardBody.append(img, name, score, star);
            card.append(cardBody);
            $('#hotel-info').append(card);

            }

        });
    });
}

destinationHotels(test);

// News query function
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


let resultsHeader = $("#resultsHeader");


function renderResultsHeader(city) {

    let url="https://api.unsplash.com/search/photos?query="+city+"&client_id=lLSAxvpFjby7KiDmDgbl3Wk9IpyV5xru0EHXxgXo9uY&per_page=60"

    $.ajax({
        method: 'GET',
        url: url,
        success:function(data){
            let imgURL = data.results[0].urls.full

        

        
         const headerTitle = $("<h1>").text(city);
         const headerImage = $("<img>").addClass("locationImage");

         
         $(headerImage).attr("src", imgURL )
         resultsHeader.append(headerTitle);
         resultsHeader.append(headerImage);
         
         


        }
    })
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
newsInfo(test);


/*
 search button event listener function(){
    we call the all the functions in the button event listener...

    destinationInfo(searchinput) -----> function for acquiring destination info
    destinationHotels(searchinput) ---------> function for acquiring hotels
    destinatNews(searchinput) --------------> function for acquiring news

}
also i think we need to create a function which stores the search history. 
*/
