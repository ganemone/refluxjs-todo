var React = require('react');
var _ = require('lodash');
var Link = require('react-router').Link;
var TodoActions = require('../actions');
// Renders the bottom item count, navigation bar and clearallcompleted button
// Used in TodoApp
var TodoFooter = React.createClass({
    propTypes: {
        list: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    },
    render: function() {
        var nbrcompleted = _.filter(this.props.list, "isComplete").length;
        var nbrtotal = this.props.list.length;
        var nbrincomplete = nbrtotal - nbrcompleted;
        var clearButtonClass = React.addons.classSet({hidden: nbrcompleted < 1});
        var footerClass = React.addons.classSet({hidden: !nbrtotal });
        var completedLabel = "Clear completed (" + nbrcompleted + ")";
        var itemsLeftLabel = nbrincomplete === 1 ? " item left" : " items left";
        return (
            <footer id="footer" className={footerClass}>
                <span id="todo-count">
                    <strong>{nbrincomplete}</strong>
                    {itemsLeftLabel}
                </span>
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
                <button
                    id="clear-completed"
                    className={clearButtonClass}
                    onClick={TodoActions.clearCompleted}>{completedLabel}
                </button>
            </footer>
        );
    }
});

module.exports = TodoFooter;