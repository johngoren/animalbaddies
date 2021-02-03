import React, { Component, Fragment } from 'react';
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
      
    calculateDislikedPercentage(disliked) {
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
        let {page} = this.state;
        let {animals, countBastard} = this.props;
        let data = this.data.stats;
        let percentageDisliked = this.calculateDislikedPercentage(countBastard);    // In test mode this may skew
        let categoryNum = this.getCategoryNumFromPercentage(percentageDisliked);
        if (page === 0) {
            this.postCategoryToServer(categoryNum);
        }
        
        let Content;
        let categoryTitle = this.getCategoryTitle(categoryNum);
        let categoryBlurb = this.getCategoryBlurb(categoryNum);   

        switch(page) {
            case 0:
                Content = (
                    <Fragment>
                        <h1>You Are {categoryTitle}</h1>
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
                        <h1>You are {categoryTitle}</h1>
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
                        onReset={this.props.onReset}
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
        try {
            axios.post('/category/' + category)
        }
        catch(e) {
            console.log(e);
        }
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
                <canvas id="myChart"/>
            </Fragment>
        )
    }
}


class PopularityReport extends Component {

    render() {
        const animals = this.props.animals;
        const mostLikedId = parseInt(this.props.data.liked);
        const leastLikedId = parseInt(this.props.data.disliked);

        const mostLikedAnimal = animals.filter(animal => animal.id === mostLikedId)[0];
        const leastLikedAnimal = animals.filter(animal => animal.id === leastLikedId)[0];

        const mostLikedName = mostLikedAnimal.name;
        const leastLikedName = leastLikedAnimal.name;

        const mostLikedSlug = mostLikedAnimal.slug;
        const leastLikedSlug = leastLikedAnimal.slug;

        const mostLikedImg = `/images/${mostLikedSlug}.jpg`;
        const leastLikedImg = `/images/${leastLikedSlug}.jpg`;
          
        return (

            <Fragment>
                <h1>Animal Bastards users<br/>have judged</h1>
                <div className="winners">
                <div className="winner">
                        <p><img src={mostLikedImg} className="animalPortrait"/><br/>
                        <span className="winnerName">{mostLikedName}</span><span className="consensus"> is an utter bastard</span></p>
                </div>
                <div className="winner">
                            <p><img src={leastLikedImg} className="animalPortrait"/><br/>
                            <span className="winnerName">{leastLikedName}</span><span className="consensus"> is definitely <em>not</em> a bastard</span></p>
                </div>
                </div>
            
            <button className="choiceButton notBastardButton wriggly brown" onClick={this.props.onReset}>
                Play again with new animals
            </button>
            </Fragment>
        )
    }

}

function testLog(stuff) {
    if (DEBUG_MODE) {
        console.log(stuff);
    }
}
 