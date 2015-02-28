var Reflux = require('reflux');
var TodoActions = require('./actions');
var TodoModel = require('./rest/todo').model;
var _ = require('lodash');

// some variables and helpers for our fake database stuff
var todoCounter = 0,
localStorageKey = "todos";

function getItemByID(list, id){
    return _.find(list, function(item) {
        return item.id === id;
    });
}

var TodoListStore = Reflux.createStore({
    // this will set up listeners to all publishers in TodoActions, using onKeyname (or keyname) as callbacks
    listenables: [TodoActions],
    onLoad: function() {
        console.log('On Load: ', arguments);
    },
    onLoadCompleted: function() {
        console.log('On Load Completed: ', arguments);
    },
    onLoadFailed: function() {
        console.log('On Load Failed: ', arguments);
    },
    onPut: function(id, newLabel) {
        var foundItem = getItemByID(this.list,id);
        if (!foundItem) {
            return;
        }
        foundItem.label = newLabel;
        this.updateList(this.list);
    },
    onCreateFailed: function(model) {
        console.log('Failed: ', model);
    },
    onCreateCompleted: function(model) {
        console.log('Completed: ', model);
    },
    onCreate: function(label) {
        console.log('On Create');
        this.updateList([new TodoModel({
            id: todoCounter++,
            created: new Date(),
            isComplete: false,
            label: label
        })].concat(this.list));
    },
    onDelete: function(id) {
        this.updateList(_.filter(this.list,function(item){
            return item.id !== id;
        }));
    },
    onToggleItem: function(id) {
        var foundItem = getItemByID(this.list, id);
        if (foundItem) {
            foundItem.isComplete = !foundItem.isComplete;
            this.updateList(this.list);
        }
    },
    onToggleAllItems: function(checked) {
        this.updateList(_.map(this.list, function(item) {
            item.isComplete = checked;
            return item;
        }));
    },
    onClearCompleted: function() {
        this.updateList(_.filter(this.list, function(item) {
            return !item.isComplete;
        }));
    },
    // called whenever we change a list. normally this would mean a database API call
    updateList: function(list){
        localStorage.setItem(localStorageKey, JSON.stringify(list));
        // if we used a real database, we would likely do the below in a callback
        this.list = list;
        this.trigger(list); // sends the updated list to all listening components (TodoApp)
    },
    // this will be called by all listening components as they register their listeners
    getInitialState: function() {
        var loadedList = localStorage.getItem(localStorageKey);
        if (!loadedList) {
            // If no list is in localstorage, start out with a default one
            this.list = [new TodoModel({
                id: todoCounter++,
                created: new Date(),
                isComplete: false,
                label: 'Rule the web'
            })];
        } else {
            this.list = _.map(JSON.parse(loadedList), function(item) {
                // just resetting the key property for each todo item
                item.id = todoCounter++;
                return item;
            });
        }
        return this.list;
    }
});

module.exports = TodoListStore;