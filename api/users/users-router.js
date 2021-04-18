const userRouter = require('express').Router();
const Users = require('./users-model');

// ?? GET ==> /api/users ==> Return array of all users
userRouter.get('/', (req, res, next) => {
	Users.findAll()
		.then((users) => {
			res.json(users);
		})
		.catch(next);
});

// ?? GET ==> /api/users/:id ==> Return user with specified ID
userRouter.get('/:id', (req, res, next) => {
	Users.findById(req.param.id)
		.then((user) => {
			res.json(user);
		})
		.catch(next);
});

module.exports = userRouter;
