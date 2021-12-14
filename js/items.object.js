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

        // BACKWARD COMPATIBILITY v0.5 *****************************************************
        // const storageList = JSON.parse(localStorage[this.root.methodology.id] || "{}");
        // BACKWARD COMPATIBILITY v0.5 *****************************************************

        // BACKWARD COMPATIBILITY v0.5 *****************************************************
        let storageList = JSON.parse(localStorage[this.root.methodology.id] || "{}");

        // There is a design process on-going from version 0.5 (which uses items in LocalStorage)
        if(this.root.methodology.id == 'ctdp' && 
            typeof localStorage['items'] != 'undefined' && 
            (typeof localStorage[this.root.methodology.id] == 'undefined' ||
             localStorage[this.root.methodology.id] == '{}') ) 
        {
            storageList = JSON.parse(localStorage['items'] || "{}");
            localStorage[this.root.methodology.id] = localStorage['items'] ;
            delete localStorage['items'];
        }
        // BACKWARD COMPATIBILITY v0.5 *****************************************************

        for (let id in storageList) {
            if (!storageList.hasOwnProperty(id)) continue;
            let listitem = storageList[id];
            if (storageList[id].phase == phaseId) {
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
            this.list[item.id] = JSON.stringify(item);
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