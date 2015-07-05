
import $ from 'jquery';

var gui = nodeRequire('nw.gui');
var window = gui.Window.get();


var isVisible = false;
var height = 0;
var width = 0;

function _toggle(e) {
	isVisible ? window.hide() : _show.apply(this, [e.x, e.y]);
	isVisible = !isVisible;
}

function _show(x, y) {
  window.moveTo(x - ($('.app').width() / 2) - 6, y);
  _fitWindowToContent();
  window.show();
  window.focus();
}

function _onWindowBlur() {
	window.hide();
	isVisible = false;
}

function _fitWindowToContent() {
	var hei = $('.app').height() + 100;
	var wid = $('.app').width() + 40;

	if (width != wid || height != hei) {
		window.resizeTo(wid, hei);
		width = wid;
		height = hei;
	}
}

export default class StatusBar {

	constructor() {

	  // if (!sessionStorage.initializedStatusBar) {
	  //   sessionStorage.initializedStatusBar = true;

	    var tray = new gui.Tray({
	        title: '',
	        icon: 'images/icon.png',
	        alticon: 'images/icon.png',
	        iconsAreTemplates: false
	    });
	    tray.on('click', _toggle);

	    window.on('blur', _onWindowBlur);

			(function animloop() {
				requestAnimationFrame(animloop);
				_fitWindowToContent();
			})();
	  //}
	}
}
