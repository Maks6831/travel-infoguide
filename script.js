// Global variables
let searchArray = JSON.parse(window.localStorage.getItem("travelSearches")) ?? [];
console.log(searchArray)
let favouritesArray = JSON.parse(window.localStorage.getItem("travelFavourites")) ?? [];
console.log(favouritesArray);
$('.carousel-parent').hide();

            

// Local Storage function for the search input
function storeInput(searchInput) {
    // input again if field is null or empty
    if (searchInput === null || searchInput === "") {
        return
    };
    //city name added to the local storage search array if it doesn't exist already
    if (searchArray.indexOf(searchInput) !== 0) {
        searchArray.unshift(searchInput);
        localStorage.setItem("travelSearches", JSON.stringify(searchArray));
        $(".wrapper").removeClass("d-none");
    };
    renderRecentSearches();
}

// Render the search button, for loop and event listener
function renderRecentSearches() {
    $("#search-history").empty();
    for (i = 0; i < 5; i++) {
        if (i >= searchArray.length) { break; }
        let cityBtn = $("<button>").addClass('cityBtn bg-info btn my-1 text-white').text(searchArray[i]);
        $("#search-history").append(cityBtn);
        // Event listener for the recent history
        cityBtn.on('click', function (event) {
            event.preventDefault();
            $('#welcome').addClass('d-none');
            $(".wrapper").removeClass("d-none");
            const searchTerm = event.target.innerText;
            renderResultsBackground(searchTerm);
            destinationInfo(searchTerm);
            destinationHotels(searchTerm);
            newsInfo(searchTerm);
            displayTitle(searchTerm);
        })
    }
}

    // Function to get and display the destination info -- MAK
    const otmApiKey = '5ae2e3f221c38a28845f05b61b33349e006e82dfbec0fbaa34f9f984';
    // let test = 'Berlin';
    // Function to display title on search -- MAK
    function displayTitle(searchInput){
        $('#city-title').empty();
        let title = $('<h1 class="text-center mask" style="font-size: 4rem;">').text(searchInput)
        $('#city-title').append(title);
    }




    // function for changing cards on carousel -- MAK
    function changeInfo(index, container) {
        // show only the card that has the same index as the variable index
        for (let i = 0; i < container.length; i++) {
            if (Object.keys(container)[i] == index) {
                $(container[i]).show()
            } else {
                $(container[i]).hide();

            }
        }
    }

    // Creates cards for carousel -- MAK
    function createInterestCards(response) {
        let substring = 'en.wikipedia';
        let article = response.wikipedia;
        // checks if the article is in english. If it is in english, it creates the card.
        if (article.includes(substring)) {
            let card = $('<div class="cards" style="margin: 20px">');
            let source = response.preview.source;
            let img = $('<img class="image carousel-image">').attr('src', source);
            let name = $('<p class="title">').text(response.name);
            let info = $('<p>').text(response.wikipedia_extracts.text)
            let heart = $('<i class="fa-regular fa-heart heartBtn">').attr("cityName", response.name);
            let noOfChar = 150;
            // if no of characters of p element is less noOfChar create read more button hide extra characters in hidden span element
            if (info.text().length > noOfChar) {
                let textDisplay = info.text().slice(0, noOfChar);
                let moreText = info.text().slice(noOfChar);
                info = `${textDisplay}<span class="dot" style="text-align: justify;"></span><span class="hide" style="text-align: justify;">${moreText}</span>`
                let button = $('<button style="all:unset; color: blue; text-decoration: underline; ">read more</button>');
                // when clicking on read more button hidden span element is now shown
                button.on("click", function () {
                    let parent = button.parent()
                    parent.children('span').removeClass('hide');
                    button.remove();
                });
                card.append(img, name, info, button, heart);
            } else {
                // if its less than noOfChar just display without read more button and hidden span
                card.append(img, name, info, heart)  
            }
            // The following part of this function is Mat's work -- upto line 149
            for(let i = 0; i < favouritesArray.length; i++){
                if(favouritesArray[i][1] === response.name){
                    heart.removeClass("fa-regular").addClass("fa-solid");
                }
            }
            
            $(heart).on("click", function () {   // adds clicked card to new array, then pushes new into array into stored favourites 
         if ($(heart).hasClass("fa-regular")) {
            heart.removeClass("fa-regular").addClass("fa-solid");
            let newFavourite = []
            let imageURL = response.preview.source;
            let propertyName = response.name;
            let currentCity = response.address.city;
            let wikiLink = response.wikipedia
            newFavourite.push(currentCity, propertyName, imageURL, wikiLink);
                
                let found = false;
                for(let i = 0; i < favouritesArray.length; i++){
                    if(favouritesArray[i][1] === newFavourite[1]){
                        found = true;
                        break;
                    }
                }
                if(!found){
                    favouritesArray.push(newFavourite);
                    localStorage.setItem("travelFavourites", JSON.stringify(favouritesArray));
                }

     } else {  
            heart.removeClass("fa-solid").addClass("fa-regular");
           let $entry = $(this);
      
       
         
    console.log($($entry).attr("cityName"));

         for(let i=0; i<favouritesArray.length; i++) {
             if (favouritesArray[i][1] == $($entry).attr("cityName")) {
                favouritesArray.splice(i, 1);
                localStorage.setItem("travelFavourites", JSON.stringify(favouritesArray));
             }
            }
            
            }
            });
            // append card onto carousel -- MAK 
            $('#info-carousel').append(card);
        } else {
            //skip  non english articles
            return;
        }
        // declare index which determines what card is shown on the carousel
        let index = 0;
        // lets create some buttons!
        let previous = $('<i id="previous" class="fa-solid fa-arrow-left fa-2xl">')
        let next = $('<i id="next" class="fa-solid fa-arrow-right fa-2xl">')
        // lets append buttons to carousel
        $('#info-carousel').append(previous, next);
        // store all cards in an array
        let container = $('.cards');
        // display card with 0 index upon search 
        changeInfo(index, container);
        // previous button function decreases index by 1 displays card with index of current-1
        previous.on('click', function () {
            index -= 1;
            if (index < 0) {
                index = container.length - 1;
            }
            changeInfo(index, container)
        })
        // next button function increases index by 1 displays card with index of current-1
        next.on('click', function () {
            index += 1;
            if (index > container.length - 1) {
                index = 0
            }
            changeInfo(index, container);
        })
    }

    // function to acquire data from opentripmap -- MAK
    function destinationInfo(searchInput) {
        let lang = 'en'
        let latlongApi = 'https://api.opentripmap.com/0.1/' + lang + '/places/geoname?name=' + searchInput + '&apikey=' + otmApiKey;
        // following ajax request acquires latitude and longitude of city
        $.ajax({
            url: latlongApi,
            method: 'GET',
        }).then(function (response) {
            let lat = response.lat;
            let lon = response.lon
            let objectApi = 'https://api.opentripmap.com/0.1/en/places/radius?radius=10000&lon=' + lon + '&lat=' + lat + '&rate=3h&apikey=' + otmApiKey;
            // ajax request to acquire information about the city 
            $.ajax({
                url: objectApi,
                method: 'GET'
            }).then(function (response) {
                // shows carousel
                $('.carousel-parent').show();
                // empties carousel section when searching with a button.
                $("#info-carousel").empty();
                let textArr = [];
                /* opentripmap does not provide any information using the previous ajax request but does provide XIDs (special id number)
                 which can be used to perform another ajax request and acquire the information need to create the cards(image URLs etc.) */
                 // for loop which injects specific XIDs into an ajax request
                for (let i = 0; i < 10; i++) {
                    let xid = response.features[i].properties.xid;
                    infoApi = 'https://api.opentripmap.com/0.1/en/places/xid/' + xid + '?apikey=' + otmApiKey;
                    $.ajax({
                        url: infoApi,
                        method: 'GET',
                    }).then(function (response) {
                        // if statement which checks for duplicates
                        if(textArr.indexOf((response.wikipedia_extracts.text).slice(0, 8)) === -1){
                            // if the starting of wikipedia_extract is not in textArr push article to textArr and create card. 
                            textArr.push((response.wikipedia_extracts.text).slice(0, 8))
                            createInterestCards(response);
                        }
                    }) // end of ajax for xid
                } // end of loop 
            })
        })
    }

    // Acquiring information on hotels -- MAK
    function destinationHotels(searchInput) {
        const settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://hotels-com-provider.p.rapidapi.com/v2/regions?locale=en_GB&query=" + searchInput + "&domain=AE",
            "method": "GET",
            "headers": {
                "X-RapidAPI-Key": "4afe4ad9cdmsh5c09ad5cd7af0e4p1ba622jsnfd445c272893",
                "X-RapidAPI-Host": "hotels-com-provider.p.rapidapi.com"
            }
        };
        // ajax request to acquire GaiaId (region specific ID which is used to search for hotels)
        $.ajax(settings).done(function (response) {
            let idNumber = response.data[0].gaiaId;
            //console.log(idNumber);
            const settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://hotels-com-provider.p.rapidapi.com/v2/hotels/search?domain=AE&sort_order=REVIEW&locale=en_GB&checkout_date=2023-09-27&region_id=" + idNumber + "&adults_number=1&checkin_date=2023-09-26&available_filter=SHOW_AVAILABLE_ONLY&meal_plan=FREE_BREAKFAST&guest_rating_min=8&price_min=10&page_number=1&children_ages=4%2C0%2C15&amenities=WIFI%2CPARKING&price_max=500&lodging_type=HOTEL%2CHOSTEL%2CAPART_HOTEL&payment_type=PAY_LATER%2CFREE_CANCELLATION&star_rating_ids=3%2C4%2C5",
                "method": "GET",
                "headers": {
                    "X-RapidAPI-Key": "4afe4ad9cdmsh5c09ad5cd7af0e4p1ba622jsnfd445c272893",
                    "X-RapidAPI-Host": "hotels-com-provider.p.rapidapi.com"
                }
            };
            // ajax request to acquire  hotel information using gaiaID
            $.ajax(settings).done(function (response) {
                let object = response.properties;
                $("#hotel-info").empty();
                // for loop to create hotel cards
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
    // 1. API query for the news
    function newsInfo(searchInput) {
        const newsQueryURL = `https://content.guardianapis.com/search?page=2&q=${searchInput}&api-key=7bdfba43-4614-4c0d-b1ee-bc1a140b8136`;

        $.ajax({
            url: newsQueryURL,
            method: 'GET',
        }).then(displayNews)
    }

    // 2. render the information on the screen
function displayNews(response) {
    // results for the ajax query reduce to response to avoid confusion
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
                //console.log(data);
                let imgURL = data.results[0].urls.full;
                console.log(imgURL);

                // const headerTitle = $("<h1>").text(city).addClass("resultsTitle");
                // htmlpage.css("background-image", "url(" + imgUrl + ")  ");

                $(".wrapper").css("background-image", "url(" + imgURL + ")");

            }
        })
    }

