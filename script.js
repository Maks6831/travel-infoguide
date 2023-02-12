// Global variables
let searchArray = JSON.parse(window.localStorage.getItem("travelSearches")) ?? [];
console.log(searchArray)
let favouritesArray = JSON.parse(window.localStorage.getItem("travelFavourites")) ?? [];
console.log(favouritesArray);
$('.carousel-parent').hide();
            

// Local Storage function
function storeInput(searchInput) {
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
        if (i >= searchArray.length) { break; }
        let cityBtn = $("<button>").addClass('cityBtn bg-info btn my-1 text-white').text(searchArray[i]);
        $("#search-history").append(cityBtn);
        // Event listener for the recent history
        cityBtn.on('click', function (event) {
            event.preventDefault();
            const searchTerm = event.target.innerText;
            renderResultsBackground(searchTerm);
            destinationInfo(searchTerm);
            destinationHotels(searchTerm);
            newsInfo(searchTerm);
            
        })
    }

}

function renderFavourites() {
    $("#favourites").empty();

let favesTitle = $("<h5>").addClass("favouritesTitle").text("Your Saved Places");
$("#favourites").append(favesTitle);
let faveRow = $("<div>").addClass("row");

for (let i=0; i<favouritesArray.length; i++) {
  
    let faveCard= $("<div>").addClass("cards card faveCards").css("background-image", "url(" + favouritesArray[i][2] + ")")
   // let faveImage = $("<img>").attr("src", favouritesArray[i][2]).addClass("faveImage");
    let cardText = $("<div>").addClass("faveCardBackground");
    let favePlace = $("<h6>").text(favouritesArray[i][1]).addClass("faveCardText card-text");
    let faveCity = $("<h6>").text(favouritesArray[i][0]).addClass("faveCardText card-text");


    cardText.append(favePlace, faveCity);
    faveCard.append(cardText);
    faveRow.append(faveCard);
    $("#favourites").append(faveRow);
}
}

