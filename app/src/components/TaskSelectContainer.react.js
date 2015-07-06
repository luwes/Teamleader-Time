
import React from 'react';
import { clone } from 'underscore';

import { getMilestoneTasks, setMilestoneTask, setTaskDescription } from '../actions/TrackerActions';
import MilestoneStore from '../stores/MilestoneStore';
import MilestoneTaskStore from '../stores/MilestoneTaskStore';
import TaskStore from '../stores/TaskStore';
import SelectInput from './SelectInput.react';
import TaskTypeSelectContainer from './TaskTypeSelectContainer.react';


var TaskSelectContainer = React.createClass({

	getTasksState: function() {
		return {
			tasks: MilestoneTaskStore.getMilestoneTasks(),
			task: MilestoneTaskStore.getMilestoneTaskId(),
			description: TaskStore.getTaskDescription()
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
  	getMilestoneTasks(MilestoneStore.getMilestoneId());
  	MilestoneTaskStore.addChangeListener(this._onChange);
  	TaskStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
  	MilestoneTaskStore.removeChangeListener(this._onChange);
  	TaskStore.removeChangeListener(this._onChange);
  },

	handleMilestoneTaskChange: function(event) {
		var target = event.currentTarget;
		setMilestoneTask(target.value);
	},

	handleTaskDescriptionChange: function(event) {
		setTaskDescription(event.target.value);
	},

	render: function() {
		if (this.state.tasks.length > 0 && this.state.task != -1) {

			var tasks = clone(this.state.tasks);
			tasks.push({ id: -1, description: 'New task...' });

			return (
			  <div className="form-group">
			    <label className="col-xs-3 control-label" htmlFor="milestone-task">Todo</label>
			    <div className="col-xs-6">
						<SelectInput 
							id="milestone-task" 
							ref="milestoneTask" 
							labelKey="description" 
							value={this.state.task} 
							options={tasks} 
							onChange={this.handleMilestoneTaskChange} 
						/>
					</div>
				</div>
			);
		} else {
			return (
				<div className="custom-task">
					<div className="form-group">
					  <label className="col-xs-3 control-label" htmlFor="task-type">Type</label>
					  <div className="col-xs-6">
					  	<TaskTypeSelectContainer />
					  </div>
					</div>
					<div className="form-group">
					  <div className="col-xs-12">
					  	<textarea 
					  		id="task-description" 
					  		placeholder="Task description..." 
					  		className="form-control" 
					  		rows="3" 
					  		value={this.state.description} 
					  		onChange={this.handleTaskDescriptionChange} 
					  	/>
					  </div>
					</div>
				</div>
			);
		}
	}
});

export default TaskSelectContainer;
