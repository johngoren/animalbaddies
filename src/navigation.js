import React, {Component} from 'react';

/**
 * Navigation
 * 
 * Menu bar
 */

export default class Navigation extends Component {

    render() {
        const {currentIndex} = this.props;
	const textIndex = parseInt(currentIndex) + 1;
	
        return (
            <ul className="nav">
                <li>
                    <a onClick={this.props.toggleModal} href="#">About</a>
                </li>           
                <li>
                    <a onClick={this.props.toggleSound} href="#">Mute</a>
                </li>
                <li className="count last">{textIndex}/15</li>     
            </ul>
        )
    }
}
