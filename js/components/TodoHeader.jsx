var React = require('react');
var TodoActions = require('../actions');
var TodoModel = require('../rest/todo').model;
// Renders the headline and the form for creating new todos.
// Used in TodoApp
// Observe that the toogleall button is NOT rendered here, but in TodoList
// (it is then moved up to the header with CSS)
var TodoHeader = React.createClass({
    handleValueChange: function(evt) {
        var text = evt.target.value;
        if (evt.which === 13 && text) { // hit enter, create new item if field isn't empty
            var todo = new TodoModel({
                label: text,
                isCompleted: false,
                created: new Date()
            });
            TodoActions.create(todo);
            evt.target.value = '';
        } else if (evt.which === 27) { // hit escape, clear without creating
            evt.target.value = '';
        }
    },
    render: function() {
        return (
            <header id="header">
                <h1>todos</h1>
                <input id="new-todo" placeholder="What needs to be done?" autoFocus onKeyUp={this.handleValueChange}/>
            </header>
        );
    }
});

module.exports = TodoHeader;