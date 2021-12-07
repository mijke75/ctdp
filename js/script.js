import { App } from './app.object.js';

window.app;
let options = {
    phaseElements: '.phase',
    stageElements: '.stage',
    itemElements: '.item',
    itemCounter: '.itemCount',
    newItem: '.newItem',
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
    modalClose: '.modal-close',
    dontPropagateOn: {
        item: '.item',
        newItem: '.newItem',
        researchImage: '.research-image'
    },
    stateOptions: {
        closed: 'state-closed',
        collapsed: 'state-collapsed',
        active: 'state-active'
    },
    fields: {
        id: '#item-id',
        title: '#title',
        description: '#description',
        researchQuestion: '#research-question',
        researchStrategy: '#research-strategy',
        researchStrategyOption: 'strategy-option',
        researchMethod: '#research-method',
        researchMethodOption: 'method-option',
        researchConclusions: '#research-conclusions',
        researchResults: '#research-results',
        researchInformation: '.information',
        hasLink: 'hasLink'
    }
}
$(document).ready(function() {
    window.app = new App(options);
    window.app.initPhases();
});