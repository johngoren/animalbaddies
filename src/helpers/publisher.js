export default async function publisher(category) {
    let url = `http://www.animalbastards.com:3001/votes/${category}`;
    try {
        let response = await fetch(url, {
	    method: 'POST',
	    mode: 'cors'
	});
	let body = await response.text();
	return body;
    }
    catch(e) {
        console.log("fetch POST error");
        console.log(e);
    }
}
