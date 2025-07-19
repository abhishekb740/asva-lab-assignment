const request = require('supertest');
const express = require('express');

jest.mock('../src/config/database', () => ({
  query: jest.fn()
}));

jest.mock('../src/services/eventPublisher', () => ({
  userRegistered: jest.fn()
}));

const db = require('../src/config/database');
const EventPublisher = require('../src/services/eventPublisher');

describe('User Registration Test', () => {
  let app;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-jwt-secret-key';
    
    app = express();
    app.use(express.json());
    
    const authRoutes = require('../src/api/routes/auth');
    app.use('/auth', authRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Should register a new user successfully', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ 
        rows: [{ 
          id: 1, 
          email: 'newuser@example.com', 
          role: 'user',
          created_at: new Date('2025-01-01')
        }] 
      });

    const response = await request(app)
      .post('/auth/register')
      .send({
        email: 'newuser@example.com',
        password: 'Password123',
        role: 'user'
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
    expect(response.body.user.email).toBe('newuser@example.com');
    expect(response.body.user.role).toBe('user');
    expect(response.body.user.id).toBe(1);
    expect(response.body.token).toBeDefined();
    
    expect(db.query).toHaveBeenCalledTimes(2);
    
    expect(EventPublisher.userRegistered).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        email: 'newuser@example.com',
        role: 'user'
      })
    );
  });
}); 
