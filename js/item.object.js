import { Modal } from './modal.object.js';

export class Item {
    #parent;
    #root;

    constructor(parent, item) {
        this.#parent = parent;
        this.#root = parent.root;
        this.position = {};
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
            this.position = {top: 100, left: 100};
        }
    }

    // We use getter setter for parent and root, because we dont want the parent in the localStorage
    //      (JSON.stringify will fail in items.object/newItem eventListener)
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

    render() {
        let hasResults = '';
        if (this.researchConclusions !='' || this.researchResults != '') {
            hasResults = 'has-results';
        }
        let imageElement = '';
        if (this.researchStrategy !='') {
            imageElement = '<img class="research-image" src="images/dotframework' + this.researchStrategy + '.png">';
        }
        let itemElement = $('<div class="item ' + hasResults + '" id="' + this.id + '" data-phase="' + this.phase + '" data-title="' + this.title + '">' + this.title + imageElement + '</div>');
        itemElement.draggable({
            scroll: false,
            cursor: 'move',
            revert: 'invalid',
            item: this
        });
        itemElement.on('click', (e) => { this.open(); });
        itemElement.css(this.position);
        itemElement.appendTo(this.#parent.parent.phaseElement);
    }

    open() {
        this.phase = this.#parent.parent.id;
        const modal = new Modal(this.#parent.parent, this);
    }

    save() {
        if (this.id == '') {
            this.id = Math.floor(Math.random() * 26) + Date.now();
            this.position = {top: 100, left: 100};
        }
        else {
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
