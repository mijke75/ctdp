import * as options from './options.js';

export class Stage {
    constructor (parent, stage) {
        // We always save the parent and the root class object so that we can find our way up if necessary
        this.parent = parent;
        this.root = parent.root;

        this.options = options.default;

        if(typeof stage == 'undefined') {
            this.id = stage.id;
            this.icon = stage.icon;
            this.name = stage.name;
        }
        else {
            this.id = stage.id;
            this.icon = stage.icon;
            this.name = stage.name;
        }
    }

    render() {
        let stageElement = '<div class="' + this.options.stageElements.substring(1) + ' ' + this.id + '"><div class="' + this.options.stageIcon + '">' + this.icon + '</div>' + this.name + '</div>';
        $(stageElement).appendTo($(this.options.stageWrapper));
    }
}