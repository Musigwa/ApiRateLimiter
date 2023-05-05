import request from 'supertest';
import app from '../../../src/app';
import mongoose from 'mongoose';
import User from 'models/User';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { testingBehavior } from 'utils';

let testUser;

beforeAll(async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);

  // Create a test user
  testUser = await User.create({
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser@test.com',
    password: 'password123',
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  // await mongod.stop();
});

describe('POST /login', () => {
  it('should return 9', async () => {
    expect(await testingBehavior()).toEqual(9);
  });
  it('should return a JWT token for a valid user', async () => {
    const response = await request(app)
      .post('auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .set('Accept', 'application/json');
    expect(response.status).toEqual(200);
    // expect(response.headers['Content-Type']).toMatch(/json/);
    // expect(response.body.email)
    //   .toEqual('foo@bar.com')
    //   .expect(response.status)
    //   .to.equal(200);
    // expect(response.body).to.have.property('token');
  });

  // it('should return an error for an invalid user', async () => {
  //   const res = await request(app).post('users/login').send({
  //     email: 'testuser@test.com',
  //     password: 'wrongpassword',
  //   });

  //   expect(res.status).to.equal(401);
  //   expect(res.body).to.have.property('message', 'Invalid email or password');
  // });

  // it('should return a JWT token when valid credentials are provided', async () => {
  //   const response = await request(app)
  //     .post('users/login')
  //     .send({ email: 'testuser@example.com', password: 'password' })
  //     .expect(200);
  //   expect(response.body).toHaveProperty('token');
  // });

  // it('should return a 401 error when invalid credentials are provided', async () => {
  //   await request(app)
  //     .post('users/login')
  //     .send({ email: 'testuser@example.com', password: 'wrongpassword' })
  //     .expect(401);
  // });
});
