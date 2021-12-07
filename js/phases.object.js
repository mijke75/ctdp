import { Phase } from './phase.object.js';

export class Phases {

    constructor(parent) {
        // We always save the parent and the root class object so that we can find our way up if necessary
        this.parent = parent;
        this.root = parent.root;
        
        this.list = [];
        this.stateOptions = this.root.options.stateOptions;
    }

    addPhase(element) {
        this.list.push(new Phase(this, element));
    }

    minimizeAll() {
        this.list.forEach(phase => {
            phase.phaseState = 'collapsed';
            phase.phaseElement.addClass(this.stateOptions.collapsed);
            phase.phaseElement.removeClass(this.stateOptions.active);
        });
        this.root.hideStages();
    }

    resetAll() {
        this.list.forEach(phase => {
            phase.phaseState = 'closed';
            phase.phaseElement.removeClass(this.stateOptions.collapsed);
            phase.phaseElement.removeClass(this.stateOptions.active);
        });
        this.root.showStages();
    }

}