	var App = React.createClass({
  	render: function() {
    	return <Panel />;
  	}
	});

	var Panel = React.createClass({
  	render: function() {
    	return (
    		<div className="panel">
  				<Header />
  				<Content />
  			</div>
  		);
  	}
	});

	var TextInput = React.createClass({
  	render: function() {
    	return (
				<input type="text" className="textfield" />
			);
		}
	});

	var SelectInput = React.createClass({
		getInitialState: function() {
			return {
				options: []
			}
		},
		render: function() {
			var options = this.state.options.map(function(option) {
				return <option value={option.value}>{option.label}</option>;
			});

			return <select>{options}</select>;
		}
	});

	var Label = React.createClass({
  	render: function() {
    	return (
				<label>{this.props.name}</label>
			);
		}
	});

	var Header = React.createClass({
  	render: function() {
    	return (
	  		<header>
	  			<div className="headerext"></div>
	  		</header>
	  	);
	  }
	});

  var Content = React.createClass({
  	render: function() {
			return (
				<form>
					<div className="container main">

						<div className="row">
							<div className="two columns">
								<Label name="Project" />
							</div>
							<div className="ten columns">
								<SelectInput url="http://test.be" />
							</div>
						</div>

						<div className="row">
							<div className="two columns">
								<Label name="Milestone" />
							</div>
							<div className="ten columns">
								<select>
									<option value="">Front-end</option>
								</select>
							</div>
						</div>

						<div className="row">
							<div className="two columns">
								<Label name="Klant" />
							</div>
							<div className="ten columns">
								<TextInput />
							</div>
						</div>

						<div className="row">
							<div className="two columns">
								<Label name="Type" />
							</div>
							<div className="ten columns">
								<select>
									<option value="1">Administration</option>
								</select>
							</div>
						</div>

						<div className="row">
							<textarea placeholder="Taakbeschrijving...">
							</textarea>
						</div>

						<div className="row buttons">
							<button className="button-primary start-btn">
								Start timer
							</button> 
							<button className="cancel-btn">
								Annuleren
							</button>
						</div>
					</div>
				</form>
			);
		}
	});
	
	React.render(<App />, $('.app')[0]);