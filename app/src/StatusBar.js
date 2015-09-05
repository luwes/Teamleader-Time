
var gui = nodeRequire('nw.gui');

export default class StatusBar {

	constructor(panel) {

    this.tray = new gui.Tray({
        title: '',
        icon: 'images/icon@2x.png'
    });
    this.tray.on('click', panel.toggle);
	}
}
