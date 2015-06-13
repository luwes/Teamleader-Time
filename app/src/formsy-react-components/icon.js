'use strict';

var React = require('react');

var Icon = React.createClass({

    requiredProps: {
        symbol: React.PropTypes.string.isRequired,
        className: React.PropTypes.string
    },

    defaultProps: {
        className: ''
    },

    render: function() {
        var className = 'glyphicon glyphicon-' + this.props.symbol + ' ' + this.props.className;
        return (
            <span className={className} aria-hidden="true"></span>
        );
    }

});

module.exports = Icon;
