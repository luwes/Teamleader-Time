
import { where } from 'underscore';
import { apiRequest, rekey } from '../utils/Utils';
import AppDispatcher from '../dispatcher/AppDispatcher';
import TrackerConstants from '../constants/TrackerConstants';

import CustomerStore from '../stores/CustomerStore';
import ProjectStore from '../stores/ProjectStore';
import MilestoneStore from '../stores/MilestoneStore';
import MilestoneTaskStore from '../stores/MilestoneTaskStore';
import TaskTypeStore from '../stores/TaskTypeStore';
import SettingsStore from '../stores/SettingsStore';
import TaskStore from '../stores/TaskStore';
import TimeStore from '../stores/TimeStore';


export function saveTime(start, end) {

	var forType = CustomerStore.getContactOrCompany();
	var forId = CustomerStore.getContactOrCompanyId();
	if (MilestoneStore.getMilestoneId()) {
		forType = 'project_milestone';
		forId = MilestoneStore.getMilestoneId();
	}

	var relatedType = 'none';
	var relatedId;
	if (MilestoneTaskStore.getMilestoneTaskId()) {
		relatedType = 'task';
		relatedId = MilestoneTaskStore.getMilestoneTaskId();
	}

	apiRequest({
		url: '/addTimetracking.php',
		data: {
			description: MilestoneTaskStore.getMilestoneTaskDescription() || 
										TaskStore.getTaskDescription() || 'No task description',
			start_date: start,
			end_date: end,
			worker_id: SettingsStore.getUserId(),
			task_type_id: TaskTypeStore.getTaskTypeId(),

			for: forType,
			for_id: forId,
			invoiceable: 1,
			related_object_type: relatedType,
			related_object_id: relatedId
		},
		success: (json) => {
			console.log(json);
    }
	});
}

export function startTimer(timestamp) {
	if (ProjectStore.getProjectId()) {
	  AppDispatcher.dispatch({
	    type: TrackerConstants.START_TIMER,
	    timestamp: timestamp
	  });
	}
}

export function stopTimer(timestamp) {
  AppDispatcher.dispatch({
    type: TrackerConstants.STOP_TIMER,
    timestamp: timestamp
  });
}

export function getProjects() {
	apiRequest({
		url: '/getProjects.php',
		data: {
			show_active_only: 1,
			amount: 100,
			pageno: 0
		},
		success: (json) => {
			var data = where(json, { phase: 'active' });
			//console.log(data);
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
			success: (data) => {
				//console.log(data)
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
			success: (json) => {
				var data = where(json, { closed: 0 });
				//console.log(data);
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
			success: (json) => {
				var data = where(json, { done: 0 });
				//console.log(data);

				//todo: filter in view
				var appSettings = JSON.parse(localStorage.getItem('settings'));
				if (appSettings && appSettings.userName) {
					data = where(data, { owner_name: appSettings.userName });
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

export function getTaskTypes() {
	apiRequest({
		url: '/getTaskTypes.php',
		success: (data) => {
			//console.log(data)
	    AppDispatcher.dispatch({
	      type: TrackerConstants.RECEIVE_TASK_TYPES,
	      data: data
	    });
	  }
	});
}

export function setTaskType(id) {
  AppDispatcher.dispatch({
    type: TrackerConstants.SET_TASK_TYPE,
    id: id
  });
}

export function setTaskDescription(txt) {
  AppDispatcher.dispatch({
    type: TrackerConstants.SET_TASK_DESCRIPTION,
    txt: txt
  });
}








