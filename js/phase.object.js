import { Items } from './items.object.js';

export class Phase {

    constructor (parent, element) {
        this.parent = parent;
        this.phaseElement = element;
        this.id = this.phaseElement.attr('id');

        this.countElement = $('#' + this.id + ' .itemCount');
        this.addItemElement = $('#' + this.id + ' .addItem');
        this.phaseState = 'closed';

        this.phaseElement.off('click').on('click', (e) => { this.toggleState(e); });
        this.addItemElement.off('click').on('click', (e) => { this.addButton(e); } );

        this.title = this.phaseElement.data('title');
        this.itemList = new Items(this);

        this.itemList.loadItems();
        this.count = Object.keys(this.itemList.list).length;
        this.setCounter();
    }

    toggleState = (e) => {
        if ($(e.target).is('.item') || $(e.target).is('.addItem') || $(e.target).is('.research-image')){
            e.stopPropagation();
            return;
        }

        app.closeMenu();
        app.closeFabIcon();

        if (this.phaseState == 'closed' || this.phaseState == 'collapsed') {
            this.parent.minimizeAll();
            this.phaseElement.removeClass('state-collapsed');
            this.phaseElement.addClass('state-active');
            this.phaseState = 'open';
        }
        else {
            this.parent.resetAll();
        }
    }

    addButton = (e) => {
        app.closeMenu();
        app.closeFabIcon();

        this.itemList.addEventListener('addItem', (result) => {
            if (result) {
                this.count++;
                this.setCounter();
            }
        });

        this.itemList.addItem();
    }

    setCounter() {
        if (this.count < 0){
            this.count = 0;
        }
        this.countElement.html(this.count);
        this.countElement.attr('value', this.count);
    }

}
