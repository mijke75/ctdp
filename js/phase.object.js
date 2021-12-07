import { Items } from './items.object.js';

export class Phase {

    constructor (parent, element) {
        this.parent = parent;
        this.root = parent.root;
        this.phaseElement = element;
        this.id = this.phaseElement.attr('id');

        this.dontPropagateOn = this.root.options.dontPropagateOn;
        this.stateOptions = this.root.options.stateOptions;

        this.countElement = $('#' + this.id + ' ' + this.root.options.itemCounter);
        this.newItemElement = $('#' + this.id + ' ' + this.root.options.itemCounter);
        this.phaseState = this.stateOptions.closed;

        this.phaseElement.off('click').on('click', (e) => { this.toggleState(e); });
        this.newItemElement.off('click').on('click', (e) => { this.newButton(e); } );

        this.title = this.phaseElement.data('title');
        this.itemList = new Items(this);
        this.#attachItemListEvents();

        this.itemList.loadItems();
        this.count = Object.keys(this.itemList.list).length;
        this.setCounter();
        this.setDroppable();
    }

    toggleState = (e) => {
        if ($(e.target).is(this.dontPropagateOn.item) || 
            $(e.target).is(this.dontPropagateOn.newItem) || 
            $(e.target).is(this.dontPropagateOn.researchImage)){
            e.stopPropagation();
            return;
        }

        this.root.closeMenu();
        this.root.closeFabIcon();

        if (this.phaseState == 'closed' || this.phaseState == 'collapsed') {
            this.parent.minimizeAll();
            this.phaseElement.removeClass(this.stateOptions.collapsed);
            this.phaseElement.addClass(this.stateOptions.active);
            this.phaseState = 'open';
        }
        else {
            this.parent.resetAll();
        }
    }

    newButton = (e) => {
        this.root.closeMenu();
        this.root.closeFabIcon();

        this.itemList.newItem();
    }

    setCounter() {
        if (this.count < 0){
            this.count = 0;
        }
        this.countElement.html(this.count);
        this.countElement.attr('value', this.count);
    }

    setDroppable() {
        let self = this;
        this.phaseElement.droppable({
            accept: ".item",
            over: function( event, ui ) {
                let phaseObj = $(this);
                phaseObj.addClass( "draggable-hover" );

                if($(this).attr('id') != $('#' + ui.draggable[0].id).attr('data-phase')) {
                    phaseObj.addClass( "drop-over" );
                }
            },
            out: function( event, ui ) {
                $(this).removeClass( "draggable-hover" );
                $(this).removeClass( "drop-over" );
            },
            drop: function( event, ui ) {
                let items = JSON.parse(localStorage.items || "{}");
                let item = ui.draggable.data('uiDraggable').options.item;

                $(this).removeClass( "drop-over" );
                if(self.id != item.phase) {
                    let oldPhaseListItems = item.parent;
                    item.position = {top: 100,left: 100};
                    item.phase = self.id;
                    item.parent = self.itemList;

                    // Move item to another phase
                    oldPhaseListItems.removeItem(item.id);
                    self.itemList.addItem(item);

                    items[item.id].phase = self.id;

                    // Update html
                    $(ui.draggable).detach().appendTo(self.phaseElement); 
                    $(ui.draggable).css(item.position);
                    $(ui.draggable).attr('data-phase', self.id);
                    self.toggleState(event); 
                }
                else {
                    item.position = ui.position;
                }
                items[item.id].position = item.position;
                localStorage.items = JSON.stringify(items);
            }
          });
    }

    #attachItemListEvents() {
        this.itemList.addEventListener('newItem', (result) => {
            if (result) {
                this.count++;
                this.setCounter();
            }
        });
        this.itemList.addEventListener('addItem', (result) => {
            if (result) {
                this.count++;
                this.setCounter();
            }
        });
        this.itemList.addEventListener('removeItem', (result) => {
            if (result) {
                this.count--;
                this.setCounter();
            }
        });

    }

}
