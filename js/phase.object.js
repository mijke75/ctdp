import { Items } from './items.object.js';
import { Item } from './item.object.js';
import * as options from './options.js';

export class Phase {

    constructor (parent, phase) {
        // We always save the parent and the root class object so that we can find our way up if necessary
        this.parent = parent;
        this.root = parent.root;
        this.options = options.default;
        this.phaseState = 'closed';

        this.itemList = new Items(this);

        this.dontPropagateOn = this.options.dontPropagateOn;
        this.stateOptions = this.options.stateOptions;

        // Attach some custom event listeners to the created Items class object
        this.#attachItemListEvents();

        if(typeof phase == 'undefined') {
            this.id = phase.id;
            this.title = phase.title;
            this.footer = phase.footer;
            this.small = phase.small;               
        }
        else {
            this.id = phase.id;
            this.title = phase.title;
            this.footer = phase.footer;
            this.small = phase.small;
        }
    }

    // Load the items and update the counter on the screen
    loadPhase(phase) {
        this.id = phase.id;
        this.title = phase.title;
        this.footer = phase.footer;
        this.small = phase.small;
        this.itemList.loadItems(this.id);
    }

    render() {
        let phaseElement = '<section id="' + this.id + '" class="' + this.options.phaseElements.substring(1) + ' ' + ((this.small) ? "small" : "") + ' ' + this.id + '" data-title="' + this.title + '">';
        phaseElement += '<header>';
        phaseElement += '<h2>' + this.title + '</h2>';
        phaseElement += '<div class="' + this.options.itemCounter.substring(1) + '" value="0">0</div>';
        phaseElement += '<div class="' + this.options.newItem.substring(1) + '">+</div>';
        phaseElement += '</header>';
        phaseElement += '<footer>';
        for(let i = 0; i < this.footer.length; i++) {
            phaseElement += '<div class="' + this.options.phaseAction + '">' + this.footer[i] + '</div>';
        }
        phaseElement += '</footer>';
        phaseElement += '</section>';
        $(phaseElement).appendTo($(this.options.phaseWrapper));

        this.countElement = $('#' + this.id + ' ' + this.options.itemCounter);
        this.newItemElement = $('#' + this.id + ' ' + this.options.newItem);

        // Attach some click events to HTML elements
        $(document).off('click', '#' + this.id).on('click', '#' + this.id, (e) => { this.toggleState(e); });
        $(document).off('click', '#' + this.id + ' ' + this.options.newItem).on('click', '#' + this.id + ' ' + this.options.newItem, (e) => { this.newButton(e); } );

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
            $('#' + this.id).removeClass(this.stateOptions.collapsed);
            $('#' + this.id).addClass(this.stateOptions.active);
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
        $('#' + this.id).droppable({
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
                let item = ui.draggable.data('uiDraggable').options.item;

                $(this).removeClass( "drop-over" );
                
                if(self.id != item.phase) {
                    // Item has been moved to another phase let's take care of the Item object
                    let oldPhaseListItems = item.parent;
                    item.phase = self.id;
                    item.parent = self.itemList;

                    // Move Item to another Phase object
                    oldPhaseListItems.removeItem(item.id);
                    self.itemList.moveItem(item);
                    self.toggleState(event); 
                }
            }
          });
    }

    // Attach event listeners to the methods of the ListItems class object
    #attachItemListEvents() {
        this.itemList.addEventListener('newItem', (result) => {
            if (result instanceof Item) {
                result.render();
                this.count++;
                this.setCounter();
            }
        });
        this.itemList.addEventListener('moveItem', (result) => {
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
        this.itemList.addEventListener('loadItems', (result) => {
            // We need to render the Items on the screen
            $.each (this.itemList.list, function ( index, item ) {
                item.render();
            });

            this.count = result;
            this.setCounter();
        });

    }

}
