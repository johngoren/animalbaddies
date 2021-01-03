var React = require('react');
import App from 'dist/app';

function Index(props) {
	 document.appendChild(document.createElement('div'));
	 ReactDOM.render(<App />, document.getElementById('root'));
}

module.exports = Index;