const todoApp = document.querySelector('#app');


class Todo {
    constructor() {

        /**
         * init sessionStorage
         * 
         * only string is accepted => use JSON.stringify
         * need to be parsed later
         */

        this.h1 = null;
        this.input = null;
        this.button = null;
        // bind `this` system
        this.handleAdd = this.handleAdd.bind(this);

        /**
         * @NOTE
         * sessionStorage => delelte on close tab | window
         * localStorage => only on manual delete or using JS
         * 
         * both can't be delete on refresh page
         */
        // we will use sessionStorage
        this.fetchData = this.fetchData.bind(window);

        /**
         * to store data from sessionStorage
         */
        this.todoList = [];
        this.mainDiv = null;
        /**
         * Call func for first render of page
         */
        this.render();
    }

    /**
     * get data stored on sessionStorage
     * it's will be use each time we need render or update data
     */
    fetchData() {
        // get raw data
        const incomingData = this.sessionStorage.getItem('todoList');

        // parse
        const todoList = JSON.parse(incomingData);

        return todoList;
    }

    /**
     * reset all elt in maindiv
     * For Each changements we will reset view and rerender with render()
     */
    resetElement() {
        this.mainDiv.remove();
    }

    // rerender element for init and updating data
    render() {
        this.fetchData();

        // create div
        this.mainDiv = document.createElement('div');
        this.mainDiv.setAttribute('class', 'container')

        // create title
        this.h1 = document.createElement('h1');
        // configure h1
        this.h1.innerText = 'TODO App';

        // create input
        this.input = document.createElement('input');
        // configure input
        this.input.setAttribute('placeholder', 'Entrer une tâche');

        this.input.setAttribute('id', 'entry');

        // create button
        this.button = document.createElement('button');
        // configure button
        this.button.setAttribute('class', 'add');
        this.button.innerText = '+';
        this.button.addEventListener('click', this.handleAdd);

        // create list-todo ul
        this.ul = document.createElement('ul');

        // fetch data and Dom
        this.renderList();

        this.ul.childElementCount === 0 ? this.addEmptyNotif(this.ul) : null
        // init elt
        this.mainDiv.appendChild(this.h1);
        this.mainDiv.appendChild(this.input)
        this.mainDiv.appendChild(this.button)
        this.mainDiv.appendChild(this.ul);
        todoApp.appendChild(this.mainDiv);
    }
    
    /**
     * 
     * @param {htmlElement} parent 
     */
    addEmptyNotif(parent) {
        const div = document.createElement('div');
        div.setAttribute('class', 'empty');
        div.innerText = 'Pas de tâche disponible';
        parent.appendChild(div);
    }

    // Title word
    /**
     * 
     * @param {string} inputString 
     * @
     */
    toCapitalize(inputString) {
        const input = [...inputString];
        return input.reduce(
            /**
             * 
             * @param {array} newArr 
             * @param {row} current element of array
             * @param {int} index index of element
             */
            (newArr, current, index) => {
                index === 0 ? newArr.push(current.toUpperCase()) : newArr.push(current)
                return newArr;
            },[]).join('');
    }

    /**
     * 
     * @param {string} todo data form input
     */
    addElement(todo) {
        const array = this.fetchData();
        if (todo !== undefined) {
            array.push(this.toCapitalize(todo));
            window.sessionStorage.setItem('todoList', JSON.stringify(array))
        }
    }

    /**
     * Apply new records
     * 
     * @param {event} e current_event
     */
    handleAdd(e) {
        const inputValue = e.target.previousSibling.value;
        if (inputValue !== '') {
            this.addElement(inputValue);
            this.resetElement();
            this.render();
        }
    }

    /**
     * update data and rerender li
     * 
     * @param {event} e current_event
     */
    handleDelete = (e) => {
        const array = this.fetchData();
        const el = e.target.parentNode;
        const lis = document.querySelectorAll('li');
        lis.forEach((li,index)=>{
            if (li === el) {
                array.splice(index, 1);        
            }
        })
        window.sessionStorage.setItem('todoList', JSON.stringify(array))
        this.resetElement();
        this.render();
    }

    /**
     * Replace old todo name by new one from prompt
     * @param {event} e 
     */
    handleUpdateName = (e) => {
        const array = this.fetchData();
        // fetch prompt input
        const newName = prompt('Changer le nom de la tâche: ');
        // target parent
        if (newName !== '') {
            const parent = e.target.parentNode;
            // get all li to locate the match li
            const lis = document.querySelectorAll('li');
            // find match li
            lis.forEach((li, index) => {
                if (li === parent) {
                    /**
                     * if found then replace
                     */
                    array.splice(index, 1, this.toCapitalize(newName));
                }
            });
            window.sessionStorage.setItem('todoList', JSON.stringify(array))
            // renrender view
            this.resetElement();
            this.render();
        }
    }

    // rendering list
    renderList = () => {
        const array = this.fetchData();
        array.forEach((todo) => {
            const li = document.createElement('li');
            const span = document.createElement('span');
            const button = document.createElement('button');
            const buttonOpt = document.createElement('button');
            button.setAttribute('class', 'delete');
            buttonOpt.setAttribute('class', 'options');
            buttonOpt.innerHTML = `<div></div><div></div><div></div>`;
            button.innerText = 'x';
            button.addEventListener('click', this.handleDelete);
            buttonOpt.addEventListener('click', this.handleUpdateName);
            span.innerText = todo;
            li.append(span);
            li.append(buttonOpt);
            li.append(button);
            this.ul.appendChild(li);
        });
    };

}

// run app
const app = new Todo();
