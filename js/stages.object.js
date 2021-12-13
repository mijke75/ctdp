import { Stage } from './stage.object.js';
import * as options from './options.js';

export class Stages {

    constructor(parent) {
        // We always save the parent and the root class object so that we can find our way up if necessary
        this.parent = parent;
        this.root = parent.root;
        
        this.options = options.default;

        this.list = [];
    }

    loadStages(stages) {
        const self = this;
        $.each ( stages, function( index, stageInfo ) {
            self.list.push(new Stage(this, stageInfo));
        });
    }

    hideStages() {
        $.each ($(this.options.stageElements), function () {
            $(this).addClass('hidden');
        });
    }

    showStages() {
        $.each ($(this.options.stageElements), function () {
            $(this).removeClass('hidden');
        });
    }

}