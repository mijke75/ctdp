import { App } from './app.object.js';

window.app;
let options = {
    phaseElements: '.phase',
    stageElements: '.stage',
    itemElements: '.item',
    itemCounter: '.itemCount',
    fabIconToggle: '#fabIconCheckbox',
    fabSaveElement: 'fabSaveDP',
    fabLoadElement: '#fabLoadDP',
    menuToggle: '#menuToggleCheckbox',
    aboutModal: '#modal-about',
    modal: '#modal',
    modalTitle: '.dialog-title',
    modalSubmitButton: '#dialog-submit',
    modalCancelButton: '#dialog-cancel',
    modalRemoveButton: '#dialog-remove',
    modalOverlay: '.modal-overlay',
    modalClose: '.modal-close'
}
$(document).ready(function() {
    window.app = new App(options);
    window.app.initPhases();
});