const Users = require('./users-model');
const bcrypt = require('bcryptjs');

module.exports = async (req, res, next) => {
	try {
		let { username, password } = req.body;
		const user = await Users.findBy({ username }).first();
		if (user && bcrypt.compareSync(password, user.password)) {
			next();
		} else {
			res.status(401).json({
				message: 'invalid credentials',
			});
		}
	} catch (err) {
		next(err);
	}
};