// function to save the comments from the "leave a comment section"
let commentsArray = JSON.parse(window.localStorage.getItem("comments")) ?? [];
console.log(commentsArray);

// on-click event to unhide/ hide a message overlay after a comment was made 
$("#add-comment").on("click", function (event) {
    event.preventDefault();
    // the following 7 lines written by MAK
    $('#comment-overlay').removeClass('d-none').addClass('comment-overlay');
    setTimeout(function(){
        $('#comment-overlay').addClass('fadeout');
    }, 1000)
    setTimeout(function(){
        $('#comment-overlay').removeClass('fadeout').removeClass('comment-overlay').addClass('d-none');
    }, 2000)

    saveComment();

    // reset the form fields to empty -- maud
    $(".comment-box").trigger("reset")
})

// save the comments to local storage
function saveComment() {
    let comment = {
        name: $("#name-input").val().trim(),
        msg: $("#comment-text").val().trim()
    }
    commentsArray.unshift(comment);
    localStorage.setItem("comments", JSON.stringify(commentsArray));
    $("#comments").empty();
    displayComment();
}

// function to display the comments on the page
function displayComment() {

    for (i = 0; i < 3 && i < commentsArray.length; i++) {
        
        let commentDiv = $("<div id='comment-div'class='border border-light rounded p-2 m-2'>");
        $("#comments").append(commentDiv);
        let commentName = $("<div id='comment-name'>").text(commentsArray[i].name);
        let commentMsg = $("<div id='comment-message'>").text(commentsArray[i].msg);
        commentDiv.append(commentName, commentMsg);
    }
    console.log(commentsArray);
}


