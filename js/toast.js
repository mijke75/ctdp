// Credits Kieran Boyle; https://codepen.io/kieran/pen/ajLvjm

;(function(window, $){
    // "use strict";
  
    var defaultConfig = {
      type: '',
      position: 'top-right',
      autoDismiss: false,
      hideClose: false,
      cancel: 'cancel',
      submit: 'ok',
      container: '#toasts',
      autoDismissDelay: 5000,
      transitionDuration: 500
    };
  
    $.toast = function(config){
      var dfd = $.Deferred();

      var size = arguments.length;
      var isString = typeof(config) === 'string';
      
      if(isString && size === 1){
        config = {
          message: config
        };
      }
  
      if(isString && size === 2){
        config = {
          message: arguments[1],
          type: arguments[0]
        };
      }

      config = $.extend({}, defaultConfig, config);
      const toastObj = new toast(config);

      $(document).off('click', config.container + ' button.cancel').on('click', config.container + ' button.cancel', (e) => { 
        var toastEl = $(e.target).parents('.toast');
        closeToast(toastEl, config);

        dfd.reject();
      });

      $(document).off('click', config.container + ' button.submit').on('click', config.container + ' button.submit', (e) => { 
        var toastEl = $(e.target).parents('.toast');
        closeToast(toastEl, config);

        dfd.resolve();
      });
    
      return dfd.promise();
    };
  
    var toast = function(config){
      // show "x" or not
      var close = config.hideClose ? '' : '&times;';
      
      // add buttons for confirm type
      let confirm = '';
      if(config.type == 'confirm') {
        confirm = '<div class="buttons"><button class="cancel">' + config.cancel + '</button><button class="submit">' + config.submit + '</button></div>';
      }

      // toast template
      var toast = $([
        '<div class="toast ' + config.type + '">',
        '<p>' + config.message + '</p>',
        confirm,
        '<div class="close">' + close + '</div>',
        '</div>'
      ].join(''));
      
      // handle dismiss
      toast.find('.close').on('click', function(){
        var toastEl = $(this).parent();
        closeToast(toastEl, config);
      });

      // remove previous position and append desired position to toasts container
      $(config.container).attr('class', '').addClass(config.position);
      
      // append toast to toasts container
      $(config.container).append(toast);
      
      // transition in
      setTimeout(function(){
        toast.addClass('show');
      }, config.transitionDuration);
  
      // if auto-dismiss, start counting
      if(config.autoDismiss && config.type != 'confirm'){
        setTimeout(function(){
          toast.find('.close').click();
        }, config.autoDismissDelay);
      }
  
      return this;
    };

    function closeToast(toastEl, config) {        
      toastEl.addClass('hide');
  
      setTimeout(function(){
        toastEl.remove();
      }, config.transitionDuration);
    }

    
})(window, jQuery);
