
import $ from 'jquery';
import SettingsStore from '../stores/SettingsStore';
	
export function apiRequest(options) {

	var defaults = {
		type: 'POST',
		dataType: 'text',
		data: {},
    error: function(xhr, status, err) {
			console.error(options.url, status, err.toString());
    }
	};

	var appSettings = SettingsStore.getSettings();
	if (appSettings) {
		defaults.data = {
			api_group: appSettings.groupId,
			api_secret: appSettings.groupSecret
		};
	}

	var settings = $.extend(true, defaults, options);
	if (settings.data.api_group && settings.data.api_secret) {
		$.ajax('https://www.teamleader.be/api' + options.url, settings);
	}
}

export function htmlEntities(string) {
	return string
		.replace(/&amp;/g, '&')
		.replace(/&#039;/g, "'");
}
