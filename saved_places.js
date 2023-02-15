let favouritesArray = JSON.parse(window.localStorage.getItem("travelFavourites")) ?? [];
console.log(favouritesArray);




function renderFavourites() {
    $("#favourites").empty();

let faveRow = $("<div>").addClass("row");

for (let i=0; i<favouritesArray.length; i++) {
 
    let faveCard= $("<div>").addClass("cards card faveCards").css("background-image", "url(" + favouritesArray[i][2] + ")")
    let cardText = $("<div>").addClass("faveCardBackground");
    let favePlace = $("<h6>").text(favouritesArray[i][1]).addClass("faveCardText card-text");
    let faveCity = $("<h6>").text(favouritesArray[i][0]).addClass("faveCardText card-text");
    let url =  favouritesArray[i][3];
    let placeInfoBtn = $("<button id='news-url-btn'>").addClass('placeInfoBtn btn btn-info text-white m-2').text("More Info");
    let delBtn = $('<i class="fa-solid fa-trash">').attr("placeName", favouritesArray[i][1]).addClass("deleteBtn");
    placeInfoBtn.on("click", function(){
            window.open(url);
    })

    $(delBtn).on("click", function () {
    let $entry = $(this)
   
  

    
         for(let i=0; i<favouritesArray.length; i++) {
             if (favouritesArray[i][1] == $($entry).attr("placeName")) {
                favouritesArray.splice(i, 1);
                localStorage.setItem("travelFavourites", JSON.stringify(favouritesArray));
             }
            }
            location.reload();
});

    
      

    cardText.append(favePlace, faveCity);
    faveCard.append(delBtn, cardText, placeInfoBtn);
    // $(faveCard).on(events, function () {
        
    // });

    faveRow.append(faveCard);
    $("#favourites").append(faveRow);
}
}

if (favouritesArray.length !== 0) {
renderFavourites()
} 