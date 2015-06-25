
import React from 'react';

import { apiRequest, rekey } from '../utils/Utils';
import SelectInput from './SelectInput.react';


var TaskTypeSelectContainer = React.createClass({

	getInitialState: function() {
		return {
			taskTypes: []
		}
	},
	componentDidMount: function() {

		apiRequest({
			url: '/getTaskTypes.php',
			success: (options) => {
				var data = rekey(options, { id: 'value', name: 'label' });
				this.setState({ taskTypes: data });
      }
		});
	},
	render: function() {
		return (
			<SelectInput id="task-type" ref="taskType" options={this.state.taskTypes} />
		);
	}
});

export default TaskTypeSelectContainer;
