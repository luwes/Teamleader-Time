
var React = require('react');

var CustomerStore = require('../stores/CustomerStore');
var ProjectStore = require('../stores/ProjectStore');
var MilestoneStore = require('../stores/MilestoneStore');
var MilestoneTaskStore = require('../stores/MilestoneTaskStore');

var ProjectSelectContainer = require('./ProjectSelectContainer.react');
var MilestoneSelectContainer = require('./MilestoneSelectContainer.react');
var TaskSelectContainer = require('./TaskSelectContainer.react');

var Tracker = React.createClass({

	getTrackerState: function() {
		return {
			project: ProjectStore.getProject(),
			milestone: MilestoneStore.getMilestone(),
			milestoneTask: MilestoneTaskStore.getMilestoneTask(),
			contactOrCompany: CustomerStore.getContactOrCompany(),
			contactOrCompanyId: CustomerStore.getContactOrCompanyId()
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
					<TaskSelectContainer />

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

module.exports = Tracker
