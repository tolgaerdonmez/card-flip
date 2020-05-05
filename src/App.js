import React, { Component } from "react";
import "./styles.css";
import "./mobile.css";

import CardBoard from "./components/CardBoard";

class App extends Component {
	render() {
		return (
			<>
				<div className="container">
					<CardBoard size={4} />
				</div>
				<a href="https://pixabay.com/" className="api-link" rel="noopener noreferrer" target="_blank">
					photos by Pixabay
				</a>
			</>
		);
	}
}

export default App;
