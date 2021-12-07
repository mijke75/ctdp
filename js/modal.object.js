export class Modal {
      
    addEventListener(name, callback) {
        if (!this.registeredEvents[name]) this.registeredEvents[name] = [];
        this.registeredEvents[name].push(callback);
    }
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

        this.modalOverlayElement.off('click').on('click', (e) => { this.close(e); });
        this.submitElement.off('click').one('click', (e) => { this.submit(e); });
        this.cancelElement.off('click').one('click', (e) => { this.close(e); });
        this.removeElement.off('click').one('click', (e) => { this.remove(e); });
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
        if (this.item.remove(this.phaseObj)) {
            this.close();
        }
    }

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

        if (this.mode == 'new') {
            this.submitElement.html("save");
            this.removeElement.hide();
        }
        else {
            this.submitElement.html("update");
            this.removeElement.show();
        }
    }

    setSelectStrategies() {
        let self = this;
        $(self.fields.researchStrategy + ' .' + self.fields.researchStrategyOption).remove();
        $.each ( self.item.root.dotframework.strategies, function( index, strategy ) {
            $('<option class="' + self.fields.researchStrategyOption + '" value="' + index + '">' + strategy.name + '</option>').appendTo(self.fields.researchStrategy);
        });
    }

    setSelectMethods() {
        let self = this;
        const strategyIndex = $(self.fields.researchStrategy).val();
        if ($.isNumeric(strategyIndex)) {
            $(self.fields.researchMethod + ' .' + self.fields.researchMethodOption).remove();
            $.each ( self.item.root.dotframework.strategies[strategyIndex].methods, function( index, method ) {
                $('<option class="' + self.fields.researchMethodOption + '" value="' + method.id + '">' + method.name + '</option>').appendTo(self.fields.researchMethod);
            });
        }
    }

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

    resizeTextarea(e) {
        $(e.currentTarget).height($(e.currentTarget).prop('scrollHeight'));
    }

    changeSelect(e) {
        self = this;
        $(e.currentTarget).attr('data-value', $(e.currentTarget).val());
        if ($(e.currentTarget).attr('id') == self.fields.researchMethod.substring(1)) {
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
        else if ($(e.currentTarget).attr('id') == self.fields.researchStrategy.substring(1)) {
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
    }

}
