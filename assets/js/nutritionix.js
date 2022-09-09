const foodGroups = {
    1: 'dairy',
    2: 'protein',
    3: 'fruit',
    4: 'vegetable',
    5: 'grain',
    6: 'fat',
    7: 'legume',
    8: '',
    9: '',
};

const getNutrition = (ingredients) => {
    let ingredientStory = '';
    const queryUrl = 'https://trackapi.nutritionix.com/v2/natural/nutrients';
    const NutritionixAppID = '5f77a770';
    const NutritionixAppKey = '594db0e067d961329670fe3b67b185c3';
    const headerData =
    {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'x-app-id': NutritionixAppID,
        'x-app-key': NutritionixAppKey,
        'x-remote-user-id': '0',
        'cache-control': 'no-cache',
    };
    for (ingredient of ingredients) {
        ingredientStory += `${ingredient.quantity} ${ingredient.ingredient} and `
    };
    const settings = {
        async: true,
        crossDomain: true,
        url: queryUrl,
        method: 'POST',
        headers: headerData,
        data: JSON.stringify(
            {
                "query": ingredientStory,
            }
        ),
    }
    $.ajax(settings).done(function (response) {
        printIngredients(response);
    });
};

const printIngredients = (ingredientResponse) => {
    const main = $(".main")
    const nutritionBodyEl = $('#nutrition_body');
    nutritionBodyEl.empty();

    let totalCalories = 0;
    const totalCaloriesEl = $('#total_cal');
    let totalWeight = 0;
    const totalWeightEl = $('#total_weight');

    for (let i = 0; i < ingredientResponse.foods.length; i++) {
        const nutritionIngredientRow = $('<tr>');
        const quantityData = $('<td>').text(ingredientResponse.foods[i].serving_qty);
        nutritionIngredientRow.append(quantityData);
        const quantityType = $('<td>').text(ingredientResponse.foods[i].serving_unit);
        nutritionIngredientRow.append(quantityType);

        const foodName = $('<td>').text(ingredientResponse.foods[i].food_name);
        nutritionIngredientRow.append(foodName);

        const thisCalories = ingredientResponse.foods[i].nf_calories;
        totalCalories += thisCalories;
        const caloriesData = $('<td>').text(thisCalories);
        nutritionIngredientRow.append(caloriesData);

        const thisWeight = ingredientResponse.foods[i].serving_weight_grams;
        totalWeight += thisWeight;
        const weightData = $('<td>').text(thisWeight);
        nutritionIngredientRow.append(weightData);

        const foodGroup = foodGroups[ingredientResponse.foods[i].tags.food_group]
        const foodGroupEl = $('<td>').text(foodGroup);
        nutritionIngredientRow.append(foodGroupEl);
        nutritionBodyEl.append(nutritionIngredientRow);
    };

    totalCaloriesEl.text(`${totalCalories.toFixed(0)} cal`);
    totalWeightEl.text(`${totalWeight.toFixed(2)} g`);
    main.css("height", "max-content");
};