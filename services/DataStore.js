const Store = require("electron-store");

class DataStore extends Store {

    /**
     * Constructor functions
     * @param {*} settings 
     */
    constructor(settings){
        // same as new Store(settings)
        super(settings);

        //initialize with todo or empty array
        this.todos = this.get('todos') || [];

        // getting position
        this.poisition = this.get('position') || [];
    }

    /**
     * Function to save todos in to json file
     */
    saveTodos(){
        // save todos to json file
        this.set('todos', this.todos);

        // returning this allows method chaining
        return this;
    }

    /**
     * Function to get todos
     */
    getTodos(){
        // set objects todo to todos in json file
        this.todos = this.get('todos') || [];

        return this;
    }

    /**
     * Function to add todo in the exisiting
     * @param {*} todo 
     */
    addTodo (todo){
        // merge existing todos with the new todo
        this.todos = [...this.todos, todo]

        return this.saveTodos();
    }

    /**
     * Deleted the targeted todo
     * @param {*} id 
     */
    deleteTodo(id){
        
        // filter out the target todo
        this.todos = this.todos.filter(t => t.id != id)
        return this.saveTodos();
    }

    /**
     * Delete all todos
     * @param {*} todo 
     */
    deleteAllTodos(){
        // filter out the target todo
        this.todos = []

        return this.saveTodos();
    }

    /**
     * Update todo status
     * @param {*} id 
     */
    updateTodoStatus(id){
        let todoArray = [];
        this.todos.forEach((element, index) => {
            if(element.id == id) {
                this.todos[index]["isCompleted"] = !this.todos[index]["isCompleted"];
            }
        });
        return this.saveTodos();
    }

    /**
     * Function to save position in to json file
     */
    savePosition(){
        // save todos to json file
        this.set('position', this.position);

        // returning this allows method chaining
        return this;
    }

     /**
     * Function to add position in the exisiting
     * @param {*} position 
     */
    addPosition (position){
        // adding or updating position
        this.position = position

        return this.savePosition();
    }

    /**
     * Function to get todos
     */
    getPosition(){
        // get objects position to position in json file
        this.poisition = this.get('position') || [];

        return this.poisition;
    }
}

module.exports = DataStore;