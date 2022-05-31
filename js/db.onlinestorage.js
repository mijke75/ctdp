export class DbOnlineStorage {

    constructor() {

    }

    initMethodology(methodologyId) {
        if(this.isMethodologyEmpty(methodologyId)){
            // Add code to create empty methodology
        }
    }

    deleteMethodology(methodologyId) {
        // Delete methodology and its items from database
    }

    isMethodologyEmpty(methodologyId) {
        // Check if methodology has items
    }

    loadItems(methodologyId) {
        // Load items from given methodology from database
    }

    saveItems(methodologyId, items) {
        // Save items from given methodology to database
    }

    loadItem(methodologyId, id) {
        // Load specific item from given methodology from database
    }

    deleteItem(methodologyId, id) {
        // Delete specific item from given methodology from database
    }

}