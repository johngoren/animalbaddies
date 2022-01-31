import React, { Component, Fragment } from 'react';

export default class Sounds extends Component {
    
    render() {
        return (
            <Fragment>
                <audio 
                    id="music"
                    autoPlay="autoplay" 
                    src="/sounds/bossanova.mp3"
                    />
                <audio
                    id="audioBastard"
                    src="/sounds/elephant.wav"
                    volume="0.5"
                    />
                <audio
                    id="audioNotBastard"
                    src="/sounds/purr.aiff"
                    />
            </Fragment>
        )
    }
}

