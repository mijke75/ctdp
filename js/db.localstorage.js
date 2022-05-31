export class DbLocalStorage {

    constructor() {

    }

    initMethodology(methodologyId) {
        if(this.isMethodologyEmpty(methodologyId)){
            localStorage.setItem(methodologyId,'{}');            
        }
    }

    deleteMethodology(methodologyId) {
        delete localStorage[methodologyId];
    }

    isMethodologyEmpty(methodologyId) {
        return (typeof localStorage[methodologyId] == 'undefined' || localStorage[methodologyId] == '{}');
    }

    loadItems(methodologyId) {
        return JSON.parse(localStorage[methodologyId] || "{}");
    }

    saveItems(methodologyId, items) {
        localStorage[methodologyId] = JSON.stringify(items);
    }

    loadItem(methodologyId, id) {
        let items = this.loadItems(methodologyId);
        return items[id];
    }

    deleteItem(methodologyId, id) {
        let items = this.loadItems(methodologyId);
        delete items[id];
        this.saveItems(methodologyId, items);
    }

}