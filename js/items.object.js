import { Item } from './item.object.js';
import { Modal } from './modal.object.js';

export class Items {

    // Create an event listener to all public methods in this class
    addEventListener(name, callback) {
        // This allows multiple events for the same name, that's not what we want here
        // if (!this.registeredEvents[name]) this.registeredEvents[name] = [];
        this.registeredEvents[name] = [];
        this.registeredEvents[name].push(callback);
    }

    // Tigger an event listener of a method in this class
    triggerEvent(name, args) {
        this.registeredEvents[name]?.forEach(fnc => fnc.apply(this, args));
    }

    constructor(parent) {
        // We always save the parent and the root class object so that we can find our way up if necessary
        this.parent = parent;
        this.root = parent.root;

        this.registeredEvents = {};

        this.list = {};
    }

    loadItems(phaseId) {
        // Load items from Storage
        let counter = 0;
        this.list = {};

        let items = this.root.db.loadItems(this.root.methodology.id);

        for (let id in items) {
            if (!items.hasOwnProperty(id)) continue;
            let listitem = items[id];
            if (items[id].phase == phaseId) {
                let item = new Item(this);
                item.load(id);
                this.list[item.id] = item;
                counter++;
            }
        };
        this.triggerEvent('loadItems', [counter]);
    }
    
    // Open the Modal so that the user can create an Item
    newItem() {
        const item = new Item(this);
        item.phase = this.parent.id;
        const modal = new Modal(this.root, this.parent, item);

        modal.addEventListener('submit', (item) => {
            this.list[item.id] = item;
            this.triggerEvent('newItem', [item]);
        });
    }

    // Move a created Item to this list
    moveItem(item) {
        this.list[item.id] = item;
        this.triggerEvent('moveItem', [true]);
    }

    // Remove an Item from this list
    removeItem(id) {
        delete this.list[id];
        this.triggerEvent('removeItem', [true]);
    }

}