/* Search history function
Works with localStorage to keep the history list updated on new page loads
Also connects to search button and form submit
Runs on page load and on search button click
*/

const displaySearchHistory = (newSearchTerm) => {
    let searchHistory = {};
    if (localStorage.getItem('search_history')) {
        searchHistory = JSON.parse(localStorage.getItem('search_history'));
    };

    /* Check if search history already includes this term */
    if (newSearchTerm in searchHistory) {
        return;
    } else if (newSearchTerm && newSearchTerm.length > 0) {
        /* If there is a new term, add it to the search history */
        searchHistory[newSearchTerm] = {text: newSearchTerm};
        localStorage.setItem('search_history', JSON.stringify(searchHistory));
    };

    /* If the search history is not empty, show it on page */
    if (Object.keys(searchHistory).length > 0) {
        $('#search-history-help').addClass('hidden');
        updateSearchHistoryList(searchHistory);
    }
};

/* Update the element on page with list of search history */
const updateSearchHistoryList = (searchHistory) => {
    const searchHistoryList = $('#search-history-list');
    searchHistoryList.empty();
    for (let i=0; i<Object.keys(searchHistory).length; i++) {
        const searchTerm = Object.keys(searchHistory)[i];
        const searchTermElement = $('<li>').attr('data-search', searchTerm)

        /* Feedback so the user knows that these are links */
        searchTermElement.hover(function() {
            $(this).css('cursor', 'pointer');
            $(this).addClass('has-background-dark has-text-light');
        }, function() {
            $(this).removeClass('has-background-dark has-text-light');
        });

        searchTermElement.text(`${searchHistory[searchTerm].text}`);
        searchHistoryList.append(searchTermElement);
        searchTermElement.on('click', function() {
            mealSearch($(this).attr('data-search'));
        });
    };    
};

// on clicking the clear history button
$("#clear-localStorage").on("click", function() {
    localStorage.clear();
    $("#searchHistoryList").empty();
    updateSearchHistoryList(false);
    $("#search-history-help").removeClass("hidden")
});