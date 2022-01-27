import React, { Component } from 'react';
import axios from 'axios';
import getImagePalette from 'image-palette-core';
import data from './animals.json';
import importerAnimals from './helpers/importerAnimals';
import shuffle from './helpers/shuffle';
import Navigation from './navigation';
import Controls from './controls';
import StatsInterlude from './stats';
import Welcome from './welcome';
import Endgame from './endgame';
import Dialog from './dialog';
import Facts from './facts';
import aboutContent from './aboutContent';
import tingle from 'tingle.js';
import DecisionAnimation from './decisionAnimation';
import Calc from './calc';
import * as bookmarks from './bookmarks';
import * as helpers from './helpers/helpers';

import { 
    BASTARD, 
    NOT_BASTARD
} from './constants';

const DEBUG_MODE = false;
const CARD_ARRIVAL = "flip-in-hor-bottom"
const CARD_DEPARTURE_RIGHT = "roll-out-right";
const CARD_DEPARTURE_LEFT = "roll-out-left";
const TRANSITION_DURATION = 1300;
const CARDS_BETWEEN_STATS = 6;
let NUM_QUESTIONS;

if (DEBUG_MODE) {
  NUM_QUESTIONS = 2;
}
else {
  NUM_QUESTIONS = 15;
}

const initialState = {
  animation: "flip-in-hor-bottom",
  backgroundColor: '#000',
  bookmarkMode: false,
  countBastard: 0,
  countNotBastard: 0,
  endgameMode: false,
  modalIsOpen: false,
  musicIsPlaying: false,
  muted: false,
  oldChoice: null,
  changedMind: null,
  currentIndex: 0,
  stats: null,
  statsInterludeIsOn: false,
  statsModeToggle: false,
  status: null,
  userStats: null,
  votes: [],
  welcomeMode: true
}


export default class App extends Component {

  constructor() {
    super();
    const bookmark = bookmarks.get();
    const animals = importerAnimals(data);
    this.state = initialState;
    if (bookmarks.isValid(bookmark)) {
      this.state.welcomeMode = false;
      const shuffled = shuffle(animals)
      const newDeck = bookmarks.getDeckWithRestoredBookmark(bookmark, shuffled);
      this.animals = newDeck;
    }
    else {
      this.animals = shuffle(animals);
    }
    this.setBackgroundColorForAnimal(0);
    this.setupModal();
    this.getStatsFromServer();
  }


  incrementCountForDecision = (isBastard) => {
    let { countNotBastard, countBastard } = this.state;
    isBastard === BASTARD ? countBastard++ : countNotBastard++;

    return this.setState({
      countBastard: countBastard,
      countNotBastard: countNotBastard
    })
  }

  madeChoice = (isBastard) => {
    let { changedMind, oldChoice } = this.state;
    let newChoice = (isBastard) ? BASTARD : NOT_BASTARD;

    if (oldChoice === null) {
      // User hasn't even expressed an initial reaction yet. Set our first one.
      return this.setState({
        oldChoice: newChoice
      })
    }

    // "This must be the user's second reaction, then."
    if (newChoice === oldChoice) {
      // User has considered the evidence and submits a final decision
      return this.segueToNextScreenWithDecision(newChoice)
    }    

    if (changedMind === true) {
      return this.segueToNextScreenWithDecision(newChoice)
    }

    if (newChoice !== oldChoice) {
      return this.setState({
        changedMind: true,
        oldChoice: newChoice
      })
    }
  }

  segueToNextScreenWithDecision = (isBastard)=> {
    let {currentIndex} = this.state;
    let {id} = this.animals[currentIndex];

    let newVote = {
      id: id,
      isBastard: isBastard
    };
    
    let oldVotes = this.state.votes;
    var newVotes = oldVotes;
    newVotes.push(newVote);
    this.postVoteToServer(newVote);
    this.incrementCountForDecision(isBastard);

    let normalCompletion = () => {
      this.setBackgroundColorForAnimal(currentIndex + 1);
      this.playSoundForDecision(isBastard);
      setTimeout( ()=> 
        this.setStateForNewAnimal(currentIndex + 1),
        TRANSITION_DURATION);
    }

    let statsCompletion = () => {
      this.calcStats();
      setTimeout( ()=>
        this.setStateForStatsInterlude(),
        TRANSITION_DURATION);
    }

    let cardDepartureAnimation = (isBastard === BASTARD) ? CARD_DEPARTURE_LEFT : CARD_DEPARTURE_RIGHT;
    let completion;

    if (this.shouldGoToStatsInterlude()) {
      completion = statsCompletion;
    }
    else {
      completion = normalCompletion;
    }  

    this.setState({
      animation: cardDepartureAnimation,
      decision: isBastard,
      status: "departure",
      votes: newVotes
    }, completion);
  }

