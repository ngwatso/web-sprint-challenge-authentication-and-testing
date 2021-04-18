const db = require('../data/dbConfig');
const server = require('./server');
const request = require('supertest');

// !! Write your tests here
test('sanity', () => {
	expect(true).toBe(true);
});

// ?? Server batch
describe('server', () => {
	// ?? Check environment
	test('we are in testing environment', () => {
		expect(process.env.NODE_ENV).toBe('testing');
	});
});

// ?? User ==> to be used in all tests
const user = { username: 'Leonardo', password: 'Davinci' };

// ?? Res ==> to be used in all tests
let res;
beforeEach(async () => {
	res = await request(server).post('/');
});

// ?? beforeAll ==> rollback(), latest() migration
beforeAll(async () => {
	await db.migrate.rollback();
	await db.migrate.latest();
});

// ?? afterAll ==> destroy() database
afterAll(async () => {
	await db.destroy();
});

// ?? Auth batch (/register, /login)
describe('authRouter', () => {
	// ?? beforeAll ==> truncate() users
	beforeAll(async () => {
		await db('users').truncate();
	});
	// ?? Register test batch
	describe('POST /register', () => {
		test('returns status 201 on successful registration', () => {
			return request(server)
				.post('/api/auth/register')
				.send(user)
				.then((res) => {
					console.log(
						'Register ==> test #1 ==> res.status =====> ',
						res.status
					);

					expect(res.status).toBe(201);
				});
		});

		test('returns status 422 if username or password missing', () => {
			return request(server)
				.post('/api/auth/register')
				.send({
					username: '',
					password: 'abc123',
				})
				.then((res) => {
					console.log(
						'Register ==> test #2 ==> res.status =====> ',
						res.status
					);
					expect(res.status).toBe(422);
				});
		});
	});

	// ?? Login test batch
	describe('POST /login', () => {
		test('returns status 200 on successful login', () => {
			return request(server)
				.post('/api/auth/login')
				.send(user)
				.then((res) => {
					console.log(
						'Login ==> test #1 ==> res.status =====> ',
						res.status
					);
					expect(res.status).toBe(200);
				});
		});

		test('returns status 401 with invalid credentials', () => {
			return request(server)
				.post('/api/auth/login')
				.send({
					username: 'Leonardo',
					password: 'invalid',
				})
				.then((res) => {
					console.log(
						'Login ==> test #2 ==> res.status =====> ',
						res.status
					);
					expect(res.status).toBe(401);
				});
		});
	});
});

// ?? User batch (/GET, /GET/:id)
describe('userRouter', () => {
	describe('GET findAll()', () => {
		test('returns status 200', () => {
			return request(server)
				.get('/api/users')
				.then((res) => {
					console.log(
						'findAll() ==> test #1 ==> res.status =====> ',
						res.status
					);
					expect(res.status).toBe(200);
				});
		});

		test('json type response', () => {
			return request(server)
				.get('/api/users')
				.then((res) => {
					console.log(
						'findAll() ==> test #2 ==> res.type =====> ',
						res.type
					);
					expect(res.type).toBe(
						'application/json'
					);
				});
		});
	});

	describe('/GET findById(id)', () => {
		test('returns status 200', () => {
			return request(server)
				.get('/api/users')
				.send('1')
				.then((res) => {
					console.log(
						'findById(id) ==> test #1 ==> res.status =====> ',
						res.status
					);
					expect(res.status).toBe(200);
				});
		});

		test('json type response', () => {
			return request(server)
				.get('/api/users')
				.send('1')
				.then((res) => {
					console.log(
						'findById(id) ==> test #2 ==> res.type =====> ',
						res.type
					);
					expect(res.type).toBe(
						'application/json'
					);
				});
		});
	});
});
