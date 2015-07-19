
import $ from 'jquery';
import SettingsStore from '../stores/SettingsStore';
	
export function apiRequest(options) {

	var defaults = {
		type: 'POST',
		dataType: 'json',
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

export function rekey(arr, lookup) {
	for (var i = 0; i < arr.length; i++) {
		var obj = arr[i];
		for (var fromKey in lookup) {
			var toKey = lookup[fromKey];
			var value = obj[fromKey];
			if (value) {
				obj[toKey] = value;
				delete obj[fromKey];
			}
		}
	}
	return arr;
}

export function htmlEntities(string) {
	return string
		.replace(/&amp;/g, '&')
		.replace(/&#039;/g, "'");
}

export function formatTime(secs) {
	var h = parseInt(secs / 3600, 10);
	var m = parseInt((secs % 3600) / 60, 10);
	var s = parseInt((secs % 3600) % 60, 10);
	return (h === 0 ? '' : (h < 10 ? '0'+h+':' : h+':')) +
			(m < 10 ? '0'+m : ''+m) + ':' +
			(s < 10 ? '0'+s : ''+s);
}
