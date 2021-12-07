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

        this.list = [];
    }

    loadItems() {
        // Load items from Storage
        const storageList = JSON.parse(localStorage.items || "{}");
        for (let id in storageList) {
            if (!storageList.hasOwnProperty(id)) continue;
            let listitem = storageList[id];
            if (storageList[id].phase == this.parent.id) {
                let item = new Item(this, storageList[id]);
                item.render();
                this.list[item.id] = item;
            }
        };
        this.triggerEvent('loadItems');
    }
    
    // Open the Modal so that the user can create an Item
    newItem() {
        const item = new Item(this);
        item.phase = this.parent.id;
        const modal = new Modal(this.parent, item);

        modal.addEventListener('submit', (item) => {
            this.list[item.id] = JSON.stringify(item);
            item.render();
            this.triggerEvent('newItem', [true]);
        });
    }

    // Add a created Item to this list
    addItem(item) {
        this.list[item.id] = item;
        this.triggerEvent('addItem', [true]);
    }

    // Remove an Item from this list
    removeItem(id) {
        delete this.list[id];
        this.triggerEvent('removeItem', [true]);
    }

}