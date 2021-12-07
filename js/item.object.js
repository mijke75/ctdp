import { Modal } from './modal.object.js';

export class Item {
    #parent;
    #root;

    constructor(parent, item) {
        // We always save the parent and the root class object so that we can find our way up if necessary
        this.#parent = parent;
        this.#root = parent.root;

        this.position = {};

        // If an Item is given in the constructor, load the properties of that Item in this class
        if (typeof item != 'undefined') {
            this.id = item.id;
            this.title = item.title;
            this.phase = item.phase;
            this.description = item.description;
            this.researchQuestion = item.researchQuestion;
            this.researchStrategy = item.researchStrategy;
            this.researchMethod = item.researchMethod;
            this.researchConclusions = item.researchConclusions;
            this.researchResults = item.researchResults;
            if(typeof item.position == 'undefined') {
                this.position = {top: 100, left: 100};
            }
            else {
                this.position = item.position;
            }
        }
        // If no Item is given, initialize the properties as empty.
        else {
            this.id = '';
            this.title = '';
            this.phase = '';
            this.description = '';
            this.researchQuestion = '';
            this.researchStrategy = '';
            this.researchMethod = '';
            this.researchConclusions = '';
            this.researchResults = '';
            // By default all Items are positioned at top 100 and left 100
            this.position = {top: 100, left: 100};
        }
    }

    // We use getter setter for parent and root, because we dont want the parent in the localStorage
    //      (JSON.stringify will fail in items.object.js/newItem eventListener)
    get parent() {
        return this.#parent;
    }
    set parent(obj) {
        this.#parent = obj;
    }
    get root() {
        return this.#root;
    }
    set root(obj) {
        this.#root = obj;
    }

    // We can load an Item by its id directly from the local storage
    load(id) {
        let items = JSON.parse(localStorage.items || "{}");
        let item = items[id];

        this.id = item.id;
        this.title = item.title;
        this.phase = item.phase;
        this.description = item.description;
        this.researchQuestion = item.researchQuestion;
        this.researchStrategy = item.researchStrategy;
        this.researchMethod = item.researchMethod;
        this.researchConclusions = item.researchConclusions;
        this.researchResults = item.researchResults;
        this.position = item.position;
    }

    // Render this element as an HTML element on the screen
    render() {
        // Different styles are applied when an Item has research conclusions or results
        let hasResults = '';
        if (this.researchConclusions !='' || this.researchResults != '') {
            hasResults = 'has-results';
        }

        // Ig this Item has a research strategy, show its matching image next to the title
        let imageElement = '';
        if (this.researchStrategy !='') {
            imageElement = '<img class="research-image" src="images/dotframework' + this.researchStrategy + '.png">';
        }
        let itemElement = $('<div class="item ' + hasResults + '" id="' + this.id + '" data-phase="' + this.phase + '" data-title="' + this.title + '">' + this.title + imageElement + '</div>');

        // Make the Item HTML element draggable so we can move it to another position in this phase or move it to a different phase
        itemElement.draggable({
            scroll: false,
            cursor: 'move',
            revert: 'invalid',
            item: this
        });
        // Always attach the click event after making it draggable, so it won't fire during dragging the Item
        itemElement.on('click', (e) => { this.open(); });
        itemElement.css(this.position);
        // Write the created Item HTML element to its defined phase HTML element
        itemElement.appendTo(this.#parent.parent.phaseElement);
    }

    // Open the Item into a modal, so we can edit it.
    open() {
        this.phase = this.#parent.parent.id;
        const modal = new Modal(this.#parent.parent, this);
    }

    // Save or update the Item
    save() {
        // New Items don't have an id yet, so we create one with a random number and today's date
        if (this.id == '') {
            this.id = Math.floor(Math.random() * 26) + Date.now();
            this.position = {top: 100, left: 100};
        }
        else {
            // If we update an existing Item, we need to update the HTML element as well
            let hasResults = '';
            if (this.researchConclusions !='' || this.researchResults != '') {
                $('#' + this.id).addClass('has-results');
            }
            else {
                $('#' + this.id).removeClass('has-results');
            }
            let newTitle = this.title;
            if (this.researchStrategy !='') {
                newTitle = this.title + '<img class="research-image" src="images/dotframework' + this.researchStrategy + '.png">';
            }
    
            $('#' + this.id).html(newTitle);
            $('#' + this.id).data('title', this.title);
        }

        // Next we have to save it in the local storage
        let items = JSON.parse(localStorage.items || "{}");
        items[this.id] = {
            id: this.id, 
            title: this.title, 
            phase: this.phase, 
            description: this.description, 
            researchQuestion: this.researchQuestion,
            researchStrategy: this.researchStrategy, 
            researchMethod: this.researchMethod, 
            researchConclusions: this.researchConclusions,
            researchResults: this.researchResults,
            position: this.position
        };

        localStorage.items = JSON.stringify(items);
        return items[this.id];
    }

    remove() {
        const confirmed = confirm('Are you sure you want to remove this item?');
        if (confirmed) {
            // Remove item from parent list
            this.#parent.removeItem(this.id);

            // remove item from storage
            let items = JSON.parse(localStorage.items || "{}");
            delete items[this.id];
            localStorage.items = JSON.stringify(items);

            // remove item from screen
            $('#' + this.id).remove();
        }
        return confirmed;
    }

}