  setBackgroundColorForAnimal = (index)=> {
    if (this.currentIndex > this.animals.length) {
      return;
    }
    
    if (index === null) {
      index = 0;
    }

    let animal = this.animals[index];
    let imageURL = helpers.buildImageURL(animal.slug);
    
    const img = new Image();
    img.src = imageURL;
    img.crossOrigin = "Anonymous";
      
    img.onload = () => {
      const palette = getImagePalette(img);
      const backgroundColor = palette.backgroundColor;
      return this.setState({
        backgroundColor: backgroundColor
      })
    }
  }

  setStateForNewAnimal(newIndex) {
    if (newIndex === NUM_QUESTIONS) {
      this.setState({
        endgameMode: true
      });
      return;
    }

    this.setState({
      animation: CARD_ARRIVAL,
      currentIndex: newIndex,
      changedMind: null,
      oldChoice: null,
      statsInterludeIsOn: false,
      status: "arrival"
    }, ()=> {
      this.setBackgroundColorForAnimal(newIndex);
    });

    this.updateUrlForNewAnimal(newIndex);
  }

  setStateForStatsInterlude() {
    this.setState({
      animation: CARD_ARRIVAL,
      statsInterludeIsOn: true,
      status: "stats",
    })
  }

 
  
  
  // MARK: Sounds

  playMusicIfNeeded = () => {
    if (this.state.muted) {
      return;
    }

    if (!this.state.musicIsPlaying) {
      document.getElementById("bossanova").play();
      this.setState({
        musicIsPlaying: true
      })
    }
  }

  playSoundForDecision = (isBastard)=> {
    if (this.state.muted) {
      return;
    }
    if (isBastard === BASTARD) {
      document.getElementById("audioBastard").play();
    }
  }

  stopMusic = () => {
    document.getElementById("bossanova").pause();
  }

  toggleSound = () => {
    if (this.state.muted === false) {
      this.stopMusic();
    }
    this.setState({
      muted: !this.state.muted
    })
  }


  // MARK: Welcome screen

  onClickStart = () => {
    this.setState({
      welcomeMode: false
    })
    this.updateUrlForNewAnimal(0);
  }
  

  // MARK: Modal 

  setupModal = () => {
    this.modal = new tingle.modal({
      footer: true,
      stickyFooter: false,
      closeMethods: ['overlay', 'button', 'escape'],
      closeLabel: "Close",
      cssClass: ['custom-class-1', 'custom-class-2'],
    });

    // set content
    this.modal.setContent(aboutContent);
  }

  modalClose = ()=> {
    this.modal.close();
  }

  modalOpen = ()=> {
    this.modal.open();
  }

  // MARK: Network

  postVoteToServer = (vote) => {
    let animalId = vote.id;
    let liked;
    if (vote.isBastard === "BASTARD") { liked = 0 } else { liked = 1 }
    axios.post('/vote/' + animalId + '/' + liked);
  }

  // MARK: Stats interlude

  calcStats = ()=> {
    const { animals } = this;
    const { statsModeToggle, votes } = this.state;
    const calculator = new Calc();

    if (animals != null && votes != null) {
      const stats = calculator.calculate(animals, votes);
      this.setState({
        stats: stats,
        statsModeToggle: !statsModeToggle
      }) 
    }
  }

