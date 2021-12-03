

// TODO - make independable from html ids and classnames
export class Modal {
      
    addEventListener(name, callback) {
        if (!this.registeredEvents[name]) this.registeredEvents[name] = [];
        this.registeredEvents[name].push(callback);
    }
    triggerEvent(name, args) {
        this.registeredEvents[name]?.forEach(fnc => fnc.apply(this, args));
    }

    constructor(phase, item = new Item()) {    
        this.registeredEvents = {};

        this.phaseObj = phase;

        this.modalElement = $(app.options.modal);
        this.modalOverlayElement = $(app.options.modal + ' ' + app.options.modalOverlay);

        this.modalTitleElement = $(app.options.modal + ' ' + app.options.modalTitle);
        this.title = this.phaseObj.title;
        this.phaseId = this.phaseObj.id;
        this.modalTitleElement.html(this.title);

        this.submitElement = $(app.options.modalSubmitButton);
        this.cancelElement = $(app.options.modalCancelButton);
        this.removeElement = $(app.options.modalRemoveButton);

        this.modalOverlayElement.off('click').on('click', (e) => { this.close(e); });
        this.submitElement.off('click').one('click', (e) => { this.submit(e); });
        this.cancelElement.off('click').one('click', (e) => { this.close(e); });
        this.removeElement.off('click').one('click', (e) => { this.remove(e); });
        $(app.options.modal + ' textarea').off('input').on('input', (e) => { this.resizeTextarea(e) });
        $(app.options.modal + ' select').off('change').on('change', (e) => { this.changeSelect(e) });

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
        this.item.title = $('#title').val();
        this.item.description = $('#description').val();
        this.item.researchQuestion = $('#research-question').val();
        this.item.researchStrategy = $('#research-strategy').val();
        this.item.researchMethod = $('#research-method').val();
        this.item.researchConclusions = $('#research-conclusions').val();
        this.item.researchResults = $('#research-results').val();
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
        $('#title').val(this.item.title);
        $('#description').val(this.item.description);
        $('#research-question').val(this.item.researchQuestion);
        this.setSelectStrategies();
        $('#research-strategy').val(this.item.researchStrategy).trigger('change');
        $('#research-strategy').attr('data-value', this.item.researchStrategy);
        $('#research-method').val(this.item.researchMethod).trigger('change');
        $('#research-method').attr('data-value', this.item.researchMethod);
        $('#research-conclusions').val(this.item.researchConclusions);
        $('#research-results').val(this.item.researchResults);

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
        $('#research-strategy .strategy-option').remove();
        $.each ( app.dotframework.strategies, function( index, strategy ) {
            $('<option class="strategy-option" value="' + index + '">' + strategy.name + '</option>').appendTo('#research-strategy');
        });
    }

    setSelectMethods() {
        const strategyIndex = $('#research-strategy').val();
        if ($.isNumeric(strategyIndex)) {
            $.each ( app.dotframework.strategies[strategyIndex].methods, function( index, method ) {
                $('<option class="method-option" value="' + method.id + '">' + method.name + '</option>').appendTo('#research-method');
            });
        }
    }

    resetForm() {
        $('#tab-1').prop("checked", true);
        $('#title').val('');
        $('#description').val('');
        $('#research-question').val('');
        $('#research-strategy').val('').trigger('change');
        $('#research-method').val('').trigger('change');
        $('#research-conclusions').val('');
        $('#research-results').val('');
        $('#item-id').val('');
    }

    resizeTextarea(e) {
        $(e.currentTarget).height($(e.currentTarget).prop('scrollHeight'));
    }

    changeSelect(e) {
        $(e.currentTarget).attr('data-value', $(e.currentTarget).val());
        if ($(e.currentTarget).attr('id') == 'research-method') {
            let information = $('#research-method ~ .information');
            if ($(e.currentTarget).val() == '') {
                information.removeClass('haslink');
                information.removeAttr('href');
            }
            else {
                information.addClass('haslink');
                $.each ( app.dotframework.strategies[$('#research-strategy').val()].methods, function( index, method ) {
                    if (method.id == $('#research-method').val()) {
                        information.attr('href', method.link);
                    }
                });    
            }
        }
        else if ($(e.currentTarget).attr('id') == 'research-strategy') {
            let information = $('#research-strategy ~ .information');
            if ($(e.currentTarget).val() == '') {
                information.removeClass('haslink');
                information.removeAttr('href');
            }
            else {
                information.addClass('haslink');
                information.attr('href', app.dotframework.strategies[$(e.currentTarget).val()].link);
            }
            this.setSelectMethods();
        }
    }

}
