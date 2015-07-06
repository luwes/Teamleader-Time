
import { apiRequest, rekey } from '../utils/Utils';
import AppDispatcher from '../dispatcher/AppDispatcher';
import SettingsConstants from '../constants/SettingsConstants';


export function saveSettings(data) {
  AppDispatcher.dispatch({
    type: SettingsConstants.SAVE_SETTINGS,
    data: data
  });
}

export function getUsers() {
	apiRequest({
		url: '/getUsers.php',
		success: (data) => {
	  	AppDispatcher.dispatch({
	  		type: SettingsConstants.RECEIVE_USERS,
	  		data: data
	  	});
    }
	});
}
