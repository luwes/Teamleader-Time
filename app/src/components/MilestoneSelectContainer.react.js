
var React = require('react');

var TrackerActions = require('../actions/TrackerActions');
var ProjectStore = require('../stores/ProjectStore');
var MilestoneStore = require('../stores/MilestoneStore');
var SelectInput = require('./SelectInput.react');

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

module.exports = MilestoneSelectContainer;