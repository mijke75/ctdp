import { Modal } from './modal.object.js';

export class Item {

    constructor(item) {
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
            this.position = item.position;
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
            this.position = {};
        }
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

    render(phaseObj) {
        let hasResults = '';
        if (this.researchConclusions !='' || this.researchResults != '') {
            hasResults = 'has-results';
        }
        let imageElement = '';
        if (this.researchStrategy !='') {
            imageElement = '<img class="research-image" src="images/dotframework' + this.researchStrategy + '.png">';
        }
        let itemElement = $('<div class="item ' + hasResults + '" id="' + this.id + '" data-title="' + this.title + '">' + this.title + imageElement + '</div>');
        itemElement.draggable({
            scroll: false,
            containment: 'parent',
            stop: function (event, ui) {
                this.position = ui.position;
                let items = JSON.parse(localStorage.items || "{}");
                items[this.id].position = this.position;
                localStorage.items = JSON.stringify(items);
            }
        });
        itemElement.on('click', (e) => { this.open(phaseObj); });
        itemElement.css(this.position);
        itemElement.appendTo(phaseObj.phaseElement);
    }

    open(phaseObj) {
        this.phase = phaseObj.id;
        const modal = new Modal(phaseObj, this);
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

    remove(phaseObj) {
        const confirmed = confirm('Are you sure you want to remove this item?');
        if (confirmed) {
            // Remove item
            let items = JSON.parse(localStorage.items || "{}");
            delete items[this.id];
            $('#' + this.id).remove();
            localStorage.items = JSON.stringify(items);

            phaseObj.count--;
            phaseObj.setCounter();
            phaseObj.itemList.removeItem(this.id);
        }
        return confirmed;
    }

}
