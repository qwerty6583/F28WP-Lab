const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
	host : process.env.DATABASE_HOST,
	user : process.env.DATABASE_USER,
	password : process.env.DATABASE_PASSWORD,
	database : process.env.DATABASE
});

//function of login
exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if ( !email || !password) {
			return res.status(400).render('login', {
				message: 'Please provide an email and password'
			})
		}
		db.query('SELECT * FROM users WHERE email = ?', [email], async(error, results) => {
			console.log(results);
			if (!results || !(await bcrypt.compare(password, results[0].password)))
			{
				res.status(401).render('login', {
					message: 'Email or Password is incorrect'
				})
			} else {
				const id = results[0].id;
				const token = jwt.sign({id}, process.env.JWT_SECRET, {
					expiresIn: process.env.JWT_EXPIRES_IN
				});
				console.log("The token is: " + token);
				const cookieOptions = {
					expires: new Date(
						Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
					),
					httpOnly: true
				}

				res.cookie('jwt', token, cookieOptions);
				res.status(200).redirect("/profile");
			}
		});
	}
	catch (error) {
		console.log(error);
	}
};

//function of logout
exports.logout = async (req, res) => {
	res.cookie('jwt', 'logout', {
		expires: new Date(Date.now() + 2*1000),
		httpOnly: true
	});

	res.status(200).redirect('/');
};

//function of isloggedin
exports.isLoggedIn = async (req, res, next) => {
	console.log("isLoggedIn called");
	if (req.cookies.jwt) {
		try {
			const decoded = await promisify(jwt.verify)(req.cookies.jwt,
			process.env.JWT_SECRET
			);

			console.log(decoded);

			db.query('SELECT * FROM users WHERE id = ?', [decoded.id], async(error, result) => {
				console.log(result);
				if (!result) {
					return next();
				}

				req.user = result[0];
				console.log("user is ")
				console.log(req.user);
				return next();
			});
		} catch (error) {
			console.log(error);
			return next();
		}
	} else {
		next();
	}
}

//function of register
exports.register = (req, res) => {
	console.log(req.body);
	const {name, email, password, passwordConfirm} = req.body;
	db.query('SELECT email FROM users WHERE email = ?', [email], async (error, result) => {
		if (error) {
			console.log(error);
		}
		if (result.length > 0)
		{
			return res.render('register', {
				message: 'This email is already in use.'
			})
		}
		else if (password !== passwordConfirm)
		{
			return res.render('register', {
				message: 'Passwords do not match.'
			});
		}
		let hashedPassword = await bcrypt.hash(password, 8);
		
		db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, async (error, results) => {
			if (error) {
				console.log(error);
			}
			else {
				console.log(results);
				return res.render('register', {
					message: 'User registered'
				});
			}
		});

	});
};