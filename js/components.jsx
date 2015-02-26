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

// Renders the todo list as well as the toggle all button
// Used in TodoApp
var TodoMain = React.createClass({
    propTypes: {
        list: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    },
    toggleAll: function(evt) {
        TodoActions.toggleAllItems(evt.target.checked);
    },
    render: function() {
        var filteredList;
        switch(this.props.showing){
            case 'all':
                filteredList = this.props.list;
                break;
            case 'completed':
                filteredList = _.filter(this.props.list,function(item){ return item.isComplete; });
                break;
            case 'active':
                filteredList = _.filter(this.props.list,function(item){ return !item.isComplete; });
        }
        var classes = React.addons.classSet({
            "hidden": this.props.list.length < 1
        });
        return (
            <section id="main" className={classes}>
                <input id="toggle-all" type="checkbox" onChange={this.toggleAll} />
                <label htmlFor="toggle-all">Mark all as complete</label>
                <ul id="todo-list">
                    {
                        filteredList.map(function(item) {
                            return (
                                <TodoItem
                                    label={item.label}
                                    isComplete={item.isComplete}
                                    key={item.key}/>
                            );
                        })
                    }
                </ul>
            </section>
        );
    }
});

// Renders the headline and the form for creating new todos.
// Used in TodoApp
// Observe that the toogleall button is NOT rendered here, but in TodoMain (it is then moved up to the header with CSS)
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
        return <TodoMain showing="completed" list={this.props.list} />
    }
});

var ActiveTodos = React.createClass({
    render: function() {
        return <TodoMain showing="active" list={this.props.list} />
    }
});

var AllTodos = React.createClass({
    render: function() {
        return <TodoMain showing="all" list={this.props.list} />
    }
});

// Renders the full application
// activeRouteHandler will always be TodoMain, but with different 'showing' prop (all/completed/active)
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