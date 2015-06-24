
import { apiRequest } from '../util';
import AppDispatcher from '../dispatcher/AppDispatcher';
import TrackerConstants from '../constants/TrackerConstants';


export function getProjects() {
	apiRequest({
		url: '/getProjects.php',
		data: {
			amount: 100,
			pageno: 0
		},
		success: (string) => {
			//console.log(string)
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
			}

	    AppDispatcher.dispatch({
	      type: TrackerConstants.RECEIVE_PROJECTS,
	      data: data
	    });
    }
	});
}

export function setProject(id) {
  AppDispatcher.dispatch({
    type: TrackerConstants.SET_PROJECT,
    id: id
  });
}

export function getProjectDetails(project) {
	if (project > 0) {
		apiRequest({
			url: '/getProject.php',
			data: {
				project_id: project
			},
			success: (string) => {
				var data = JSON.parse(string);
		    AppDispatcher.dispatch({
		      type: TrackerConstants.SET_CONTACT_OR_COMPANY,
		      option: data.contact_or_company,
		      id: data.contact_or_company_id
		    });
      }
		});
	}
}

export function getMilestones(project) {
	if (project > 0) {
		apiRequest({
			url: '/getMilestonesByProject.php',
			data: {
				project_id: project
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

		    AppDispatcher.dispatch({
		      type: TrackerConstants.RECEIVE_MILESTONES,
		      data: data
		    });
      }
		});

	}
}

export function setMilestone(id) {
  AppDispatcher.dispatch({
    type: TrackerConstants.SET_MILESTONE,
    id: id
  });
}

export function getMilestoneTasks(milestone) {

	if (milestone > 0) {

		apiRequest({
			url: '/getTasksByMilestone.php',
			data: {
				milestone_id: milestone
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
				}

		    AppDispatcher.dispatch({
		      type: TrackerConstants.RECEIVE_MILESTONE_TASKS,
		      data: data
		    });
      }
		});

	}
}

export function setMilestoneTask(id) {
  AppDispatcher.dispatch({
    type: TrackerConstants.SET_MILESTONE_TASK,
    id: id
  });
}


