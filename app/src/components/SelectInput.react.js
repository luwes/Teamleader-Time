
import React from 'react';
import { htmlEntities } from '../utils/Utils';


var SelectInput = React.createClass({

	getDefaultProps: function() {
		return {
			valueKey: 'id',
			labelKey: 'title'
		}
	},

	render: function() {

  	var optionNodes = this.props.options.map(option => {
  		var value = option[this.props.valueKey];
  		var label = option[this.props.labelKey];
      return (
      	<option key={value} value={value}>
      		{htmlEntities(label)}
      	</option>
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

export default SelectInput;