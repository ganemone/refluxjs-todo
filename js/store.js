var Reflux = require('reflux');
var TodoActions = require('./actions');
var _ = require('lodash');

// some variables and helpers for our fake database stuff

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
        console.log('Failed: ', arguments);
    },
    onCreateCompleted: function(model) {
        console.log('Completed: ', arguments);
    },
    onCreate: function(label) {
        console.log('On Create', arguments);
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
    // called whenever we change a list
    updateList: function(list){
        // if we used a real database, we would likely do the below in a callback
        this.list = list;
        this.trigger(list); // sends the updated list to all listening components (TodoApp)
    },
    // this will be called by all listening components as they register their listeners
    getInitialState: function() {
        return [];
    }
});

module.exports = TodoListStore;