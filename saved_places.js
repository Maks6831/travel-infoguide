let favouritesArray = JSON.parse(window.localStorage.getItem("travelFavourites")) ?? [];
console.log(favouritesArray);




function renderFavourites() {
    $("#favourites").empty();

let faveRow = $("<div>").addClass("row");

for (let i=0; i<favouritesArray.length; i++) {
 
    let faveCard= $("<div>").addClass("cards card faveCards").css("background-image", "url(" + favouritesArray[i][2] + ")")
  // let faveImage = $("<img>").attr("src", favouritesArray[i][2]).addClass("faveImage");
   let cardText = $("<div>").addClass("faveCardBackground");
    let favePlace = $("<h6>").text(favouritesArray[i][1]).addClass("faveCardText card-text");
    let faveCity = $("<h6>").text(favouritesArray[i][0]).addClass("faveCardText card-text");
    let favelink = 

    cardText.append(favePlace, faveCity);
    faveCard.append(cardText);
    // $(faveCard).on(events, function () {
        
    // });

    faveRow.append(faveCard);
    $("#favourites").append(faveRow);
}
}

if (favouritesArray.length !== 0) {
renderFavourites()
} else {

}