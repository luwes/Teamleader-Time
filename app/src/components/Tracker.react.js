
import React from 'react';

import CustomerStore from '../stores/CustomerStore';
import ProjectStore from '../stores/ProjectStore';
import MilestoneStore from '../stores/MilestoneStore';
import MilestoneTaskStore from '../stores/MilestoneTaskStore';
import TaskTypeStore from '../stores/TaskTypeStore';
import SettingsStore from '../stores/SettingsStore';
import TaskStore from '../stores/TaskStore';

import ProjectSelectContainer from './ProjectSelectContainer.react';
import MilestoneSelectContainer from './MilestoneSelectContainer.react';
import TaskSelectContainer from './TaskSelectContainer.react';


var Tracker = React.createClass({

	getTrackerState: function() {
		return {
			project: ProjectStore.getProjectId(),
			milestone: MilestoneStore.getMilestoneId(),
			milestoneTask: MilestoneTaskStore.getMilestoneTaskId(),
			contactOrCompany: CustomerStore.getContactOrCompany(),
			contactOrCompanyId: CustomerStore.getContactOrCompanyId(),
			taskType: TaskTypeStore.getTaskTypeId(),
			userId: SettingsStore.getUserId(),
			description: MilestoneTaskStore.getMilestoneTaskDescription() || 
										TaskStore.getTaskDescription()
		}
	},

	getInitialState: function() {
		return this.getTrackerState()
	},

	handleSubmit: function(e) {
		e.preventDefault();

		console.log(this.getTrackerState());
	},

	render: function() {
		return (
			<div className="tracker">
				<form className="form-horizontal" onSubmit={this.handleSubmit}>

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
});

export default Tracker
