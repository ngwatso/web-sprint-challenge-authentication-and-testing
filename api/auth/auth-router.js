const router = require('express').Router();
const jwt = require('jsonwebtoken');
const secret = require('../secrets');
const bcrypt = require('bcryptjs');
const {
	checkPayload,
	checkUsernameExists,
} = require('../users/users-middleware');
const Users = require('../users/users-model');

router.post(
	'/register',
	checkPayload,
	checkUsernameExists,
	async (req, res, next) => {
		// !! res.end('implement register, please!');
		/*
    * IMPLEMENT
    * You are welcome to build additional middlewares to help with the endpoint's functionality.
    * DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    * 1- In order to register a new account the client must provide `username` and `password`:
    *   {
    *     "username": "Captain Marvel", // must not exist already in the `users` table
    *     "password": "foobar"          // needs to be hashed before it's saved
    *   }

    * 2- On SUCCESSFUL registration,
    *   the response body should have `id`, `username` and `password`:
    *   {
    *     "id": 1,
    *     "username": "Captain Marvel",
    *     "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
    *   }

    * 3- On FAILED registration due to `username` or `password` missing from the request body,
    *   the response body should include a string exactly as follows: "username and password required".

    * 4- On FAILED registration due to the `username` being taken,
    *   the response body should include a string exactly as follows: "username taken".
  */
		const credentials = req.body;

		try {
			const hash = bcrypt.hashSync(
				credentials.password,
				8
			);
			credentials.password = hash;

			const user = await Users.add(credentials);
			const token = generateToken(user);
			res.status(201).json({ data: user, token });
		} catch (err) {
			console.log(err);
			next({
				apiCode: 500,
				apiMessage: 'error saving new user',
				...err,
			});
		}
	}
);

router.post('/login', checkPayload, async (req, res, next) => {
	// !! res.end('implement login, please!');
	/*
    * IMPLEMENT
    * You are welcome to build additional middlewares to help with the endpoint's functionality.

    * 1- In order to log into an existing account the client must provide `username` and `password`:
    *   {
    *     "username": "Captain Marvel",
    *     "password": "foobar"
    *   }

    * 2- On SUCCESSFUL login,
    *   the response body should have `message` and `token`:
    *   {
    *     "message": "welcome, Captain Marvel",
    *     "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
    *   }

    * 3- On FAILED login due to `username` or `password` missing from the request body,
    *   the response body should include a string exactly as follows: "username and password required".

    * 4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
    *   the response body should include a string exactly as follows: "invalid credentials".
  */
	const { username, password } = req.body;

	try {
		const [user] = await Users.findBy({ username: username });
		if (user && bcrypt.compareSync(password, user.password)) {
			const token = generateToken(user);
			res.status(200).json({
				message: `welcome, ${user.username}`,
				token: token,
			});
		} else {
			next({
				apiCode: 401,
				apiMessage: 'invalid credentials',
			});
		}
	} catch (err) {
		next({
			apiCode: 500,
			apiMessage: 'error logging in',
			...err,
		});
	}
});

function generateToken(user) {
	const payload = {
		subject: user.id,
		username: user.username,
	};
	const options = {
		expiresIn: '1 day',
	};
	const token = jwt.sign(payload, secret.jwtSecret, options);

	return token;
}

module.exports = router;
