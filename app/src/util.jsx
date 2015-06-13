
var $ = require('jquery');

class Util {
	
	static apiRequest(options) {

		var appSettings = JSON.parse(localStorage.getItem('settings'));
		if (appSettings) {

			var defaults = {
				type: 'POST',
				dataType: 'text',
				data: {
					api_group: appSettings.groupId,
					api_secret: appSettings.groupSecret,
				},
	      error: function(xhr, status, err) {
					console.error(options.url, status, err.toString());
	      }
			};

			var settings = $.extend(true, options, defaults);
			$.ajax('https://www.teamleader.be/api' + options.url, settings);
		}
	}

	static htmlEntities(string) {
		return string
			.replace(/&amp;/g, '&')
			.replace(/&#039;/g, "'");
	}

}

module.exports = Util;