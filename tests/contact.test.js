const request = require('supertest');
const app = require("../server");
const db = require('../db');
const expectCookies = require('supertest/lib/cookies');

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
    });
    test('get all contacts with valid JWT', async ()=>{
        const email = `getAllContacts${Date.now()}@example.com`
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
            name : 'Aaryan',
            email : 'aaryan@example.com',
            phone : '12345667890',
            type : 'personal'
        });

        //GET all contacts
        const response = await request(app)
        .get('/api/contacts')
        .set('Authorization' , `Bearer ${token}`)

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe("Aaryan");
    });
        //GET contact by ID
        test('Get contact by ID', async ()=>{
            const email =  `test${Date.now()}@example.com`
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

            //Create a contact
            const contactResponse = await request(app)
            .post('/api/contacts')
            .set('Authorization' , `Bearer ${token}`)
            .send({
                name : 'Aaryan',
            email : 'aaryan@example.com',
            phone : '12345667890',
            type : 'personal'
            });
            const contactId = contactResponse.body.contactId;

            //GET single contact
            const response = await request(app)
            .get(`/api/contacts/${contactId}`)
                .set('Authorization' , `Bearer ${token}`)

            expect(response.statusCode).toBe(200);
            expect(response.body.name).toBe("Aaryan");
            expect(response.body.email).toBe('aaryan@example.com');
            expect(response.body.phone).toBe('12345667890');
            expect(response.body.type).toBe('personal');
            
        });
afterAll(async()=>{
    await db.end();
});