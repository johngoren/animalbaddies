import React, { Component, Fragment, useEffect } from 'react';
import ScriptTag from 'react-script-tag';
import axios from 'axios';
import Chart from 'chart.js';
import drawChart from './drawChart.js';

export default class Endgame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0
        };
        this.data = this.getDataFromPage();
    }
      
    calculateDisliked(disliked) {
        return Math.floor(disliked / 15 * 100);
    }

    getCategoryNumFromPercentage(percentage) {
        if (percentage > 98) {
            return 5;
        }
        if (percentage > 66) {
            return 4;
        }
        if (percentage > 33) {
            return 3;
        }
        if (percentage > 0) {
            return 2;
        }
        return 1;
    }

    getCategoryTitle(categoryNum) {
        switch(categoryNum) {
            case 5:
                return "An Animal Alarmist"
                break;
            case 4:
                return "An Animal Critic"
                break;
            case 3:
                return "An Animal Agnostic"
                break;
            case 2:
                return "An Animal Advocate"
                break;
            case 1:
                return "A True Forest Friend"
                break;
            default:
                break;
        }
    }

    getCategoryBlurb(categoryNum) {
        switch(categoryNum) {
            case 5:
                return "You are horrified by everything you have just seen. But fear not! The animals you judge bear you no ill will. They only hope you'll remember them next time you hear a cherry-picked animal fact encouraging certain behaviour because it's 'natural'."
                break;
            case 4:
                return "You think most animals are utter bastards but sometimes a creature does something that gives you hope. This hope is precious and will lift your spirits if you ever find yourself bitten, relentlessly pursued and slowly yet agonisingly poisoned by a Komodo dragon."
                break;
            case 3:
                return "You think some animals are total bastards, but others are just doing the best they can with the biologically-determined physical and behavioural traits they have evolved. At least now you'll have some counter-arguments ready next time someone tells you certain human behaviour is inevitable because some animal out there does it too."
                break;
            case 2:
                return "Deep down, you know that animals can't be held to human moral standards, but sometimes an animal crosses the line and you just can't help but judge. This solid moral line will guide you through every Attenborough documentary from now on, and ruin the viewing experience for anyone who happens to be in the same room."
                break;
            case 1:
                return "Free from judgement and open to the idea that creatures can exist outside the moralistic hand-wringing of humanity, you are ready to ignore anyone who suggests humans are hard-wired to behave like lobsters. Or maybe you just thrive on cruelty. Either way, you are a beacon of hope to bastards everywhere. We salute you."
                break;
            default:
                break;
        }
    }
      
    proceed = ()=> {
        this.setState({
            page: this.state.page + 1
        })
    }


      // MARK: Statistical data from DB

    getDataFromPage = () => {
        return JSON.parse(document.getElementById("data").getAttribute("data-stats"));
    }

    render() {
        let {animals, countBastard} = this.props;
        let data = this.data.stats;
        let percentageDisliked = this.calculateDisliked(countBastard);
        let categoryNum = this.getCategoryNumFromPercentage(percentageDisliked);
        this.postCategoryToServer(categoryNum);
        
        let Content;
        let categoryTitle = this.getCategoryTitle(categoryNum);
        let categoryBlurb = this.getCategoryBlurb(categoryNum);   

        switch(this.state.page) {
            case 0:
                Content = (
                    <Fragment>
                        <p className="youdisliked">You are {categoryTitle}</p>
                        <CategoryChart
                            categoryNum={categoryNum}
                            stats={data.stats}
                        />
                        <button className="choiceButton notBastardButton wriggly brown" onClick={this.proceed}>
                            Next
                        </button>
                    </Fragment>
                )
                break;
            case 1:
                Content = (
                    <Fragment>
                        <p className="youdisliked">You are {categoryTitle}</p>
                        <p>{categoryBlurb}</p>
                        <button className="choiceButton notBastardButton wriggly brown" onClick={this.proceed}
                            >Next
                        </button>
                    </Fragment>
                )
                break;
            case 2:
                Content = (
                    <PopularityReport
                        animals={animals}
                        data={data.popularity}
                    />
                )
        }

        return (
            <Fragment>
                {Content}
            </Fragment>
        )
    }

    // MARK: Network

    postCategoryToServer = (category) => {
        axios.post('/category/' + category);
    }
   
}

class CategoryChart extends Component {
    componentDidMount() {
        var ctx = document.getElementById("myChart");
        drawChart(this.props.stats, ctx, Chart);
    }
    
    render() {
        return (
            <Fragment>
                <ScriptTag isHydrating={true} src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"/>
                <canvas id="myChart"/>
            </Fragment>
        )
    }
}


class PopularityReport extends Component {

    render() {
        var animals = this.props.animals;
        var mostLikedId = parseInt(this.props.data.liked);
        var leastLikedId = parseInt(this.props.data.disliked);

        var mostLikedAnimal = animals.filter(animal => animal.id === mostLikedId)[0];
        var leastLikedAnimal = animals.filter(animal => animal.id === leastLikedId)[0];

        var mostLikedName = mostLikedAnimal.name;
        var leastLikedName = leastLikedAnimal.name;

        var mostLikedSlug = mostLikedAnimal.slug;
        var leastLikedSlug = leastLikedAnimal.slug;

        var mostLikedImg = `/images/${mostLikedSlug}.jpg`;
        var leastLikedImg = `/images/${leastLikedSlug}.jpg`;
          
        return (

            <Fragment>
                <p class="youdisliked">Animal Bastards users have judged</p>
                <div class="winners">
                <div class="winner">
                        <p><img src={mostLikedImg} className="animalPortrait"/><br/>
                        <span className="winnerName">{mostLikedName}</span><span className="consensus"> is an utter bastard</span></p>
                </div>
                <div class="winner">
                            <p><img src={leastLikedImg} className="animalPortrait"/><br/>
                            <span className="winnerName">{leastLikedName}</span><span className="consensus"> is definitely <em>not</em> a bastard</span></p>
                </div>
                </div>
            
            <button className="choiceButton notBastardButton wriggly brown" onClick={() => window.location.reload()}>
                Play Again?
            </button>
            </Fragment>
        )
    }


}
 