$(document).ready(function() {
    $.getJSON ('../data/methodology.json', function(result) {
        $.each ( result.methodologies, function( index, methodology ) {
            let counter = 0;

            if(typeof localStorage[methodology.id] != 'undefined') {
                let storage = JSON.parse(localStorage[methodology.id]);
                for (let id in storage) {
                    if (!storage.hasOwnProperty(id)) continue;
                    counter++;
                };
            }
            $('.card-' + methodology.id + ' .card-info-hover').attr('data-value', counter);
            $('.card-' + methodology.id + ' .card-item-count').html(counter + ' item' +  (counter == 1 ? '': 's'));        

        });
    });
});