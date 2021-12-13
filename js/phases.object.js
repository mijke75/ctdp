import { Phase } from './phase.object.js';
import * as options from './options.js';

export class Phases {

    constructor(parent) {
        // We always save the parent and the root class object so that we can find our way up if necessary
        this.parent = parent;
        this.root = parent.root;
        
        this.list = [];
        this.stateOptions = options.default.stateOptions;
    }

    loadPhases(phases) {
        const self = this;
        $.each ( phases, function( index, phaseInfo ) {
            self.addPhase(phaseInfo);
        });
    }

    addPhase(phaseInfo) {
        this.list.push(new Phase(this, phaseInfo));
    }

    minimizeAll() {
        this.list.forEach(phase => {
            phase.phaseState = 'collapsed';
            $('#' + phase.id).addClass(this.stateOptions.collapsed);
            $('#' + phase.id).removeClass(this.stateOptions.active);
        });
        this.root.stages.hideStages();
    }

    resetAll() {
        this.list.forEach(phase => {
            phase.phaseState = 'closed';
            $('#' + phase.id).removeClass(this.stateOptions.collapsed);
            $('#' + phase.id).removeClass(this.stateOptions.active);
        });
        this.root.stages.showStages();
    }

}