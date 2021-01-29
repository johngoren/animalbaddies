import React, { Component, Fragment } from 'react';

export default class Welcome extends Component {

    render() {

        return (
            <Fragment>
            <div className="welcome-card">
                <p className="youDisliked">Welcome<br/>to Animal Bastards.</p>
                <p>In this game, you will be shown some animals and asked to judge them: bastard or not a bastard. 
First impressions matter so you will be asked to judge each animal on sight. Then, to help you decide, you will be shown some facts highlighting things those animals do that humans find particularly saintly or dastardly. This includes acts that some people may find upsetting or disturbing, though they only involve non-human animals.</p> 
<p>If you would still like to play, click the button.</p>
                <button className="choiceButton notBastardButton wriggly brown"        
                    onClick={this.props.onClick}>Start judging</button>
            </div>
            </Fragment>
        )
    }
}
