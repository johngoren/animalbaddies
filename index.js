const express = require('express')
const app = express()
const path = require('path')
const port = 3000
const mysql = require('mysql')

app.set('view engine', 'pug')
app.use(express.static(__dirname + '/public'));
app.use("/dist", express.static(__dirname + '/dist'));
app.use("/styles", express.static(__dirname + '/styles'));

var DB_HOST = "mysql.gorenfeld.net";
var DB_USER = "animalstats";
var DB_PASSWORD = "reindeer";
var DB_DATABASE = "animalstats";

var pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE
})

app.get('/', (req, res) => {
    var stats = getStats();
    res.render('index', {stats: stats});
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

// Begin: DB

function getStats() {

    pool.getConnection(function(err, con) {

        if (err) {
            throw err;
        }
        else {
            con.query("SELECT * FROM stats", function(error, results, fields) {
                if (error) {
                    return error;
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
                    return percentages;
                }
            });
        }
    });

}

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


