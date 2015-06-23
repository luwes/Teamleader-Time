
var $ = require('jquery');
var React = require('react');

var TrackerActions = require('../actions/TrackerActions');
var CustomerStore = require('../stores/CustomerStore');
var ProjectStore = require('../stores/ProjectStore');
var MilestoneStore = require('../stores/MilestoneStore');
var MilestoneTaskStore = require('../stores/MilestoneTaskStore');

var Util = require('../util');
var TextInput = require('./TextInput.react');
var SelectInput = require('./SelectInput.react');

var Tracker = React.createClass({

	handleTrackerSubmit: function(data) {
	},

	render: function() {
		return (
			<div className="tracker">
				<TrackerForm 
					onTrackerSubmit={this.handleTrackerSubmit} 
				/>
			</div>
		);
	}
});

var TrackerForm = React.createClass({

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
		);
	}
});

var ProjectSelectContainer = React.createClass({

	getProjectsState: function() {
		return {
			projects: ProjectStore.getProjects()
		}
	},

	getInitialState: function() {
		return this.getProjectsState();
	},

  _onChange: function() {
    this.setState(this.getProjectsState());
  },

  componentDidMount: function() {
  	TrackerActions.getProjects();
  	ProjectStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
  	ProjectStore.removeChangeListener(this._onChange);
  },

	handleChange: function(event) {
		var target = event.currentTarget;
		TrackerActions.setProject(target.value);
	},

	render: function() {
		return (
		  <div className="form-group">
		    <label className="col-xs-3 control-label" htmlFor="project">Project</label>
		    <div className="col-xs-6">
					<SelectInput id="project" ref="project" options={this.state.projects} onChange={this.handleChange} />
				</div>
			</div>
		);
	}
});

var MilestoneSelectContainer = React.createClass({

	getMilestonesState: function() {
		return {
			milestones: MilestoneStore.getMilestones(),
			milestone: MilestoneStore.getMilestone()
		}
	},

	getInitialState: function() {
		return this.getMilestonesState();
	},

  _onChange: function() {
    this.setState(this.getMilestonesState());
  },

  componentDidMount: function() {
  	TrackerActions.getMilestones(ProjectStore.getProject());
  	MilestoneStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
  	MilestoneStore.removeChangeListener(this._onChange);
  },

	handleChange: function(event) {
		var target = event.currentTarget;
		TrackerActions.setMilestone(target.value);
	},

	render: function() {
		if (this.state.milestones.length === 0) return null;
		return (
		  <div className="form-group">
		    <label className="col-xs-3 control-label" htmlFor="milestone">Milestone</label>
		    <div className="col-xs-6">
					<SelectInput 
						id="milestone" 
						ref="milestone" 
						value={this.state.milestone}
						options={this.state.milestones} 
						onChange={this.handleChange} 
					/>
				</div>
			</div>
		);
	}
});

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
  	TrackerActions.getMilestoneTasks(MilestoneStore.getMilestone());
  	MilestoneTaskStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
  	MilestoneTaskStore.removeChangeListener(this._onChange);
  },

	handleChange: function(event) {
		var target = event.currentTarget;
		TrackerActions.setMilestoneTask(target.value);
	},

	render: function() {
		if (this.state.tasks.length > 1) {
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

var TaskTypeSelectContainer = React.createClass({

	getInitialState: function() {
		return {
			taskTypes: []
		}
	},
	componentDidMount: function() {

		Util.apiRequest({
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

module.exports = Tracker
