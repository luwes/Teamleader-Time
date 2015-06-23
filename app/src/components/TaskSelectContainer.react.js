
var React = require('react');

var TrackerActions = require('../actions/TrackerActions');
var MilestoneStore = require('../stores/MilestoneStore');
var MilestoneTaskStore = require('../stores/MilestoneTaskStore');
var SelectInput = require('./SelectInput.react');
var TaskTypeSelectContainer = require('./TaskTypeSelectContainer.react');

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

module.exports = TaskSelectContainer;
