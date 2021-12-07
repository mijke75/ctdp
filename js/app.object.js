import { Phases } from './phases.object.js';

export class App {

    constructor(options = {}) {
        // Version number which will be exported when design is saved
        this.version = '0.5';
        $(options.versionElement).html('v.' + this.version);

        this.root = this;
        this.options = options;
        this.phases = new Phases(this);
        this.stages = $(this.options.stageElements);
        this.fabIcon = $(this.options.fabIconToggle);
        this.menu = $(this.options.menuToggle);
        this.aboutElement = $(this.options.aboutModal);
        this.modalOverlayElement = $(this.options.aboutModal + ' ' + this.options.modalOverlay);
        this.modalCloseElement = $(this.options.modalClose);
        this.dotframework = {};

        // Load dotframework JSON with research strategies and methods (to be used in Modal)
        const self = this;
        $.getJSON ('/js/dotframework.json', function(dotframework) {
            self.dotframework = dotframework;
        });
    }

    // Creates Phases object with a list of Phase objects for each phase element section in the HTML
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
            this.#clear();
        }
    }

    // Private function to clear the design
    #clear() {
        localStorage.clear();
        $(this.options.itemElements).remove();
        $(this.options.itemCounter).attr('value', 0);
        $(this.options.itemCounter).html(0);
        this.closeFabIcon();
    }

    saveDesignProcess(extension = 'ctdp') {
        if (typeof localStorage.items == 'undefined') {
            alert('Nothing created yet, please make a design first.');
        }
        else {
            // Save the version number and valid is true to check with import
            let text = '{ "valid": "true", "version": "0.5", "items": ' + localStorage.items + ' }';
            let filename = 'export-' + this.#today() + '.' + extension;
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

    // Attach the created file to the hidden download and trigger this to download the file 
    #download = function(filename, text, el) {
        let element = document.getElementById(el);
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
    
        element.click();
    }

    loadDesignProcess() {
        let self = this;
        let allowed = false;
        // Check if we have an empty design
        if (typeof localStorage.items == 'undefined') {
            allowed = true;
        }
        else {
            // Check if the user wants to overwrite the current design
            allowed = confirm('Are you sure you want to import a design and loose your current work?');
        }
        if (allowed) {
            // Wait for a file being uploaded
            $(this.options.fabLoadElement).one('change', (e) => {
                let file = e.currentTarget.files[0];
                let fr = new FileReader();

                // Read the file
                fr.readAsText(file);
                fr.onload = function(data) {
                    let fileContent = JSON.parse(data.target.result);

                    // Check if this is a valid export file
                    if(fileContent['valid'] == 'true') {
                        let checkVersion = false;
                        // If the application has the same version number as saved in the export file, we're good.
                        if(fileContent['version'] == self.version) {
                            checkVersion = true;
                        }
                        else {
                            // We have a valid file, but made in a previous version, ask for permission
                            checkVersion = confirm('The export file is made in another version(' + fileContent['version'] + ') then the current application version(' + self.version + '). Are you sure you want to import this file?');
                        }
                        if(checkVersion) {
                            // Clear the current design
                            self.#clear();
                            // Save the items from the export file to the local storage
                            localStorage.items = JSON.stringify(fileContent['items']);
                            // reset the screen with the imported items
                            self.phases = new Phases(self);
                            self.initPhases();
                        }
                    }
                    else {
                        alert('Imported file is not valid, cannot import this file.');
                    }
                }
                self.closeFabIcon();
            });
            $(this.options.fabLoadElement).trigger('click');
        }
    }    

    about(tabIndex) {
        this.#openModal(tabIndex);
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