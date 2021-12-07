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

    constructor(phase, item) {    
        this.registeredEvents = {};

        this.fields = item.root.options.fields;
        this.phaseObj = phase;

        this.modalElement = $(item.root.options.modal);
        this.modalOverlayElement = $(item.root.options.modal + ' ' + item.root.options.modalOverlay);

        this.modalTitleElement = $(item.root.options.modal + ' ' + item.root.options.modalTitle);
        this.title = this.phaseObj.title;
        this.phaseId = this.phaseObj.id;
        this.modalTitleElement.html(this.title);

        this.submitElement = $(item.root.options.modalSubmitButton);
        this.cancelElement = $(item.root.options.modalCancelButton);
        this.removeElement = $(item.root.options.modalRemoveButton);

        // Attach some click events to HTML elements
        this.modalOverlayElement.off('click').on('click', (e) => { this.close(e); });
        this.submitElement.off('click').one('click', (e) => { this.submit(e); });
        this.cancelElement.off('click').one('click', (e) => { this.close(e); });
        this.removeElement.off('click').one('click', (e) => { this.remove(e); });

        // Attach some other events to HTML field elements
        $(item.root.options.modal + ' textarea').off('input').on('input', (e) => { this.resizeTextarea(e) });
        $(item.root.options.modal + ' select').off('change').on('change', (e) => { this.changeSelect(e) });

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

    remove() {
        if (this.item.remove()) {
            this.close();
        }
    }


    // Get all the values from the Item element we're working with and update the form fields 
    setForm(item) {
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
        let self = this;
        $(self.fields.researchStrategy + ' .' + self.fields.researchStrategyOption).remove();
        $.each ( self.item.root.dotframework.strategies, function( index, strategy ) {
            $('<option class="' + self.fields.researchStrategyOption + '" value="' + index + '">' + strategy.name + '</option>').appendTo(self.fields.researchStrategy);
        });
    }

    // Get all the methods from the dotFramework JSON file, given the selected strategy, and create OPTIONs for the SELECT
    setSelectMethods() {
        let self = this;
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
        self = this;
        $(e.currentTarget).attr('data-value', $(e.currentTarget).val());

        // Check if we're dealing with a strategy select
        if ($(e.currentTarget).attr('id') == self.fields.researchStrategy.substring(1)) {
            let information = $(self.fields.researchStrategy + ' ~ ' + self.fields.researchInformation);
            if ($(e.currentTarget).val() == '') {
                information.removeClass(self.fields.haslink);
                information.removeAttr('href');
            }
            else {
                information.addClass(self.fields.haslink);
                information.attr('href', self.item.root.dotframework.strategies[$(e.currentTarget).val()].link);
            }
            self.setSelectMethods();
        }
        // Check if we're dealing with a method select
        else if ($(e.currentTarget).attr('id') == self.fields.researchMethod.substring(1)) {
            let information = $(self.fields.researchMethod + ' ~ ' +  + self.fields.researchInformation);
            if ($(e.currentTarget).val() == '') {
                information.removeClass(self.fields.haslink);
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
