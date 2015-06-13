
var $ = require('jquery');
var React = require('react');

var Util = require('./util');
var TextInput = require('./text-input');
var SelectInput = require('./select-input');

var Home = React.createClass({

	handleHomeSubmit: function(data) {
	},

	render: function() {
		return (
			<div className="home">
				<HomeForm 
					onHomeSubmit={this.handleHomeSubmit} 
				/>
			</div>
		);
	}
});

var HomeForm = React.createClass({

	getInitialState: function() {
		return {
			project: 0,
			milestone: 0,
			milestoneTask: 0,
			contactOrCompany: '',
			contactOrCompanyId: 0
		}
	},

	handleSubmit: function(e) {
		e.preventDefault();

	},

	handleProjectChange: function(project) {
		this.setState({
			project: parseInt(project),
			milestone: 0,
			milestoneTask: 0
		});

		Util.apiRequest({
			url: '/getProject.php',
			data: {
				project_id: project
			},
			success: (string) => {
				var data = JSON.parse(string);
				this.setState({
					contactOrCompany: data.contact_or_company,
					contactOrCompanyId: data.contact_or_company_id
				});
      }
		});
	},

	handleMilestoneChange: function(milestone) {
		this.setState({
			milestone: parseInt(milestone)
		});
	},

	handleMilestoneTaskChange: function(task) {
		this.setState({
			milestoneTask: parseInt(task)
		});
	},

	render: function() {

		console.log(this.state);

		return (
			<form className="form-horizontal" onSubmit={this.handleSubmit}>

				<ProjectSelectInputContainer onProjectChange={this.handleProjectChange} />

				<MilestoneSelectInputContainer project={this.state.project} onMilestoneChange={this.handleMilestoneChange} />

				<MilestoneTasksSelectInputContainer milestone={this.state.milestone} onMilestoneTaskChange={this.handleMilestoneTaskChange} />

			  <div className="btn-toolbar">
					<button type="submit" className="btn btn-primary btn-sm start-timer-btn">Start timer</button> 
				</div>
			</form>
		);
	}
});

var ProjectSelectInputContainer = React.createClass({

	getInitialState: function() {
		return {
			projects: []
		}
	},
	componentDidMount: function() {

		Util.apiRequest({
			url: '/getProjects.php',
			data: {
				amount: 100,
				pageno: 0
			},
			success: (string) => {
				console.log(string)
				//reviver function to rename keys
				var data = JSON.parse(string, function(prop, val) {
					switch (prop) {
						case 'id':
							this.value = val;
							return;
						case 'title':
							this.label = val;
							return;
						default:
							return val;
					}
				});
				
				if (data.length > 0) {
					data.unshift({ value: 0, label: 'Choose...' });
					this.setState({ projects: data });
				} else {
					this.setState({ projects: [] });
				}
      }
		});
	},
	handleChange: function(event) {
		var target = event.currentTarget;
		this.props.onProjectChange(target.value);
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

var MilestoneSelectInputContainer = React.createClass({

	getDefaultProps: function() {
		return {
			project: 0
		}
	},
	getInitialState: function() {
		return {
			milestones: []
		}
	},
	componentWillReceiveProps: function(nextProps) {
		if (this.props.project != nextProps.project) {

			Util.apiRequest({
				url: '/getMilestonesByProject.php',
				data: {
					project_id: nextProps.project
				},
				success: (string) => {
					//reviver function to rename keys
					var data = JSON.parse(string, function(prop, val) {
						switch (prop) {
							case 'id':
								this.value = val;
								return;
							case 'title':
								this.label = val;
								return;
							default:
								return val;
						}
					});

					for (var i = data.length-1; i >= 0; i--) {
						if (data[i].closed == 1) {
							data.splice(i, 1);
						}
					}

					if (data.length > 0) {
						this.setState({ milestones: data });
						this.props.onMilestoneChange(data[0].value);
					} else {
						this.setState({ milestones: [] });
					}
	      }
			});
		}
	},
	handleChange: function(event) {
		var target = event.currentTarget;
		this.props.onMilestoneChange(target.value);
	},
	render: function() {
		if (this.state.milestones.length === 0) return null;
		return (
		  <div className="form-group">
		    <label className="col-xs-3 control-label" htmlFor="milestone">Milestone</label>
		    <div className="col-xs-6">
					<SelectInput id="milestone" ref="milestone" options={this.state.milestones} onChange={this.handleChange} />
				</div>
			</div>
		);
	}
});

var MilestoneTasksSelectInputContainer = React.createClass({

	getDefaultProps: function() {
		return {
			milestone: 0
		}
	},
	getInitialState: function() {
		return {
			tasks: [],
			milestoneTask: 0
		}
	},
	componentWillReceiveProps: function(nextProps) {
		if (this.props.milestone != nextProps.milestone) {
			if (nextProps.milestone > 0) {

				Util.apiRequest({
					url: '/getTasksByMilestone.php',
					data: {
						milestone_id: nextProps.milestone
					},
					success: (string) => {
						//reviver function to rename keys
						var data = JSON.parse(string, function(prop, val) {
							switch (prop) {
								case 'id':
									this.value = val;
									return;
								case 'description':
									this.label = val;
									return;
								default:
									return val;
							}
						});

						for (var i = data.length-1; i >= 0; i--) {
							if (data[i].done == 1) {
								data.splice(i, 1);
							}
						}

						var appSettings = JSON.parse(localStorage.getItem('settings'));
						if (appSettings && appSettings.userName) {
							for (var i = data.length-1; i >= 0; i--) {
								if (data[i].owner_name != appSettings.userName) {
									data.splice(i, 1);
								}
							}
						}

						if (data.length > 0) {
							data.push({ value: 'new', label: 'New task...' });
							this.setState({
								tasks: data,
								milestoneTask: data[0].value
							});
							this.props.onMilestoneTaskChange(data[0].value);
						} else {
							this.setState({
								tasks: [],
								milestoneTask: 0
							});
							this.props.onMilestoneTaskChange(0);
						}
		      }
				});
			} else {
				this.setState({
					tasks: [],
					milestoneTask: 0
				});
				this.props.onMilestoneTaskChange(0);
			}
		}
	},
	handleChange: function(event) {
		var target = event.currentTarget;
		this.props.onMilestoneTaskChange(target.value);
	},
	render: function() {
		if (this.state.tasks.length > 1) {
			return (
			  <div className="form-group">
			    <label className="col-xs-3 control-label" htmlFor="milestone-task">Todo</label>
			    <div className="col-xs-6">
						<SelectInput id="milestone-task" ref="milestoneTask" value="{this.state.milestoneTask}" options={this.state.tasks} onChange={this.handleChange} />
					</div>
				</div>
			);
		} else {
			return (
				<div className="custom-task">
					<div className="form-group">
					  <label className="col-xs-3 control-label" htmlFor="task-type">Type</label>
					  <div className="col-xs-6">
					  	<TaskSelectInputContainer />
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

var TaskSelectInputContainer = React.createClass({

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

module.exports = Home
