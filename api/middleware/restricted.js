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

		if (token) {
			jwt.verify(
				token,
				secret.jwtSecret,
				(err, decodedToken) => {
					if (err) {
						res.status(
							401
						).json({
							message:
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
				statusCode: 401,
				message: 'token required',
			});
		}
	} catch (err) {
		next({
			statusCode: 500,
			message: 'error validating credentials',
			...err,
		});
	}
};
