    export function get() {
        try {
            const el = document.getElementById("bookmark");            
            const json = el.getAttribute("data-bookmark");
            const parse = JSON.parse(json);
            return parse.animal;   
        }
        catch(e) {
            console.log("No valid bookmark found.");
            return;
        }
  }

  export function getDeckWithRestoredBookmark(bookmark, animals) {
    if (bookmark == null) { return animals };
    let match = animals.filter(animal => animal.slug == bookmark);
    if (match.length === 0) {
      return animals;
    }
    let bookmarkedAnimal = match[0];
    let newDeck = animals.filter(animal => animal.slug != bookmark);
    newDeck.splice(0, 0, bookmarkedAnimal);
    return newDeck;
  }

  export function isValid(bookmark) {
    if (bookmark != null) {
      return true;
    }
    return false;
  }
