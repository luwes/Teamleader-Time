
import React from 'react';
import { htmlEntities } from '../utils/Utils';


var SelectInput = React.createClass({

	render: function() {

  	var optionNodes = this.props.options.map(function(option) {
      return (
      	<option key={option.value} value={option.value} >{htmlEntities(option.label)}</option>
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