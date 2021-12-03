import { Phases } from './phases.object.js';

export class App {

    constructor(options = {}) {
        this.options = options;
        this.phases = new Phases();
        this.stages = $(this.options.stageElements);
        this.fabIcon = $(this.options.fabIconToggle);
        this.menu = $(this.options.menuToggle);
        this.aboutElement = $(this.options.aboutModal);
        this.modalOverlayElement = $(this.options.aboutModal + ' ' + this.options.modalOverlay);
        this.modalCloseElement = $(this.options.modalClose);
        this.dotframework = {};

        // Load dotframework JSON with research strategies and methods (to be used in Modal)
        const self = this;
        $.getJSON ('js/dotframework.json', function(dotframework) {
            self.dotframework = dotframework;
        });
    }

    /**
     * Creates Phases object with a list of Phase objects for each phase element section in the HTML
     */
    initPhases() {
        const phaseElements = $(this.options.phaseElements);
        const self = this;
        $.each (phaseElements, function () {
            self.phases.addPhase($(this));
        });

    }

    hideStages() {
        $.each (this.stages, function () {
            $(this).addClass('hidden');
        });
    }

    showStages() {
        $.each (this.stages, function () {
            $(this).removeClass('hidden');
        });
    }

    closeFabIcon() {
        this.fabIcon.prop( "checked", false );
    }

    closeMenu() {
        this.menu.prop( "checked", false );
    }

    clearStorage() {
        if (confirm('Are you sure want to delete your design?')) {
            localStorage.clear();
            $(this.options.itemElements).remove();
            $(this.options.itemCounter).attr('value', 0);
            $(this.options.itemCounter).html(0);
            this.closeFabIcon();
        }
    }

    saveDesignProcess() {
        if (typeof localStorage.items == 'undefined') {
            alert('Nothing to save yet.');
        }
        else {
            let text = localStorage.items;
            let filename = 'export-' + this.#today() + '.ctdp';
            this.#download(filename, text, this.options.fabSaveElement);
        }    
        this.closeFabIcon();
    }

    #today = function() {
        let d = new Date(),
        minute = '' + d.getMinutes(),
        hour = '' + d.getHours(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        returnValue = '';
    
        if (minute.length < 2) 
            minute = '0' + minute;
        if (hour.length < 2) 
            hour = '0' + hour;
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        returnValue = [year, month, day].join('-') + '-' + [hour, minute].join('.');
        return returnValue;
    }

    #download = function(filename, text, el) {
        let element = document.getElementById(el);
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
    
        element.click();
    }

    loadDesignProcess() {
        let allowed = false;
        if (typeof localStorage.items == 'undefined') {
            allowed = true;
        }
        else {
            allowed = confirm('Are you sure you want to load a design and loose your current work?');
        }
        if (allowed) {
            $(this.options.fabLoadElement).one('change', (e) => {
                let file = e.currentTarget.files[0];
                let fr = new FileReader();
              
                fr.readAsText(file);
                fr.onload = function(data) {
                  localStorage.items = data.target.result;
                  setTimeout(function(){window.location = window.location}, 300);
                }
                this.closeFabIcon();
            });
            $(this.options.fabLoadElement).trigger('click');
        }
    }    

    aboutCTDP() {
        this.#openModal(1);
        this.closeMenu();
    }

    aboutThisTool() {
        this.#openModal(2);
        this.closeMenu();
    }

    aboutDF() {
        this.#openModal(3);
        this.closeMenu();
    }

    #openModal = function (tab) {
        $('#tab-0' + tab).prop('checked', 'true');
        this.aboutElement.addClass('show');
        $(this.options.aboutModal + ' ' + this.options.modalOverlay).off('click').on('click', (e) => { this.#closeModal(e); });
        this.modalOverlayElement.off('click').on('click', (e) => { this.#closeModal(e); });
        this.modalCloseElement.off('click').on('click', (e) => { this.#closeModal(e); });
    }

    #closeModal = function(e) {
        this.aboutElement.removeClass('show');
    }

}