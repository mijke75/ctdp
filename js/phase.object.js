import { Items } from './items.object.js';

export class Phase {

    constructor (parent, element) {
        // We always save the parent and the root class object so that we can find our way up if necessary
        this.parent = parent;
        this.root = parent.root;

        this.phaseElement = element;
        this.id = this.phaseElement.attr('id');

        this.dontPropagateOn = this.root.options.dontPropagateOn;
        this.stateOptions = this.root.options.stateOptions;

        this.countElement = $('#' + this.id + ' ' + this.root.options.itemCounter);
        this.newItemElement = $('#' + this.id + ' ' + this.root.options.newItem);
        this.phaseState = 'closed';

        // Attach some click events to HTML elements
        this.phaseElement.off('click').on('click', (e) => { this.toggleState(e); });
        this.newItemElement.off('click').on('click', (e) => { this.newButton(e); } );

        this.title = this.phaseElement.data('title');
        this.itemList = new Items(this);
        // Attach some custom event listeners to the created Items class object
        this.#attachItemListEvents();

        // Load the items and update the counter on the screen
        this.itemList.loadItems();
        this.count = Object.keys(this.itemList.list).length;
        this.setCounter();
        this.setDroppable();
    }

    // When clicked on a phase we toggle its state to open or close it
    toggleState = (e) => {
        // We don't want to propagate the click events on child HTML elements of the phase HTML element
        if ($(e.target).is(this.dontPropagateOn.item) || 
            $(e.target).is(this.dontPropagateOn.newItem) || 
            $(e.target).is(this.dontPropagateOn.researchImage)){
            e.stopPropagation();
            return;
        }

        this.root.closeMenu();
        this.root.closeFabIcon();

        // If we're currently closed or collapsed then we can be open, otherwise we can close it
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

    // Add a new Item to the ItemList
    newButton = (e) => {
        this.root.closeMenu();
        this.root.closeFabIcon();

        this.itemList.newItem();
    }

    // Set the counter
    setCounter() {
        if (this.count < 0){
            this.count = 0;
        }
        this.countElement.html(this.count);
        this.countElement.attr('value', this.count);
    }

    // Make the phase HTML element droppable, so we can drop a draggable Item on it
    setDroppable() {
        let self = this;
        this.phaseElement.droppable({
            accept: ".item",
            // If we move a draggable Item (from another phase) over this phase HTML element, give an indicator that we are droppable.
            over: function( event, ui ) {
                let phaseObj = $(this);
                // Set the z-index of this phase HTML element to -1 to always have the draggable Item on top
                phaseObj.addClass( "draggable-hover" );

                if($(this).attr('id') != $('#' + ui.draggable[0].id).attr('data-phase')) {
                    phaseObj.addClass( "drop-over" );
                }
            },
            // If we move out a draggable Item, remove the indicator
            out: function( event, ui ) {
                $(this).removeClass( "draggable-hover" );
                $(this).removeClass( "drop-over" );
            },
            // If we drop a draggable Item on this phase HTML element, move that Item to this phase
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
                    // If the draggable Item is not moved to another phase, just save its new position
                    item.position = ui.position;
                }
                items[item.id].position = item.position;
                localStorage.items = JSON.stringify(items);
            }
          });
    }

    // Attach event listeners to the methods of the ListItems class object
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
