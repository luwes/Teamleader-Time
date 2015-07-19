
import React from 'react';
import { formatTime } from '../utils/Utils';

import CustomerStore from '../stores/CustomerStore';
import ProjectStore from '../stores/ProjectStore';
import MilestoneStore from '../stores/MilestoneStore';
import MilestoneTaskStore from '../stores/MilestoneTaskStore';
import TaskTypeStore from '../stores/TaskTypeStore';
import SettingsStore from '../stores/SettingsStore';
import TaskStore from '../stores/TaskStore';
import TimeStore from '../stores/TimeStore';

import ProjectSelectContainer from './ProjectSelectContainer.react';
import MilestoneSelectContainer from './MilestoneSelectContainer.react';
import TaskSelectContainer from './TaskSelectContainer.react';

import { startTimer, stopTimer } from '../actions/TrackerActions';


var Tracker = React.createClass({

		// return {
		// 	project: ProjectStore.getProjectId(),
		// 	milestone: MilestoneStore.getMilestoneId(),
		// 	milestoneTask: MilestoneTaskStore.getMilestoneTaskId(),
		// 	contactOrCompany: CustomerStore.getContactOrCompany(),
		// 	contactOrCompanyId: CustomerStore.getContactOrCompanyId(),
		// 	taskType: TaskTypeStore.getTaskTypeId(),
		// 	userId: SettingsStore.getUserId(),
		// 	description: MilestoneTaskStore.getMilestoneTaskDescription() || 
		// 								TaskStore.getTaskDescription()
		// }

	getTrackerState: function() {
		return {
			isTiming: TimeStore.isTiming(),
			seconds: TimeStore.getSecondsElapsed()
		};
	},

	getInitialState: function() {
		return this.getTrackerState();
	},

  _onChange: function() {
  	if (this.isMounted()) {
    	this.setState(this.getTrackerState());
    }
  },

  componentDidMount: function() {
  	TimeStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
  	TimeStore.removeChangeListener(this._onChange);
  },

	handleStart: function(e) {
		e.preventDefault();

		var now = Math.floor(Date.now() / 1000); //in seconds
		startTimer(now);
	},

	handleStop: function(e) {
		e.preventDefault();

		var now = Math.floor(Date.now() / 1000); //in seconds
		stopTimer(now);
	},

	render: function() {
		if (this.state.isTiming) {
			return (
				<div className="tracker">
					<form className="" onSubmit={this.handleStop}>

						<div className="tracker-meta">
							<div className="tracker-project">
								{ProjectStore.getProjectTitle() || 'Untitled project'}
							</div>
							<div className="tracker-task">
								{MilestoneTaskStore.getMilestoneTaskDescription() || TaskStore.getTaskDescription() || 'No task description'}
							</div>
						</div>

						<div className="form-group">
							<input 
								type="text" 
								className="form-control tracker-time" 
								disabled 
								value={formatTime(this.state.seconds)} 
							/>
						</div>

					  <div className="btn-toolbar">
							<button type="submit" className="btn btn-primary btn-sm stop-timer-btn">
								Stop timer
							</button> 
						</div>
					</form>
				</div>
			);
		} else {
			return (
				<div className="tracker">
					<form className="form-horizontal" onSubmit={this.handleStart}>

						<ProjectSelectContainer />
						<MilestoneSelectContainer />
						<TaskSelectContainer ref="taskSelectContainer" />

					  <div className="btn-toolbar">
							<button type="submit" className="btn btn-primary btn-sm start-timer-btn">
								Start timer
							</button> 
						</div>
					</form>
				</div>
			);
		}
	}
});

export default Tracker
