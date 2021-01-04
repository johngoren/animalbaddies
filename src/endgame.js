import React, { Component, Fragment, useEffect } from 'react';
import ScriptTag from 'react-script-tag';
import publisher from './helpers/publisher';
import Chart from 'chart.js';
import drawChart from './drawChart.js';

export default class Endgame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clickedContinue: false
        };
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
            clickedContinue: true
        })
    }

    reset() {
        window.location.reload();
    }

    render() {
        let {countBastard, stats} = this.props;
        let percentageDisliked = this.calculateDisliked(countBastard);
        let categoryNum = this.getCategoryNumFromPercentage(percentageDisliked);
        let categoryTitle = this.getCategoryTitle(categoryNum);
        let categoryBlurb = this.getCategoryBlurb(categoryNum);        

        let Content;
        if (!this.state.clickedContinue) {
            Content = (
            <Fragment>
                <p>You are {categoryTitle}</p>
                <CategoryChart
                    categoryNum={categoryNum}
                    stats={stats}
                />
                <button onClick={this.proceed}>
                    Next
                </button>
            </Fragment>
            )
        }
        else {
            Content = (
                <Fragment>
                    <p>You are {categoryTitle}</p>
                    <p>{categoryBlurb}</p>
                    <button onClick={this.reset}
                        >Play Again?
                    </button>
                </Fragment>
            )
        }

        return (
            <Fragment>
                {Content}
            </Fragment>
        )
    }
}

class CategoryChart extends Component {
    componentDidMount() {
        var ctx = document.getElementById("myChart");
        ctx.getContext("2d").height = 300;
	    drawChart(this.props.categoryNum, ctx, Chart);
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
