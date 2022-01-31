export default async function importerStats() {
    let url = "http://www.animalbastards.com:3001/votes";
    try {
        let response = await fetch(url);
	    let body = await response.text();
        let arr = JSON.parse(body);
        console.log(arr);
	    return arr;
    }
    catch(e) {
        console.log("fetch error");
        console.log(e);
    }
}
