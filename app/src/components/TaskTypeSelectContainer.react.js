
import React from 'react';

import { apiRequest } from '../util';
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
			success: (string) => {
				//reviver function to rename keys
				var data = JSON.parse(string, function(prop, val) {
					switch (prop) {
						case 'id':
							this.value = val;
							return;
						case 'name':
							this.label = val;
							return;
						default:
							return val;
					}
				});
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
