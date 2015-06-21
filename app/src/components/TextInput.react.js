
var React = require('react');

var TextInput = React.createClass({

	// getInitialState: function() {
	// 	return { value: '' };
	// },

	// componentWillReceiveProps: function(nextProps) {
	// 	this.setState({ value: nextProps.savedValue });
	// },

	// handleChange: function(event) {
	// 	this.setState({ value: event.target.value });
 //  },

	render: function() {
		//var value = this.state.value;
		return (
			<input 
				{...this.props}
				type="text" 
				className="form-control" 
				//value={value}
				//onChange={this.handleChange} 
			/>
		);
	}
});

module.exports = TextInput;