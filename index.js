const express = require('express')
const app = express()
const port = 3000
const mysql = require('mysql')
const favicon = require('serve-favicon');
const args = require('minimist')(process.argv.slice(2))
const DEBUG_MODE = args['debug'] === 'true' ? true : false;

app.set('view engine', 'pug')
app.use(express.static(__dirname + '/public'));
app.use("/dist", express.static(__dirname + '/dist'));
app.use("/styles", express.static(__dirname + '/styles'));
app.use(favicon(__dirname + '/public/images/favicon.ico'));

var DB_HOST = "mysql.gorenfeld.net";
var DB_USER = "animalstats";
var DB_PASSWORD = "reindeer";
var DB_DATABASE = "animalstats";

var pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    connectionLimit: 9999
})

app.get('/', (req, res) => {
    getAllStats().then(function(stats) {
        res.render('index', { stats: stats });
    });
})

app.get('/votes', (req, res) => {
    getVotesFromDB(function(result) {
        res.send(result);
    })
})

app.get('/popularity', (req, res) => {
    getVotesFromDB(function(result) {
        res.send(getPopularityFromVotes(result));        
    })
});

app.listen(port, () => {
    console.log(`Animal Bastards listening at http://localhost:${port}`)
    if (DEBUG_MODE) {
        console.log('Debug mode is on');
    }
});


// Posts that the user ended up in category :category

app.post('/category/:category', (req, res) => {
    var category = req.params.category;

    if (DEBUG_MODE) {
        console.log(`User is posting that they ended up in category ${category}`)
    }

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
            con.release();
            if (error) {
                res.send(error);
            }
            else {
                res.send(results);
            }
        });

    });
})

// Records the user's vote for a particular animal

app.post('/vote/:id/:liked', (req, res) => {
    var unixDate = Math.floor(Date.now() / 1000);
    var id = req.params.id;
    var liked = req.params.liked;

    if (liked < 0 || liked > 1) {
        throw new Error("Invalid vote.");
    }

    pool.getConnection(function(err, con) {

        con.query("INSERT INTO votes VALUES(" + unixDate + ", " + id + "," + liked + ")", function(error, results, fields) {
            con.release();
            if (error) {
                res.send(error);
            }
            else {
                res.send(results);
            }
        });

    });
})




// Begin: DB

async function getAllStats() {
    try {
        var votes = await getVotesFromDB();
        var popularity = getPopularityFromVotes(votes);
        var stats = await getStatsFromDB();
    
        return {
            stats: stats,
            popularity: popularity
        }     
    }
    catch(e) {
        console.log(e);
    }
}

// Retrieves tally of users in categories

function getStatsFromDB(callback) {
    return new Promise(resolve => {

        pool.getConnection(function(err, con) {

            if (err) {
                throw err;
            }
            else {
                con.query("SELECT * FROM stats", function(error, results, fields) {
                    con.release();
                    if (error) {
                        resolve(error);
                    }
                    else {
                        var tallies = [0, 0, 0, 0, 0];
                        var percentages = [0, 0, 0, 0, 0];
                        var total = results.length;

                        for (i=0; i < total; i++) {
                            tallies[results[i].category - 1]++;
                        }

                        if (DEBUG_MODE) {
                            console.log("Category tallies:");
                            console.log(tallies);
                        }

                        resolve(tallies);
                    }
                });
            }
        });

    });

}


function getVotesFromDB() {
    return new Promise(resolve => {
        pool.getConnection(function(err, con) {

            if (err) {
                throw err;
            }
            else {
                con.query("SELECT * FROM votes", function(error, results, fields) {
                    con.release();
                    if (error) {
                        throw error;
                    }
                    else {
                        resolve(results);    
                    }
                });
            }    
        });
    });
}   

// TODO: If needed, either let the SQL shoulder this tally or limit number of votes

function getPopularityFromVotes(votes) {
    var likedMap = {};
    var dislikedMap = {};

    for (vote of votes) {
        var id = vote.id;
        var liked = vote.liked;

        if (liked === 1) {
            var newValue = likedMap[id] != null ? likedMap[id] + 1 : 1;
            likedMap[id] = newValue;
        }
        else {
            var newValue = dislikedMap[id] != null ? dislikedMap[id] + 1 : 1;
            dislikedMap[id] = newValue;
        }   
    }

    var best = Object.keys(likedMap).reduce(function(a, b) { return likedMap[a] > likedMap[b] ? a : b});
    var worst = Object.keys(dislikedMap).reduce(function(a, b) { return dislikedMap[a] > dislikedMap[b] ? a : b});

    return {
        liked: best,
        disliked: worst
    }
}
