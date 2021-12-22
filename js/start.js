$(document).ready(function() {   

    if ("serviceWorker" in navigator) {
        window.addEventListener("load", function() {
          navigator.serviceWorker
            .register("/service-worker.js")
            .then(res => console.log("service worker registered"))
            .catch(err => console.log("service worker not registered", err))
        })
    }

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

    if (window.matchMedia('(display-mode: standalone)').matches) {  
        // This is a PWA
    }
    else {
        if(navigator.userAgent.toLowerCase().match(/mobile/i)) {
            // This is in a mobile browser
            if(typeof localStorage['pwa'] == 'undefined' || localStorage['pwa'] == false) {
                alert('Please add this application to your home screen for best performances.');
                localStorage['pwa'] = true;
            }
        }
        else {
            // This is in a desktop browser
        }
    }

});