import request from 'supertest';
import { app } from '../../../src';
import mongoose from 'mongoose';
import User from '../../../src/models/User';

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();

let testUser;

before(async () => {
  const uri = await mongod.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Create a test user
  testUser = await User.create({
    name: 'Test User',
    email: 'testuser@test.com',
    password: 'password123',
  });
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

describe('POST /login', () => {
  it('should return a JWT token for a valid user', async () => {
    const res = await request(app)
      .post('users/login')
      .send({ email: 'testuser@test.com', password: 'password123' })
      .expect(200)
      .expect(res.status)
      .to.equal(200);
    expect(res.body).to.have.property('token');
    console.log('testUser', testUser);
  });

  it('should return an error for an invalid user', async () => {
    const res = await request(app).post('users/login').send({
      email: 'testuser@test.com',
      password: 'wrongpassword',
    });

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('message', 'Invalid email or password');
  });

  it('should return a JWT token when valid credentials are provided', async () => {
    const response = await request(app)
      .post('users/login')
      .send({ email: 'testuser@example.com', password: 'password' })
      .expect(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should return a 401 error when invalid credentials are provided', async () => {
    await request(app)
      .post('users/login')
      .send({ email: 'testuser@example.com', password: 'wrongpassword' })
      .expect(401);
  });
});
