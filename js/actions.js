var Reflux = require('reflux');
var TodoActions = require('./rest/todo').actions;
// Each action is like an event channel for one specific event. Actions are called by components.
// The store is listening to all actions, and the components in turn are listening to the store.
// Thus the flow is: User interaction -> component calls action -> store reacts and triggers -> components update

console.log('Actions: ', TodoActions);

var otherActions = Reflux.createActions([
    "toggleItem",     // called by button in TodoItem
    "toggleAllItems", // called by button in TodoMain (even though you'd think TodoHeader)
    "clearCompleted", // called by button in TodoFooter
]);

// TODO: Add Actions
for (var attrname in otherActions) {
  TodoActions[attrname] = otherActions[attrname];
}

module.exports = TodoActions;
