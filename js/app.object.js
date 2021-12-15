import { Stages } from './stages.object.js';
import { Phases } from './phases.object.js';
import * as options from './options.js';

export class App {
    constructor(methodologyId) {
        const self = this;

        this.root = this;
        this.options = options.default;
        
        // Version number which will be exported when design is saved
        this.version = '0.8.7';
        $(this.options.versionElement).html('v.' + this.version);

        this.methodology;
        if(!(methodologyId in localStorage)){
            localStorage.setItem(methodologyId,'{}');            
        }

        $.getJSON ('../data/methodology.json', function(result) {
            $.each ( result.methodologies, function( index, obj ) {
                if(obj.id == methodologyId) {
                    self.methodology = obj;
                }
            });

            // Check if we found the methodology otherwise we have to abort
            if(typeof self.methodology == 'undefined') {
                $.toast({
                    type: 'warning', 
                    position: 'center',
                    autoDismiss: true,
                    hideClose: true,
                    message: "Sorry we don't have that methodology available yet."
                });
                setTimeout(function() {
                    window.location.href = '/';
                }, 5500);
            }
            else {
                self.initScreen();
            }
        });

        this.stages = new Stages(this);
        this.phases = new Phases(this);
        this.fabIcon = $(this.options.fabIconToggle);
        this.menu = $(this.options.menuToggle);
        this.aboutElement = $(this.options.aboutModal);
        this.modalOverlayElement = $(this.options.aboutModal + ' ' + this.options.modalOverlay);
        this.modalCloseElement = $(this.options.modalClose);
        this.dotframework = {};

        // Load dotframework JSON with research strategies and methods (to be used in Modal)
        $.getJSON ('../data/dotframework.json', function(dotframework) {
            self.dotframework = dotframework;
        });
    }

    initScreen() {
        const self = this;
        // Set the id into the body, so that the correct CSS is loaded
        $('body').attr('id', this.methodology.id);

        // Update menu item and About information
        $('#menuitem-about-methodology').html('About ' + this.methodology.name);
        $('#about-methodology-title').html(this.methodology.name);
        $('#about-methodology-text').html('<h4>About ' + this.methodology.name + '</h4>' + this.methodology.about);

        $('#fabLoadDP').attr('accept',this.methodology.extension);

        // Render legenda
        let legendaElement = '';
        for(let i = 0; i < this.methodology.legenda.length; i++) {
            legendaElement += '<span>' + this.methodology.legenda[i] + '</span>';
        }
        $(legendaElement).prependTo($(this.options.legenda));


        // Load stages and make it render to the screen
        this.stages.loadStages(this.methodology.stages);
        $.each ( this.stages.list, function( index, stages ) {
            stages.render();
        });
        
        // Load phases and make it render to the screen
        this.phases.loadPhases(this.methodology.phases);
        $.each ( this.phases.list, function( index, phase ) {
            phase.render();
            phase.itemList.loadItems(phase.id);
        });
    }

    closeFabIcon() {
        this.fabIcon.prop( "checked", false );
    }

    closeMenu() {
        this.menu.prop( "checked", false );
    }

    clearStorage() {
        const self = this;
        $.toast({
            type: 'confirm', 
            position: 'center',
            message: 'Are you sure want to delete your design?'
        }).done(
            function() { 
                self.#clear();
            }
        );
    }

    // Private function to clear the design
    #clear() {
        delete localStorage[this.methodology.id];
        $(this.options.itemElements).remove();
        $(this.options.itemCounter).attr('value', 0);
        $(this.options.itemCounter).html(0);
        this.closeFabIcon();
    }

    saveDesignProcess() {
        if (typeof localStorage[this.methodology.id] == 'undefined' || localStorage[this.methodology.id] == '{}') {
            $.toast({
                type: 'warning', 
                position: 'center',
                autoDismiss: true,
                hideClose: true,
                message: 'Nothing created yet, please make a design first.'
            });
        }
        else {
            // Save the version number and valid is true to check with import
            let text = '{ "valid": "true", "version": "' + this.version + '", "methodology": "' + this.methodology.id + '", "items": ' + localStorage[this.methodology.id] + ' }';
            let filename = 'export-' + this.#today() + '.' + this.methodology.id;
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
        const self = this;
        let allowed = false;
        // Check if we have an empty design
        if (typeof localStorage[this.methodology.id] == 'undefined' || localStorage[this.methodology.id] == '{}') {
            this.#load();
        }
        else {
            // Check if the user wants to overwrite the current design
            $.toast({
                type: 'confirm', 
                position: 'center',
                message: 'Are you sure you want to import a design and loose your current work?'
            }).done(
                function() { 
                    self.#load();
                }
            );
    
        }
    }

    #load() {
        const self = this;

        // Wait for a file being uploaded
        $(this.options.fabLoadElement).off('change').one('change', (e) => {
            let file = e.target.files[0];
            let fr = new FileReader();

            // Read the file
            fr.readAsText(file);
            fr.onload = function(data) {
                let fileContent = JSON.parse(data.target.result);

                // Check if this is a valid export file
                if(fileContent['valid'] == 'true' && fileContent['methodology'] == self.methodology.id) {
                    let checkVersion = false;
                    // If the application has the same version number as saved in the export file, we're good.
                    if(fileContent['version'] == self.version) {
                        self.#loadNewContent(fileContent['items']);
                    }
                    else {
                        // We have a valid file, but made in a previous version, ask for permission
                        $.toast({
                            type: 'confirm', 
                            position: 'center',
                            message: 'The export file is made in another version(' + fileContent['version'] + ') then the current application version(' + self.version + '). Are you sure you want to import this file?'
                        }).done(
                            function() { 
                                self.#loadNewContent(fileContent['items']);
                            }
                        );
                    }
                }
                // BACKWARD COMPATIBILITY v0.5 *****************************************************
                else if (fileContent['valid'] == 'true' && fileContent['version'] == '0.5' ) {
                    self.#loadNewContent(fileContent['items']);
                }
                // BACKWARD COMPATIBILITY v0.5 *****************************************************
                else {
                    $.toast({
                        type: 'warning', 
                        position: 'center',
                        autoDismiss: true,
                        hideClose: true,
                        message: 'Imported file is not valid, cannot import this file.'
                    });
                }
            }
            self.closeFabIcon();

            // Clear file upload, to make sure we can import the same file if necessary
            e.target.value = "";
        });
        $(this.options.fabLoadElement).trigger('click');
    }

    #loadNewContent(fileContent){
        // Clear the current design
        this.#clear();
        // Save the items from the export file to the local storage
        localStorage[this.methodology.id] = JSON.stringify(fileContent);
        // reset the screen with the imported items

        // We need to loadItems in each phase
        $.each (this.phases.list, function ( index, phase ) {
            phase.itemList.loadItems(phase.id);
        });
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