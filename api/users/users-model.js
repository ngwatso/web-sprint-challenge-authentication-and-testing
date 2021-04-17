const db = require('../../data/dbConfig');

function findAll() {
	return db('users').select('*').orderBy('id');
}

function findById(id) {
	return db('users').select('*').where({ id }).first();
}

module.exports = { findAll, findById };
