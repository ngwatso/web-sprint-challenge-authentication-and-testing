const Users = require('./users-model');

async function checkPayload(req, res, next) {
	const credentials = req.body;
	const valid = Boolean(
		credentials.username &&
			credentials.password &&
			typeof credentials.password === 'string'
	);

	if (valid) {
		next();
	} else {
		res.status(422).json({
			message: 'username and password required',
		});
	}
}

async function checkUsernameExists(req, res, next) {
	try {
		let { username } = req.body;
		const user = await Users.findBy({ username }).first();
		if (!user) {
			next();
		} else {
			res.status(401).json({
				message: 'username taken',
			});
		}
	} catch (err) {
		next(err);
	}
}

module.exports = { checkPayload, checkUsernameExists };
