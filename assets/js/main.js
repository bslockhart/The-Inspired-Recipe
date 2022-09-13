$(document).ready(function() {
    displaySearchHistory();
    
    $('#search-form').on('submit', function(event) {
        event.preventDefault();
        let searchTerm = $('#search-field').val();
        runSearch(searchTerm);
    });

    $('#search-button').on('click', function(event) {
        let searchTerm = $('#search-field').val();
        runSearch(searchTerm);   
    });

    const runSearch = (searchTerm) => {
        mealSearch(searchTerm);
    };
});
