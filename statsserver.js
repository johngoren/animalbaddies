const express = require('express')
const mysql = require('mysql')
const app = express()
const port = 3001
const cors = require('cors')

app.use(cors())

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env

var pool = mysql.createPool({
	host: DB_HOST,
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_DATABASE
})

app.get('/votes', (req, res, next) => {
    // TODO: Get all stats.

    pool.getConnection(function(err, con) {
	
	if (err) {
	    throw err;
	}
	else {
	    con.query("SELECT * FROM stats", function(error, results, fields) {
		if (error) {
		    res.send(error);
		}
		else {
		    var tallies = [0, 0, 0, 0, 0]; 
		    var percentages = [0, 0, 0, 0, 0];
		    var total = results.length;
		    
		    for (i=0; i < total; i++) {
			tallies[results[i].category - 1]++;
		    }
		    
		    for (i=0; i < percentages.length; i++) {
			percentages[i] = tallies[i] / total * 100;
		    }
		    
		    res.send(percentages);
		}
	    });
	}
    });


})

app.post('/votes/:category', (req, res) => {
    var category = req.params.category;
    var unixDate = Math.floor(Date.now() / 1000);

    var intCategory = parseInt(category);
    if (intCategory == null) {
	throw new Error("Invalid category.");
    }

    if (intCategory < 0 || intCategory > 5) {
	throw new Error("Invalid category.");
    }

    pool.getConnection(function(err, con) {

        con.query("INSERT INTO stats VALUES(" + unixDate + ", " + category + ")", function(error, results, fields) {
                if (error) {
                    res.send(error);
                }
                else {
                    res.send(results);
                }
        });

    });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


