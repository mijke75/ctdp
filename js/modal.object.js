import * as options from './options.js';

export class Modal {
      
    // Create an event listener to all public methods in this class
    addEventListener(name, callback) {
        // This allows multiple events for the same name, that's not what we want here
        // if (!this.registeredEvents[name]) this.registeredEvents[name] = [];
        this.registeredEvents[name] = [];
        this.registeredEvents[name].push(callback);
    }

    // Tigger an event listener of a method in this class
    triggerEvent(name, args) {
        this.registeredEvents[name]?.forEach(fnc => fnc.apply(this, args));
    }

    constructor(root, phase, item) {    
        this.root = root;
        this.registeredEvents = {};
        this.options = options.default;

        this.fields = this.options.fields;
        this.phaseObj = phase;

        this.modalElement = $(this.options.modal);
        this.modalOverlayElement = $(this.options.modal + ' ' + this.options.modalOverlay);

        this.modalTitleElement = $(this.options.modal + ' ' + this.options.modalTitle);
        this.title = this.phaseObj.title;
        this.phaseId = this.phaseObj.id;
        this.modalTitleElement.html(this.title);

        this.submitElement = $(this.options.modalSubmitButton);
        this.cancelElement = $(this.options.modalCancelButton);
        this.removeElement = $(this.options.modalRemoveButton);

        // Attach some click events to HTML elements
        this.modalOverlayElement.off('click').on('click', (e) => { this.close(e); });
        this.submitElement.off('click').one('click', (e) => { this.submit(e); });
        this.cancelElement.off('click').one('click', (e) => { this.close(e); });
        this.removeElement.off('click').one('click', (e) => { this.remove(e); });

        // Attach some other events to HTML field elements
        $(this.options.modal + ' textarea').off('input').on('input', (e) => { this.resizeTextarea(e) });
        $(this.options.modal + ' select').off('change').on('change', (e) => { this.changeSelect(e) });

        this.item = item;
        this.mode = (item.id == '' ? 'new' : 'edit');
        this.setForm(this.item);

        this.open();
    }

    open() {
        this.modalElement.addClass('show');
    }

    close() {
        this.resetForm();
        this.modalElement.removeClass('show');
    }

    // Get all the values from the form fields and update the Item element we're working with
    submit() {
        const self = this;
        if(this.#validate()) {
            this.item.title = $(this.fields.title).val();
            this.item.description = $(this.fields.description).val();
            this.item.researchQuestion = $(this.fields.researchQuestion).val();
            this.item.researchStrategy = $(this.fields.researchStrategy).val();
            this.item.researchMethod = $(this.fields.researchMethod).val();
            this.item.researchConclusions = $(this.fields.researchConclusions).val();
            this.item.researchResults = $(this.fields.researchResults).val();
            this.item.save();
            this.close();
            this.triggerEvent('submit', [this.item]);
        }
        else {
            // Mark invalid fields
            jQuery('input:invalid, textarea:invalid, select:invalid').addClass('invalid');

            // Get the names of all invalid fields
            let fields = '';
            for(let f = 0; f < this.#invalidFields.length; f++) {
                fields += this.#invalidFields[f] + ', ';
            }
            let multiple = (this.#invalidFields.length > 1) ? 's' : '';

            // Trim the invalid fields text and remove the last ,
            fields = $.trim(fields).slice(0,-1);
            this.#invalidFields = [];

            // We want to have a single click event handler to prevent double click on the submit button.
            // But that means we have to reattach the event handler after an invalid submit
            self.submitElement.off('click').one('click', (e) => { self.submit(e); });

            // Show an alert
            $.toast({
                type: 'error', 
                position: 'center',
                autoDismiss: true,
                autoDismissDelay: 3000,
                message: 'Please fill in field' + multiple + ' "' + fields + '".'
            });
        }
    }

    remove() {
        const self = this;
        this.item.remove().done(
            function() { 
                self.close();
            }
        );
    }

    #invalidFields = [];
    #validate(){
        const self = this;
        var required = $('input, textarea, select').filter('[required]:visible');

        let allRequired = true;
        // Loop through all required fields and save them in array if they are not valid
        required.each(function(){
            if($(this).val() == ''){
                self.#invalidFields.push($(this).attr('id'));
                allRequired = false;
            }
        });

        var urls = $('input').filter('[type=url]');
        urls.each(function(){
            if( $(this).val() != '' && !self.#validURL( $(this).val() ) ) {
                self.#invalidFields.push($(this).attr('id'));
                allRequired = false;
            }
        });

        return allRequired;
    }

