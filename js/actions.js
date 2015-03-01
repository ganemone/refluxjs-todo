var Reflux = require('reflux');
var TodoActions = require('./rest/todo').actions;
// Each action is like an event channel for one specific event. Actions are called by components.
// The store is listening to all actions, and the components in turn are listening to the store.
// Thus the flow is: User interaction -> component calls action -> store reacts and triggers -> components update

var otherActions = Reflux.createActions([
  "someOtherAction",     // called by button in TodoItem
]);

// TODO: Add Actions
for (var attrname in otherActions) {
  TodoActions[attrname] = otherActions[attrname];
}

console.log('Actions: ', TodoActions);

module.exports = TodoActions;