if (favouritesArray.length !== 0) {
renderFavourites()
}
    // Function to get and display the destination info
    const otmApiKey = '5ae2e3f221c38a28845f05b61b33349e006e82dfbec0fbaa34f9f984';
    // let test = 'Berlin';

    function changeInfo(index, container) {
        for (let i = 0; i < container.length; i++) {

            if (Object.keys(container)[i] == index) {
                console.log('hello');
                $(container[i]).show()
            } else {
                $(container[i]).hide();

            }
        }
    }

    function createInterestCards(response) {
        let substring = 'en.wikipedia'
        let article = response.wikipedia
        if (article.includes(substring)) {
            let card = $('<div class="cards" style="margin: 20px">');
            let source = response.preview.source;
            let img = $('<img class="image">').attr('src', source);
            let name = $('<p class="title">').text(response.name);
            let info = $('<p>').text(response.wikipedia_extracts.text);
            let noOfChar = 150;
            if (info.text().length < noOfChar) {
                return;
            } else {
                let textDisplay = info.text().slice(0, noOfChar);
                let moreText = info.text().slice(noOfChar);
                info = `${textDisplay}<span class="dot"></span><span class="hide">${moreText}</span>`
            }
            let button = $('<button style="all:unset; color: blue; text-decoration: underline; ">read more</button>');
            button.on("click", function () {
                let parent = button.parent()
                parent.children('span').removeClass('hide');
                button.remove();
            })
            card.append(img, name, info, button);

            $(img).on("click", function () {   // adds clicked card to new array, then pushes new into array into stored favourites 
              console.log(source);
                let newFavourite = []
                let imageURL = response.preview.source;
                let propertyName = response.name;
                let currentCity = response.address.city;
              
                newFavourite.push(currentCity, propertyName, imageURL);
               
               favouritesArray.push(newFavourite);

                localStorage.setItem("travelFavourites", JSON.stringify(favouritesArray));
            });
            
            $('#info-carousel').append(card);
        } else {
            return;
        }
        let index = 0;
        console.log(index);
        let previous = $('<i id="previous" class="fa-solid fa-arrow-left">')
        let next = $('<i id="next" class="fa-solid fa-arrow-right">')


        $('#info-carousel').append(previous, next);
        let container = $('.cards');
        changeInfo(index, container);
        previous.on('click', function () {
            index -= 1;
            if (index < 0) {
                index = container.length - 1;
            }
            changeInfo(index, container)
        })
        next.on('click', function () {
            index += 1;
            if (index > container.length - 1) {
                index = 0
            }
            console.log(JSON.stringify(index));
            changeInfo(index, container);
        })
    }

    function destinationInfo(searchInput) {
        let lang = 'en'
        let latlongApi = 'http://api.opentripmap.com/0.1/' + lang + '/places/geoname?name=' + searchInput + '&apikey=' + otmApiKey;

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
                $('.carousel-parent').show();
                $("#info-carousel").empty();
                for (let i = 0; i < 7; i++) {
                    let xid = response.features[i].properties.xid;
                    infoApi = 'https://api.opentripmap.com/0.1/en/places/xid/' + xid + '?apikey=' + otmApiKey;
                    $.ajax({
                        url: infoApi,
                        method: 'GET',
                    }).then(function (response) {
                        //console.log(response);
                        createInterestCards(response);
                    }) // end of ajax for xid
                } // end of loop 

            })
        })
    }



    // function destinationHotels(searchInput){
    function destinationHotels(searchInput) {
        const settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://hotels-com-provider.p.rapidapi.com/v2/regions?locale=en_GB&query=" + searchInput + "&domain=AE",
            "method": "GET",
            "headers": {
                "X-RapidAPI-Key": "42a6a75bb7msh8f62c4ed096e911p16d585jsn66470e467990",
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
                    "X-RapidAPI-Key": "42a6a75bb7msh8f62c4ed096e911p16d585jsn66470e467990",
                    "X-RapidAPI-Host": "hotels-com-provider.p.rapidapi.com"
                }
            };

            $.ajax(settings).done(function (response) {
                console.log('Hello this is the response im looking for');
                console.log(response);
                let object = response.properties;
                $("#hotel-info").empty();
                for (let i = 0; i < 5; i++) {
                    let name = $('<p style="margin: 3px;">').text(response.properties[i].name);
                    let source = response.properties[i].propertyImage.image.url;
                    let img = $('<img class="hotel-image image">').attr('src', source);
                    img.css("max-width", '15rem')


                    let score = $('<p style="margin: 3px;">').text('Score: ' + response.properties[i].reviews.score);
                    let star = $("<p>").text(JSON.parse(response.properties[i].star)+ ' ');
                    let starSymbol = $('<i class="fa-solid fa-star star"></i>');
                    star.append(starSymbol);
                    let card = $('<div class="card col-xl-2 col-md-5 col-sm-10 m-2 card-styling">');
                    let concat = (response.properties[i].name).replace(/ /g, "+").replace(',','');
                    let url = 'https://www.google.com/search?q=' + concat;
                    let button = $("<button id='news-url-btn'>").addClass('btn btn-info text-white m-2').text("More Info");
                    button.on("click", function(){
                            window.open(url);
                    })
                    let cardBody = $('<div class="card-body card-body-override">')
                    cardBody.append(img, name, score, star, button);
                    card.append(cardBody);
                    $('#hotel-info').append(card);
                }
            });
        });
    }

    // Function to get and display the news query 
    function newsInfo(searchInput) {
        const newsQueryURL = `https://content.guardianapis.com/search?page=2&q=${searchInput}&api-key=7bdfba43-4614-4c0d-b1ee-bc1a140b8136`;
        console.log(newsQueryURL);

        $.ajax({
            url: newsQueryURL,
            method: 'GET',
        }).then(displayNews)
    }

    function displayNews(response) {
        console.log(response)
        response = response.response
        $("#news-info").empty()

        for (let i = 0; i < 5; i++) {
            let result = response.results[i];
            let newsCard = $("<div>").addClass("news-cards card col-xl-2 col-md-5 col-sm-10 m-2 text-center bg-info text-white");
            $("#news-info").append(newsCard)
            let articleTitle = $("<h6 style='height: 80px'>").addClass('m-2').text(result.webTitle);
            let newsCardBtnDiv = $("<div>")
            let articleButton = $("<button id='news-url-btn'>").addClass('btn btn-outline-info bg-white text-info m-2').text("Read");
            newsCardBtnDiv.append(articleButton)
            articleButton.on('click', (event) => window.open(result.webUrl, ""));
            newsCard.append(articleTitle, newsCardBtnDiv);
        }
    }

    // Function to get and display a picture in the result header
    function renderResultsBackground(city) {

        let url = "https://api.unsplash.com/search/photos?query=" + city + " landmark tourism" + "&client_id=lLSAxvpFjby7KiDmDgbl3Wk9IpyV5xru0EHXxgXo9uY&per_page=60"

        $.ajax({
            method: 'GET',
            url: url,
            success: function (data) {
                console.log(data);
                let imgURL = data.results[0].urls.full;
                console.log(imgURL);

                // const headerTitle = $("<h1>").text(city).addClass("resultsTitle");
                // htmlpage.css("background-image", "url(" + imgUrl + ")  ");

                $(".wrapper").css("background-image", "url(" + imgURL + ")");

            }
        })
    }


    /*
     search button event listener function(){
        we call the all the functions in the button event listener...
    
        destinationInfo(searchInput) -----> function for acquiring destination info
        destinationHotels(searchInput) ---------> function for acquiring hotels
        destinatNews(searchInput) --------------> function for acquiring news
    
    }
    */

$(document).ready(function () {
    $("#search").click(function (event) {
        event.preventDefault();
        console.log("The button was clicked");
        const searchInput = $("#search-input").val().trim();
        $(".wrapper").removeClass("d-none");
        $("#favourites").addClass("hide")
        renderResultsBackground(searchInput);
        destinationInfo(searchInput);
        destinationHotels(searchInput);
        newsInfo(searchInput);
        storeInput(searchInput);
        console.log(searchInput);
    });
    if (searchArray.length > 0) {
        $("search-input").val(searchArray[0]);
        $(".wrapper").removeClass("d-none")
        renderRecentSearches();
    }
})