    #validURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
      }


    // Get all the values from the Item element we're working with and update the form fields 
    setForm(item) {
        this.#invalidFields = [];
        $('input,textarea,select').removeClass('invalid');
        $(this.fields.title).val(this.item.title);
        $(this.fields.description).val(this.item.description);
        $(this.fields.researchQuestion).val(this.item.researchQuestion);
        this.setSelectStrategies();
        $(this.fields.researchStrategy).val(this.item.researchStrategy).trigger('change');
        $(this.fields.researchStrategy).attr('data-value', this.item.researchStrategy);
        $(this.fields.researchMethod).val(this.item.researchMethod).trigger('change');
        $(this.fields.researchMethod).attr('data-value', this.item.researchMethod);
        $(this.fields.researchConclusions).val(this.item.researchConclusions);
        $(this.fields.researchResults).val(this.item.researchResults);

        // Distinct save and update depending on if we're creating a new Item or updating an existing Item
        if (this.mode == 'new') {
            this.submitElement.html("save");
            this.removeElement.hide();
        }
        else {
            this.submitElement.html("update");
            this.removeElement.show();
        }
    }

    // Get all the strategies from the dotFramework JSON file and create OPTIONs for the SELECT
    setSelectStrategies() {
        const self = this;
        $(self.fields.researchStrategy + ' .' + self.fields.researchStrategyOption).remove();
        $.each ( self.item.root.dotframework.strategies, function( index, strategy ) {
            $('<option class="' + self.fields.researchStrategyOption + '" value="' + index + '">' + strategy.name + '</option>').appendTo(self.fields.researchStrategy);
        });
    }

    // Get all the methods from the dotFramework JSON file, given the selected strategy, and create OPTIONs for the SELECT
    setSelectMethods() {
        const self = this;
        const strategyIndex = $(self.fields.researchStrategy).val();

        // Empty the select
        $(self.fields.researchMethod + ' .' + self.fields.researchMethodOption).remove();
        $(self.fields.researchMethod).attr('data-value', "");

        // Create OPTIONS for each method of the given strategy
        if ($.isNumeric(strategyIndex)) {
            $.each ( self.item.root.dotframework.strategies[strategyIndex].methods, function( index, method ) {
                $('<option class="' + self.fields.researchMethodOption + '" value="' + method.id + '">' + method.name + '</option>').appendTo(self.fields.researchMethod);
            });
        }
    }

    // Bring the form to the original empty state
    resetForm() {
        $('#tab-1').prop("checked", true);
        $(this.fields.title).val('');
        $(this.fields.description).val('');
        $(this.fields.researchQuestion).val('');
        $(this.fields.researchStrategy).val('').trigger('change');
        $(this.fields.researchMethod).val('').trigger('change');
        $(this.fields.researchConclusions).val('');
        $(this.fields.researchResults).val('');
        $(this.fields.id).val('');
    }

    // Enlarge TEXTAREAs as soon as we start typing to give the user feedback that they can enter more data then with a regular INPUT field
    resizeTextarea(e) {
        $(e.currentTarget).height($(e.currentTarget).prop('scrollHeight'));
    }

    // If a strategy or method is choosen, update the information icon and add a link to the resource about this strategy/method
    changeSelect(e) {
        const self = this;
        $(e.currentTarget).attr('data-value', $(e.currentTarget).val());

        // Check if we're dealing with a strategy select
        if ($(e.currentTarget).attr('id') == self.fields.researchStrategy.substring(1)) {
            let information = $(self.fields.researchStrategy + ' ~ ' + self.fields.researchInformation);
            if ($(e.currentTarget).val() == '') {
                information.removeAttr('href');
            }
            else {
                information.attr('href', self.item.root.dotframework.strategies[$(e.currentTarget).val()].link);
            }
            self.setSelectMethods();
        }
        // Check if we're dealing with a method select
        else if ($(e.currentTarget).attr('id') == self.fields.researchMethod.substring(1)) {
            let information = $(self.fields.researchMethod + ' ~ ' + self.fields.researchInformation);
            if ($(e.currentTarget).val() == '') {
                information.removeAttr('href');
            }
            else {
                information.addClass(self.fields.haslink);
                $.each ( self.item.root.dotframework.strategies[$(self.fields.researchStrategy).val()].methods, function( index, method ) {
                    if (method.id == $(self.fields.researchMethod).val()) {
                        information.attr('href', method.link);
                    }
                });    
            }
        } 
    }

}
