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
        let cityBtn = $("<button id='city-button'>").addClass('bg-primary btn my-1 text-white').text(searchArray[i]);
        $("#search-history").append(cityBtn);
    }
}
$(document).ready(function () {




    // Function to get and display the destination info
    const otmApiKey = '5ae2e3f221c38a28845f05b61b33349e006e82dfbec0fbaa34f9f984';
    let test = 'Berlin';

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
            let img = $('<img>').attr('src', source);
            let name = $('<p>').text(response.name);
            let info = $('<p>').text(response.wikipedia_extracts.text);
            let noOfChar = 150;
            if (info.text().length < noOfChar) {
                return;
            } else {
                let textDisplay = info.text().slice(0, noOfChar);
                let moreText = info.text().slice(noOfChar);
                info = `${textDisplay}<span class="dot"></span><span class="hide">${moreText}</span>`
            }
            let button = $('<button style="all:unset; color: blue; text-decoration: underline; "> ... read more</button>');
            button.on("click", function () {
                let parent = button.parent()
                parent.children('span').removeClass('hide');
                button.remove();
            })
            card.append(img, name, info, button);
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

    //destinationInfo(test);

    // function destinationHotels(searchinput){
    function destinationHotels(searchinput) {
        const settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://hotels-com-provider.p.rapidapi.com/v2/regions?locale=en_GB&query=" + searchinput + "&domain=AE",
            "method": "GET",
            "headers": {
                "X-RapidAPI-Key": "74a15b002emshee3653482cfa191p103ec8jsn685748d41dba",
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
                    "X-RapidAPI-Key": "74a15b002emshee3653482cfa191p103ec8jsn685748d41dba",
                    "X-RapidAPI-Host": "hotels-com-provider.p.rapidapi.com"
                }
            };

            $.ajax(settings).done(function (response) {
                console.log('Hello this is the response im looking for');
                console.log(response);
                let object = response.properties;
                for (let i = 0; i < 5; i++) {
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

    // Function to get and display the news query 
    function newsInfo(searchInput) {
        const newsQueryURL = `https://content.guardianapis.com/search?page=2&q=${sear}&api-key=7bdfba43-4614-4c0d-b1ee-bc1a140b8136`;
        console.log(newsQueryURL);

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
                //htmlpage.css("background-image", "url(" + imgUrl + ")  " );


                $(".wrapper").css("background-image", "url(" + imgURL + ")");

            }
        })
    }


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
        console.log("The button was clicked");
        const searchInput = $("#search-input").val().trim();
        renderResultsBackground(searchInput);
        destinationInfo(searchInput);
        destinationHotels(searchInput);
        newsInfo(searchInput);
        storeInput(searchInput);
        console.log(searchInput);
    });
})
