import request from 'supertest';
import app from '../../../src/app';
import mongoose from 'mongoose';
import User from 'models/User';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = new MongoMemoryServer();
let testUser;
let server;

beforeAll(async () => {
  server = app.listen(4000); // start the server
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

afterAll(async (done) => {
  server.close(done); // close the server
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

describe('POST /login', () => {
  it('should return a JWT token for a valid user', async () => {
    const res = await request(server)
      .post('users/login')
      .send({ email: 'testuser@test.com', password: 'password123' })
      .expect(200)
      .expect(res.status)
      .to.equal(200);
    expect(res.body).to.have.property('token');
    console.log('testUser', testUser);
  });

  it('should return an error for an invalid user', async () => {
    const res = await request(server).post('users/login').send({
      email: 'testuser@test.com',
      password: 'wrongpassword',
    });

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('message', 'Invalid email or password');
  });

  it('should return a JWT token when valid credentials are provided', async () => {
    const response = await request(server)
      .post('users/login')
      .send({ email: 'testuser@example.com', password: 'password' })
      .expect(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should return a 401 error when invalid credentials are provided', async () => {
    await request(server)
      .post('users/login')
      .send({ email: 'testuser@example.com', password: 'wrongpassword' })
      .expect(401);
  });
});
