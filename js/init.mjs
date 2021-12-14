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
        window.app = new App(methodology);
    }
    checkScreenWidth();
});

function checkScreenWidth() {
    if ($(window).width() < 1280) {
        $('main').hide();
        $('#fabIcon').hide();
        $('#menu li').slice(1).hide();
        $('#WarningScreenWidth').show();
    }
    else {
        $('main').show();
        $('#fabIcon').show();
        $('#menu li').show();
        $('#WarningScreenWidth').hide();
    }
}

$(window).on('resize', function() {
    checkScreenWidth();
});


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

  
  