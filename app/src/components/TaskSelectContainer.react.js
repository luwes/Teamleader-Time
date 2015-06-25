
import React from 'react';

import { getMilestoneTasks, setMilestoneTask } from '../actions/TrackerActions';
import MilestoneStore from '../stores/MilestoneStore';
import MilestoneTaskStore from '../stores/MilestoneTaskStore';
import SelectInput from './SelectInput.react';
import TaskTypeSelectContainer from './TaskTypeSelectContainer.react';


var TaskSelectContainer = React.createClass({

	getTasksState: function() {
		return {
			tasks: MilestoneTaskStore.getMilestoneTasks(),
			task: MilestoneTaskStore.getMilestoneTask()
		}
	},

	getInitialState: function() {
		return this.getTasksState();
	},

  _onChange: function() {
    this.setState(this.getTasksState());
  },

  componentDidMount: function() {
  	getMilestoneTasks(MilestoneStore.getMilestone());
  	MilestoneTaskStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
  	MilestoneTaskStore.removeChangeListener(this._onChange);
  },

	handleChange: function(event) {
		var target = event.currentTarget;
		setMilestoneTask(target.value);
	},

	render: function() {
		if (this.state.tasks.length > 1 && this.state.task != -1) {
			return (
			  <div className="form-group">
			    <label className="col-xs-3 control-label" htmlFor="milestone-task">Todo</label>
			    <div className="col-xs-6">
						<SelectInput 
							id="milestone-task" 
							ref="milestoneTask" 
							value={this.state.task} 
							options={this.state.tasks} 
							onChange={this.handleChange} 
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
					  	<textarea id="task-description" ref="taskDescription" placeholder="Task description..." className="form-control" rows="3"></textarea>
					  </div>
					</div>
				</div>
			);
		}
	}
});

export default TaskSelectContainer;
