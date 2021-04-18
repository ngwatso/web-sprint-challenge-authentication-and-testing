const jwt = require('jsonwebtoken');
const secret = require('../secrets');

module.exports = (req, res, next) => {
	/*
    * IMPLEMENT

    * 1- On valid token in the Authorization header, call next.

    * 2- On missing token in the Authorization header,
    *   the response body should include a string exactly as follows: "token required".

    * 3- On invalid or expired token in the Authorization header,
    *   the response body should include a string exactly as follows: "token invalid".
  */
	try {
		const token = req.headers.authorization?.split(' ')[1];
		// console.log('token =====> ', token);
		// console.log('headers =====> ', req.headers);
		// console.log('secret =====> ', secret.jwtSecret);

		if (token) {
			jwt.verify(
				token,
				secret.jwtSecret,
				(err, decodedToken) => {
					if (err) {
						next({
							apiCode: 401,
							apiMessage:
								'token invalid',
						});
					} else {
						req.decodedToken = decodedToken;
						next();
					}
				}
			);
		} else {
			next({
				apiCode: 401,
				apiMessage: 'token required',
			});
		}
	} catch (err) {
		next({
			apiCode: 500,
			apiMessage: 'error validating credentials',
			...err,
		});
	}
};
