const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('../api/auth/errorHandler');

const restrict = require('./middleware/restricted.js');

const authRouter = require('./auth/auth-router.js');
const jokesRouter = require('./jokes/jokes-router.js');
const userRouter = require('./users/users-router');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/jokes', restrict, jokesRouter); // !! only logged-in users should have access!
server.use('/api/users', userRouter);

server.use(errorHandler);

module.exports = server;
