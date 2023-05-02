import { createAccount } from '../controllers/user';

describe('createUser', () => {
  it('should create a new user with valid input', () => {
    const req = {
      body: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: '12345678',
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    createAccount(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ data: req.body })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should return an error with invalid input', () => {
    const req = {
      body: { name: 'John Doe', email: 'invalidemail', password: '123' },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    createAccount(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
    expect(next).not.toHaveBeenCalled();
  });
});
