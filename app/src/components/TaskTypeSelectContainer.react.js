
import React from 'react';

import { setTaskType, getTaskTypes } from '../actions/TrackerActions';
import TaskTypeStore from '../stores/TaskTypeStore';
import SelectInput from './SelectInput.react';


var TaskTypeSelectContainer = React.createClass({

	getTasksState: function() {
		return {
			taskTypes: TaskTypeStore.getTaskTypes(),
			taskType: TaskTypeStore.getTaskTypeId()
		}
	},

	getInitialState: function() {
		return this.getTasksState();
	},

  _onChange: function() {
  	if (this.isMounted()) {
    	this.setState(this.getTasksState());
    }
  },

  componentDidMount: function() {
  	getTaskTypes();
  	TaskTypeStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
  	TaskTypeStore.removeChangeListener(this._onChange);
  },

	handleChange: function(event) {
		var target = event.currentTarget;
		setTaskType(target.value);
	},

	render: function() {
		return (
			<SelectInput 
				id="task-type" 
				ref="taskType" 
				labelKey="name" 
				value={this.state.taskType} 
				options={this.state.taskTypes} 
				onChange={this.handleChange} 
			/>
		);
	}
});

export default TaskTypeSelectContainer;
