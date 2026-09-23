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

    test('create contact with valid JWT', async ()=>{
        const email = `login ${Date.now()}@example.com`;
        const password = '123456'
        //Register User
        await request(app)
        .post('/api/users/register')
        .send({
            username : 'Test User',
            email : email,
            password : password
        });
        //Login User
        const loginResponse = await request(app)
        .post('/api/users/login')
        .send({
            email : email,
            password : password
        });
        //Get JWT
        const token = loginResponse.body.token;

        //Create Contact
        const createContactResponse = await request(app)
        .post('/api/contacts')
        .set('Authorization' , `Bearer ${token}`)
        .send({
            name : 'John Doe',
            email : 'john@example.com',
            phone: "98281247271",
            type : 'personal'
        });

        expect(createContactResponse.statusCode).toBe(201);

        expect(createContactResponse.body.message).toBe('Contact created successfully');

        expect(createContactResponse.body.contactId).toBeDefined();
    })
afterAll(async()=>{
    await db.end();
});