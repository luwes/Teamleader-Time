
var React = require('react');
var Util = require('./util');

var SelectInput = React.createClass({

	render: function() {

  	var optionNodes = this.props.options.map(function(option) {
      return (
      	<option key={option.value} value={option.value} >{Util.htmlEntities(option.label)}</option>
      );
  	});

		return (
	  	<select 
	  		{...this.props} 
	  		className="form-control" 
			>
	  		{optionNodes}
	  	</select>
		);
	}
});

module.exports = SelectInput;