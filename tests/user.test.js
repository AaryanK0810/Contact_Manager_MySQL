const request = require("supertest");
const app = require('../server');
const Test = require("supertest/lib/test");
const expectCookies = require("supertest/lib/cookies");

describe('User Registration' , () =>
{
    test('should reject registration when fields are empty', async ()=>{
        const response = await request(app)
            .post('/api/users/register')
            .send({
                username : 'Test User'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Please provide username , email and password')
    });

    test('should register a new user successfully' , async () =>{
        const response = await request(app)
            .post('/api/users/register')
            .send({
                username : 'Test User',
                email : `test${Date.now()}@example.com`,
                password : '1234567'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('User registered successfully');

        expect(response.body.userId).toBeDefined();
    });
})