import mysql from 'mysql';


export default class DbManager {

	connect = () => {
		this.con = mysql.createConnection({
			host: DB_HOST,
			user: DB_USER,
			password: DB_PASSWORD
		})

		this.con.connect(function(err) {
			if (err) throw err;
			console.log("Connected!")
		});
	}

    save = (category) => {
		this.con.query("INSERT INTO Stats (" + category + ")", (err) => {
			if (err) throw err;
		});
	}

    loadAll = () => {
		this.con.query("SELECT * FROM Stats", (err) => {
			if (err) throw err;
			// TODO: Do stuff with it
			// TODO: Return all rows (categories)
			// TODO: Tally rows
		});
	}

}
