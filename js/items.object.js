import { Item } from './item.object.js';
import { Modal } from './modal.object.js';

export class Items {

    addEventListener(name, callback) {
        // This allows multiple events for the same name, that's not what we want here
        // if (!this.registeredEvents[name]) this.registeredEvents[name] = [];
        this.registeredEvents[name] = [];
        this.registeredEvents[name].push(callback);
    }
    triggerEvent(name, args) {
        this.registeredEvents[name]?.forEach(fnc => fnc.apply(this, args));
    }

    constructor(parent) {
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

    addItem(item) {
        this.list[item.id] = item;
        this.triggerEvent('addItem', [true]);
    }

    removeItem(id) {
        delete this.list[id];
        this.triggerEvent('removeItem', [true]);
    }

}