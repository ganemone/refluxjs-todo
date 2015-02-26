/** @jsx React.DOM */
var React = require('react/addons');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
var Reflux = require('reflux');
var TodoActions = require('./actions');
var todoListStore = require('./store');
var _ = require('lodash');
var TodoItem = require('./components/TodoItem.jsx');
var TodoList = require('./components/TodoList.jsx');

// Renders the headline and the form for creating new todos.
// Used in TodoApp
// Observe that the toogleall button is NOT rendered here, but in TodoList
// (it is then moved up to the header with CSS)
var TodoHeader = React.createClass({
    handleValueChange: function(evt) {
        var text = evt.target.value;
        if (evt.which === 13 && text) { // hit enter, create new item if field isn't empty
            TodoActions.addItem(text);
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

// Renders the bottom item count, navigation bar and clearallcompleted button
// Used in TodoApp
var TodoFooter = React.createClass({
    propTypes: {
        list: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    },
    render: function() {
        var nbrcompleted = _.filter(this.props.list, "isComplete").length,
            nbrtotal = this.props.list.length,
            nbrincomplete = nbrtotal-nbrcompleted,
            clearButtonClass = React.addons.classSet({hidden: nbrcompleted < 1}),
            footerClass = React.addons.classSet({hidden: !nbrtotal }),
            completedLabel = "Clear completed (" + nbrcompleted + ")",
            itemsLeftLabel = nbrincomplete === 1 ? " item left" : " items left";
        return (
            <footer id="footer" className={footerClass}>
                <span id="todo-count"><strong>{nbrincomplete}</strong>{itemsLeftLabel}</span>
                <ul id="filters">
                    <li>
                        <Link activeClassName="selected" to="All">All</Link>
                    </li>
                    <li>
                        <Link activeClassName="selected" to="Active">Active</Link>
                    </li>
                    <li>
                        <Link activeClassName="selected" to="Completed">Completed</Link>
                    </li>
                </ul>
                <button id="clear-completed" className={clearButtonClass} onClick={TodoActions.clearCompleted}>{completedLabel}</button>
            </footer>
        );
    }
});

var CompletedTodos = React.createClass({
    render: function() {
        return <TodoList showing="completed" list={this.props.list} />
    }
});

var ActiveTodos = React.createClass({
    render: function() {
        return <TodoList showing="active" list={this.props.list} />
    }
});

var AllTodos = React.createClass({
    render: function() {
        return <TodoList showing="all" list={this.props.list} />
    }
});

// Renders the full application
// activeRouteHandler will always be TodoList, but with different 'showing' prop (all/completed/active)
var TodoApp = React.createClass({
    // this will cause setState({list:updatedlist}) whenever the store does trigger(updatedlist)
    mixins: [Reflux.connect(todoListStore,"list")],

    render: function() {
        return (
            <div>
                <TodoHeader />
                <RouteHandler list={this.state.list} />
                <TodoFooter list={this.state.list} />
            </div>
        );
    }
});

var routes = (
    <Route handler={TodoApp} path="/">
        <DefaultRoute name="All" handler={AllTodos} />
        <Route name="Completed" path="/completed" handler={CompletedTodos} />
        <Route name="Active" path="/active" handler={ActiveTodos} />
    </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('todoapp'));
});