/* Search button event listener function(){
we call the all the functions in the button event listener...
and also removes or adds the hide/d-none classes for the different sections */

$(document).ready(function () {
    $("#search-form").submit(function (event) {
        event.preventDefault();
        const searchInput = $("#search-input").val().trim();
        $('#welcome').addClass('d-none');
        $(".wrapper").removeClass("d-none");
        $(".recent-search").removeClass("d-none");
        $("#favourites").addClass("hide");
        renderResultsBackground(searchInput);
        destinationInfo(searchInput);
        destinationHotels(searchInput);
        newsInfo(searchInput);
        storeInput(searchInput);
        displayTitle(searchInput);
    });
    if (searchArray.length > 0) {
        $("search-input").val(searchArray[0]);
        $(".recent-search").removeClass("d-none");
        // $(".wrapper").removeClass("d-none");
        renderRecentSearches();
    }
    displayComment();
})

//------------------------------------------------------------------ media queries -- MAK ---------------------------------------------------------//
// function makes sure save places button stays in the correct position -- MAK
function mediaQueriesOne(screenWidthOne){
    if(screenWidthOne.matches){
        $('#search-div').removeClass('row').addClass('flexbox');
        $('.placeBtn').addClass('saved-places').removeClass('col-2');
        $('#search-form').addClass('mobile-search').removeClass('col-8');

        console.log("hello")
    } else {
        $('#search-form').addClass('col-8').removeClass('mobile-search');
        $('#search-div').addClass('row').removeClass('flexbox');
        $('.placeBtn').removeClass('saved-places').addClass('col-2');
        
    }
}

// makes sure that comment section stays in the correct position -- MAK
function mediaQueriesTwo(screenWidthTwo){
    if(screenWidthTwo.matches){
        $('.read-comment-box').addClass('padding-fix');
    } else {
        $('.read-comment-box').removeClass('padding-fix')
    }
}
const screenWidthOne = window.matchMedia("(max-width: 854px)")
mediaQueriesOne(screenWidthOne);
screenWidthOne.addListener(mediaQueriesOne);
const screenWidthTwo = window.matchMedia("(max-width: 576px)")
mediaQueriesTwo(screenWidthTwo);
screenWidthTwo.addListener(mediaQueriesTwo);

