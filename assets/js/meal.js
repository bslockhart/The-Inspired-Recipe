let search;
let mealsArray = [];
const searchContainerEl = $('#search-results-container');
const recipeEl = $("#recipe");
const nutritionEl = $("#nutrition-table");

const mealSearch = (searchTerm) => {
    $.ajax({
        url: "https://www.themealdb.com/api/json/v1/1/search.php?s="+searchTerm,
        method: "GET"
    }).then(function(response){
        let searchResultEl = $('#search-results');
        mealsArray = response.meals;

        searchResultEl.empty(); 
        searchContainerEl.css('display', 'block');
        recipeEl.css('display', 'none');
        nutritionEl.css('display', 'none');
        $("#footer").css('position', "");
  
        if (mealsArray === null) {
            const searchFailedMsg = $('<p>').text('Sorry, no results were found. Try another search.');
            $('#search-results').append(searchFailedMsg);
        } else {
            displaySearchHistory(searchTerm);
            const historyElement = document.querySelector('[data-search="' + searchTerm + '"]');

            const recipesReturnedCount = `${searchTerm} (${mealsArray.length})`;
          
            let searchHistory = JSON.parse(localStorage.getItem('search_history'));
            searchHistory[searchTerm].text = recipesReturnedCount;
          
            localStorage.setItem('search_history', JSON.stringify(searchHistory));

            historyElement.innerHTML = recipesReturnedCount;
            
            for (obj of mealsArray) {
                const resultElement = $('<div>').attr('class', 'column is-3');
                const resultLink = $('<a id="' + obj.idMeal + '">');
                const resultImg = $('<img>').attr('width', '200');
                resultImg.attr('src', obj.strMealThumb);
                const resultPara = $('<p>').text(obj.strMeal);
              
                resultLink.attr("onclick", "recipeSelected(event)");
                resultLink.append(resultImg);
                resultLink.append(resultPara);
                resultElement.append(resultLink);
              
                $('#search-results').append(resultElement);
            };
        }
    });
};


function recipeSelected(event) {
    if(event.target.localName === "img" || event.target.localName === "p"){
        mealSelection(event.target.parentNode.id);
    }else{
        mealSelection(event.target.id);
    }    
}

const mealSelection = (selMealID) => {
    let mealSelectionArray = [];

    let selMealObj = mealsArray.find(mealsArray => mealsArray.idMeal === selMealID);
    const mealTitleEl = $("#title");
    const mealVideoEl = $("#video");
    const mealImgEl = $("#recipe_img");
    const recipeListEl = $("#recipe-list");
    const instructionsEl = $("#instructions");

    searchContainerEl.css('display', 'none');
    recipeEl.css('display', 'block');
    nutritionEl.css('display', 'block');
    recipeListEl.empty();

    mealTitleEl.text(selMealObj.strMeal);

    const videoCode = selMealObj.strYoutube.split('=')[1];
    mealVideoEl.html(`<iframe width="420" height="315" src="https://www.youtube.com/embed/${videoCode}"></iframe>`);

    mealImgEl.attr("src", selMealObj.strMealThumb);

    instructionsEl.text(selMealObj.strInstructions);
    
    for (let i = 1; i <= 20; i++){
        const ingredient = selMealObj["strIngredient" + i];
        const measurement = selMealObj["strMeasure" + i];

        if(ingredient !== "" && ingredient !== null){
            const recipeListItem = $("<li>");
            recipeListItem.text(measurement + " " + ingredient);
            recipeListEl.append(recipeListItem);

            mealSelectionArray.push({"ingredient": ingredient, "quantity": measurement});
        } else {
            break;
        };
    };
    getNutrition(mealSelectionArray);
};

// back button functionality
$("#back-button").on("click", function() {
    searchContainerEl.css('display', 'block');
    recipeEl.css('display', 'none');
    nutritionEl.css('display', 'none');

})
