import { Phase } from './phase.object.js';

export class Phases {

    constructor() {
        this.list = [];
    }

    addPhase(element) {
        this.list.push(new Phase(this, element));
    }

    minimizeAll() {
        this.list.forEach(phase => {
            phase.phaseState = 'collapsed';
            phase.phaseElement.addClass('state-collapsed');
            phase.phaseElement.removeClass('state-active');
        });
        app.hideStages();
    }

    resetAll() {
        this.list.forEach(phase => {
            phase.phaseState = 'closed';
            phase.phaseElement.removeClass('state-collapsed');
            phase.phaseElement.removeClass('state-active');
        });
        app.showStages();
    }

}