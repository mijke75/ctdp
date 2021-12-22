import { App } from './app.object.js';

window.app;

// Create app object and initiate all phases 
$(document).ready(function() {
    // Check if we know which methodology we are supposed to use.
    let methodology = getUrlVars()['methodology'];
    if(typeof methodology == 'undefined') {
        window.location.href = '/';
    }
    else {
        loadFile('./css/methodology/' + methodology + '.css', 'css');
        // TODO check for user agent
        // TODO add isMobile class to body
        let mobileDevice = isMobile();
        if(mobileDevice) {
            loadFile('./css/mobile.css', 'css');
            $('body').addClass('mobile');
        }
        window.app = new App(methodology, mobileDevice);
    }

    $(window).on('resize scroll', function() {
        $('.phase').each(function() {
            var activePhase = $(this).attr('id');
            if ($(this).isInViewport()) {
                $('#newItem-wrapper .newItem-' + activePhase).css('display', 'inline-block');
            } 
            else {
                $('#newItem-wrapper .newItem-' + activePhase).hide();
            }
        });
    });
});



function isMobile(){
    return navigator.userAgent.toLowerCase().match(/mobile/i);
}



$.fn.isInViewport = function() {
    var elementTop = $(this).offset().top - $(window).scrollTop();
    var elementBottom = elementTop + $(this).outerHeight();
    var viewport = $(window).height();
    var breakpoint = viewport / 2;

    return elementTop < breakpoint && elementBottom > breakpoint && elementTop < viewport;
};



// Read a page's GET URL variables and return them as an associative array.
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}



// Load the correct files for the chosen methodology
function loadFile(path, type) {
    if (type == "js") {
      $("head").append(
        '<script type="text/javascript" src="' + path + '"></script>'
      )
    } else if (type == "css") {
      $("head").append(
        '<link href="' + path + '" rel="stylesheet" type="text/css">'
      )
    }
  }

  
  