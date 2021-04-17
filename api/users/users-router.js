const router = require('express').Router();
const Users = require('./users-model');

// ?? GET ==> /api/users ==> Return array of all users
router.get('/', (req, res, next) => {
	Users.findAll()
		.then((users) => {
			res.json(users);
		})
		.catch(next);
});

// ?? GET ==> /api/users/:id ==> Return user with specified ID
router.get('/:id', (req, res, next) => {
	Users.findById(req.param.id)
		.then((user) => {
			res.json(user);
		})
		.catch(next);
});
