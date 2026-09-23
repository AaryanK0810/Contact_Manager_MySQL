const request = require('supertest');
const app = require("../server");
const db = require('../db')

describe('Contact routes' , ()=> {
    test('should reject access without JWT token' , async ()=>{
      const response = await request(app)
      .get('/api/contacts')

      expect(response.statusCode).toBe(401);

      expect(response.body.message).toBe('Not authorized, no token')
    });
});

    
afterAll(async()=>{
    await db.end();
});