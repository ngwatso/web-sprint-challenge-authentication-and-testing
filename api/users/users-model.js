const db = require('../../data/dbConfig');

function findAll() {
	return db('users').select('*').orderBy('id');
}

function findById(id) {
	return db('users').select('*').where({ id }).first();
}

function findBy(filter) {
	return db('users').select('*').where(filter).orderBy('id');
}

async function add({ username, password }) {
	let id;
	await db.transaction(async (trx) => {
		const [user_id] = await trx('users').insert({
			username,
			password,
		});
		id = user_id;
	});
	return findById(id);
}

module.exports = { findAll, findById, findBy, add };
