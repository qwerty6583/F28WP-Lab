const mysql = require('mysql');


const db = mysql.createConnection({
	host : process.env.DATABASE_HOST,
	user : process.env.DATABASE_USER,
	password : process.env.DATABASE_PASSWORD,
	database : process.env.DATABASE
});

exports.register = (req, res)=>{
	console.log(req.body);
	const {name, email, password, passwordConfirm} = req.body;
	db.query('SELECT email FROM users WHERE email = ?')

	res.send("form submitted");
};