import { App } from './app.object.js';

window.app;

// Width of screen to change to small device layout (don't forget to update mobile.css as well)
let smallDeviceWidth = 1024;

// Create app object and initiate all phases 
$(document).ready(function() {
    // Check for mobile device
    let smallDevice = isSmallDevice(smallDeviceWidth);
    let screenWidth = $(window).innerWidth();

    // For devices with width smaller than 600px mark as mobile
    if(screenWidth < smallDeviceWidth) {
        $('body').addClass('mobile');
    }

    // Check if we know which methodology we are supposed to use.
    let methodology = getUrlVars()['methodology'];
    if(typeof methodology == 'undefined') {
        window.location.href = '/';
    }
    else {
        loadFile('./css/methodology/' + methodology + '.css', 'css');

        window.app = new App(methodology, smallDevice);
    }

    $('.phase-container').on('scroll', (e) => { 
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

    $(window).on('resize', function() {
        // Check if size switches between mobile and desktop size
        if( (screenWidth > smallDeviceWidth && $(window).innerWidth() < smallDeviceWidth) || 
            (screenWidth < smallDeviceWidth && $(window).innerWidth() > smallDeviceWidth) ) {

            $('body').toggleClass('mobile');

            smallDevice = $('body').hasClass('mobile')
            window.app.smallDevice = smallDevice;

            $.each ( window.app.phases.list, function( index, phase ) {
                phase.toggleMobileDesktop();
            });
            screenWidth = $(window).innerWidth();
        }
    });
});

function isSmallDevice(maxWidth = 0){
    let userAgent = navigator.userAgent.toLowerCase().match(/mobile/i);
    if(userAgent == null) {
        // check for screenWidth
        if($(window).innerWidth() < maxWidth) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return userAgent;
    }
    // return navigator.userAgent.toLowerCase().match(/mobile/i);
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

  
  