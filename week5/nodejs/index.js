const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config({path:'./.env'});
const app = express();
const db = mysql.createConnection({
	host : process.env.DATABASE_HOST,
	user : process.env.DATABASE_USER,
	password : process.env.DATABASE_PASSWORD,
	database : process.env.DATABASE
});

db.connect((error) => {
	if (error) {
		console.log(error);
	}
	else {
		console.log('MySQL connected...');
	}
});

const port = 5000;
app.get ("/", (req, res) => {
	res.send ("<h1>HOME PAGE</h1>");
});
app.listen (port, () => {
	console.log(`Server started on port ${port}`);
});