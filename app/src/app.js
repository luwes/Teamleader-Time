
var fs = nodeRequire('fs');

import Panel from './Panel';
import StatusBar from './StatusBar';
import MenuBar from './MenuBar';
import Routes from './Routes';

class App {

	constructor() {

		this.devMode = fs.existsSync('.dev') && 
										fs.readFileSync('.dev', {encoding: 'utf8'}) === '1';

		this.panel = new Panel(this);
		this.statusBar = new StatusBar(this.panel);
		this.menuBar = new MenuBar();
		this.routes = new Routes();
	}
}

export default (window.App = new App())