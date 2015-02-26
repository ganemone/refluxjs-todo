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

var TodoItem = require('./components/TodoItem.jsx');
var TodoList = require('./components/TodoList.jsx');
var TodoHeader = require('./components/TodoHeader.jsx');
var TodoFooter = require('./components/TodoFooter.jsx');


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