  render() {
    const { 
      animation, 
      backgroundColor, 
      countBastard, 
      countNotBastard,
      currentIndex, 
      decision,
      endgameMode,
      modalIsOpen, 
      muted, 
      oldChoice,
      stats,
      statsInterludeIsOn, 
      statsModeToggle,
      status, 
      votes,
      welcomeMode } = this.state;

    const animals = this.animals;
    let animal = null;
    let imageURL = null;
    let Content = null;

    if (endgameMode === false) {
      animal = this.animals[currentIndex];
      imageURL = helpers.buildImageURL(animal.slug);  
    }

    if (endgameMode === true) {
      return (
          <div className="App flex">
          <div className="app-div endgame-card">
            <Endgame
              animals={animals}
              countBastard={countBastard}
              data={this.data}
              onReset={()=>helpers.onReset()}
              stats={this.state.userStats}
            />
          </div></div>
      )
    }

    if (welcomeMode === true) {
      return (
        <div className="App">
          <div className="app-div">
            <div className="flex">
              <Welcome
                onClick={this.onClickStart}
              />

            </div>
          </div>
        </div>
      )
    }

    if (statsInterludeIsOn === true) {

      Content = (
        <div className="flex">
        <StatsInterlude
          animals = {animals}
          animation={animation}
          currentIndex={this.state.currentIndex}
          handlerForNextAnimal={()=> {
          this.setState({
            animation: CARD_DEPARTURE_RIGHT,
            status: "finishedStats",
          });
          setTimeout( ()=> {
            this.setStateForNewAnimal(currentIndex + 1)
          }, TRANSITION_DURATION);
            
          }
         }
         stats={stats}
         statsModeToggle={statsModeToggle}
         votes={votes}
      />
      </div>
      )
    }
    else {
      Content = (
        <div className="flex">
           <Facts
              facts={animal.facts}
              choice={oldChoice}
              showOn={BASTARD}
            /> 
            <div className={"App-card " + animation}>
              <img src={imageURL}
                className="Animal-portrait" 
                alt={animal.name}
	        key={animal.name}
              />
              <p className="name">          
                {animal.name}
              </p>
              <div className="App-UI">
                <Controls 
                  animation={animation}
                  backgroundColor={backgroundColor}
                  className="App-controls" 
                  choice={oldChoice} handler={this.madeChoice}
                  playMusicIfNeeded={this.playMusicIfNeeded}
                  showOn={NOT_BASTARD}
                  />
              </div>
            </div>
            <Facts
              facts={animal.facts}
              choice={oldChoice}
              showOn={NOT_BASTARD}
            /> 
     </div>
      )
    }

    return (
      <div className="App">
         <audio 
            id="bossanova" 
            src="https://www.gorenfeld.net/media/animals/sounds/bossanova.mp3"
          />
          <audio
            id="audioBastard"
            src="https://www.gorenfeld.net/media/animals/sounds/elephant.wav"
            volume="0.5"
          />
        <DecisionAnimation
          status={status}
          choice={decision}
        />
        <div className="app-div"
          style={{backgroundColor: backgroundColor}}>
          <Dialog
            modalIsOpen={modalIsOpen}
          />
          {Content}
        </div>
        <Navigation
            countBastard={countBastard}
            countNotBastard={countNotBastard}
            currentIndex={currentIndex}
            muted={muted}
            toggleModal={this.modalOpen}
            toggleSound={this.toggleSound}
        />
      </div>
      
    );
  }

  // MARK: Helpers


  shouldGoToStatsInterlude = ()=> {
    const remainder = (this.state.currentIndex + 1) % CARDS_BETWEEN_STATS;
    return ((remainder === 0) ? true : false);
  }

  getResetState = ()=> {
    const oldMutedState = this.state.muted;
    let resetState = initialState;
    resetState["muted"] = oldMutedState;
    return resetState;
  }


  // MARK: Bookmark

  updateUrlForNewAnimal = (index) => {
    let animal = this.animals[index];
    let identifier = animal.slug;
    let title = animal.title;
    window.history.pushState({}, title, "/animals/" + identifier)
  }

  // MARK: Stats loading

  getStatsFromServer = () => {
    axios
        .get("https://animalbastards.com/stats")
        .then(response => {
            console.log(response);
            this.setState({ userStats: response.data });
        })      
  }


}