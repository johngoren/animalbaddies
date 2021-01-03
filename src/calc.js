import { BASTARD } from './constants';


/**
 * Calc
 * 
 * For mid-game animal stats screen and end stats
 */

export default class Calc {

  // Main method called by app
  calculate = (animals, votes) => {
    const animalsMarkedWithVotes = this.getReviewedAnimals(animals, votes);
    return this.getLikedTagsAndDislikedTags(animalsMarkedWithVotes);
  }

  getEndgameStats = (animals) => {
    const breakdownFamilies = this.breakdownFamilies(animals);
    const families = Object.keys(breakdownFamilies);
    return families.map( family => {
      const item = breakdownFamilies[family];

      if (item != null) {
        return {
          name: item.name,
          numTotal: item.numTotal,
          percentage: item.percentage
        }  
      }
      else {
        return null
      }

    });
  }

  getReviewedAnimals = (animals, votes) => {
      return votes.map( vote => {
        let animal = animals.filter( animal => {
          return animal.id === vote.id;
        })[0];
        animal.isBastard = vote.isBastard;
        return animal;
      });
  }

// Returns breakdown as a dictionary of objects, each with 
// numTotal (how many were voted on) and percentage (percentage rated bastard) and name
//

breakdownFamilies = (animals)=> {
  console.log(animals);
    const mammal = this.computeHowMuchWeDislikeTrait("Mammal", animals);
    const bird = this.computeHowMuchWeDislikeTrait("Bird", animals);
    const reptile = this.computeHowMuchWeDislikeTrait("Reptile", animals);
    const amphibian = this.computeHowMuchWeDislikeTrait("Amphibian", animals);
    const mollusc = this.computeHowMuchWeDislikeTrait("Mollusc", animals);
    const insect = this.computeHowMuchWeDislikeTrait("Insect", animals);

    return {
      mammal: mammal,
      bird: bird,
      reptile: reptile,
      amphibian: amphibian,
      mollusc: mollusc,
      insect: insect
    }
  }

  // For any trait, returns:
  // {
  //  name: name of trait
  //  numTotal: total number voted on,
  //  percentage: percentage rated bastard
  // }
  computeHowMuchWeDislikeTrait = (trait, animals) => { 
    const animalsWithTrait = animals.filter( animal => animal.tags.includes(trait) );
    const numTotal = animalsWithTrait.length;
    const dislikedAnimals = animalsWithTrait.filter( animal => animal.isBastard === BASTARD);

    if (dislikedAnimals.length < 1) {
      return null;
    }

    const percentage = dislikedAnimals.length / numTotal * 100;
    return {
      name: trait,
      numTotal: numTotal,
      percentage: Math.round(percentage)
    }
  }

  getLikedTagsAndDislikedTags = (animals) => {
    const notBastardsPile = this.filterToJustNotBastards(animals);
    const bastardsPile = this.filterToJustBastards(animals);

    const likedTags = this.mapToTagsAndVotes(notBastardsPile);
    const dislikedTags = this.mapToTagsAndVotes(bastardsPile);

    const rawBastardTags = Object.keys(dislikedTags);
    const rawNotBastardTags = Object.keys(likedTags);

    const filteredBastardTags = this.filterNumberOfTags(rawBastardTags);
    const filteredNotBastardTags = this.filterNumberOfTags(rawNotBastardTags);

    return {
      liked: filteredBastardTags,
      disliked: filteredNotBastardTags
    }
  }

  filterToJustBastards = (animals) => {
    if (animals.length > 0) {
      return animals.filter( animal => animal.isBastard === BASTARD );
    }
  }

  filterToJustNotBastards = (animals) => {
    if (animals.length > 0) {
      return animals.filter( animal => animal.isBastard !== BASTARD );
    }
  }

  filterNumberOfTags = (tags) => {
    return tags.slice(Math.max(tags.length - 9, 1));
  }

  mapToTagsAndVotes = (animals) => {
    let votesDict = {};

    for (const animal of animals) {
      const tags = animal.tags;
      for (const tag of tags) {
        if (tag in votesDict) {
          votesDict[tag] = votesDict[tag] + 1;
        }
        else {
          votesDict[tag] = 1;
        }
      }
    }

    return votesDict;
  }

  // Sort tags
  sortTags = (tags) => {
    if (tags == null) { return }

    return Object.keys(tags).map(function(key) {
      return [tags[key], key];
    }).sort();
  }


  // Get final bastard / not bastard tags from { slug : voteNum } objects
  getStandoutTags = (tagsDict) => {
    // const votesNumDict = this.getVotesNumDict(tagsDict);
    return Object.keys(tagsDict);

  }

  getVotesNumDict = (tagsDict) => {
    let votesNumDict = [];
    for (const tag of Object.keys(tagsDict)) {
      const voteNum = tagsDict[tag];
      votesNumDict[voteNum] = tag;
    }
  }

    // Begin endgame

    saveUserPercentile = () => {
	// TODO: Get user's percentile.
	// TODO: Get user's category (0 - 5)
	// TODO: Save to SQL
	// TODO: Be sure this is all try-catch in case our database is overloaded with users!	
    }

    getPercentileRecords = () => {
	// TODO: Get all rows from sql
	// TODO: Group them into 4 categories, each with a vote tally
	// TODO: How many users in each category?
	// TODO: You are in category x, based on what your percentage is
	// TODO: Thanks for playing.
    }
  // End endgame


}
