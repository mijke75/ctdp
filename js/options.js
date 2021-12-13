// Define all HTML/CSS elements to prevent having HTML/CSS definitions in the Classes
export default
{
    legenda: '.legenda',
    versionElement: '.legenda footer',
    phaseElements: '.phase',
    stageElements: '.stage',
    stageWrapper: '.stage-wrapper',
    stageIcon: 'icon',
    itemElements: '.item',
    itemCounter: '.itemCount',
    newItem: '.newItem',
    phaseWrapper: '.phase-wrapper',
    phaseAction: 'phase-action',
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
        researchInformation: '.information'
    }
}