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

        test('Update Contact' , async()=> {
            const email = `login${Date.now()}@example.com`;
            const password = '123456';

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

            //GET JWT
            const token = loginResponse.body.token
            //Create Contact
            const createContact = await request(app)
            .post('/api/contacts')
            .set("Authorization" , `Bearer ${token}`)
            .send({
                name : 'Aaryan',
            email : 'aaryan@example.com',
            phone : '12345667890',
            type : 'personal'
            });

            const contactId = createContact.body.contactId;

            //Update contact
            const updateContactResponse = await request(app)
            .put(`/api/contacts/${contactId}`)
            .set('Authorization' , `Bearer ${token}`)
            .send({
                name : 'Updated Aaryan',
                email : 'updated@example.com',
                phone : '12345667890',
                type : 'professional'
            });

            expect(updateContactResponse.statusCode).toBe(200);
            expect(updateContactResponse.body.message).toBe('Contact updated successfully');

            //GET updated contact
            const getUpdatedContact = await request(app)
            .get(`/api/contacts/${contactId}`)
            .set('Authorization' , `Bearer ${token}`)

            expect(getUpdatedContact.statusCode).toBe(200);
            expect(getUpdatedContact.body.name).toBe('Updated Aaryan');
            expect(getUpdatedContact.body.email).toBe('updated@example.com');
            expect(getUpdatedContact.body.phone).toBe('12345667890');
            expect(getUpdatedContact.body.type).toBe('professional');

        });

        test('Delete Contact' , async()=>{
            const email = `user${Date.now()}@example.com`;
            const password = '123456';

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

            //GET JWT
            const token = loginResponse.body.token;

            //Create Contact
            const createContact = await request(app)
            .post('/api/contacts')
            .set('Authorization' , `Bearer ${token}`)
            .send({name : 'Aaryan',
            email : 'aaryan@example.com',
            phone : '12345667890',
            type : 'personal'
        });
            //get contactid
            const contactId = createContact.body.contactId;

            //delete contact
            const deleteContact = await request(app)
            .delete(`/api/contacts/${contactId}`)
            .set('Authorization' , `Bearer ${token}`)

            expect(deleteContact.statusCode).toBe(200);
            expect(deleteContact.body.message).toBe('Contact deleted successfully');

            //verify contact no longer exists
            const contactDeleted = await request(app)
            .get(`/api/contacts/${contactId}`)
            .set('Authorization' , `Bearer ${token}`)

            
            expect(contactDeleted.statusCode).toBe(404);
            expect(contactDeleted.body.message).toBe('Contact not found')
        });
        test('should not allow other users to access a users contacts' , async ()=>{
            //User A credentials
            const emailA = `userA${Date.now()}@example.com`;
            const password = '123456';
            //Register User A
            await request(app)
            .post('/api/users/register')
            .send({
                username : 'Test User A',
                email : emailA,
                password : password
            });
            //Login User A
            const loginResponse = await request(app)
            .post('/api/users/login')
            .send({
                email : emailA,
                password : password
            });
            //Get JWT for UserA
            const tokenA = loginResponse.body.token;

            //Create contact for UserA
            const createContactA = await request(app)
            .post('/api/contacts')
            .set('Authorization' , `Bearer ${tokenA}`)
            .send({
                name : 'Aaryan',
            email : 'aaryan@example.com',
            phone : '12345667890',
            type : 'personal'
            });
            //Contact id for User A
            const contactIdA = createContactA.body.contactId;

            //Email for User B, password will be the same
            const emailB = `userB${Date.now()}@example.com`;
            //Create USer B
            await request(app)
            .post('/api/users/register')
            .send({
                    username : 'Test User B',
                    email : emailB,
                    password : password
            });

            //Login User B
            const loginUserB = await request(app)
            .post('/api/users/login')
            .send({
                email : emailB,
                password : password
            });

            //User B token
            const tokenB = loginUserB.body.token;

            //User B tries to access contacts of User A

            const response = await request(app)
            .get(`/api/contacts/${contactIdA}`)
            .set('Authorization' , `Bearer ${tokenB}`)


            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe('Contact not found');
        });

        test("should return 404 when updating a contact that doesn't exist" , async ()=>{
                const email = 'user@example.com';
                const password = '123456';

                //Register a user

                await request(app)
                .post ('/api/users/register')
                .send({
                    username : 'Test User',
                    email : email,
                    password : password
                });

                //Login the user
                const loginResponse = await request(app)
                .post('/api/users/login')
                .send({
                    email : email,
                    password : password
                });

                //Get the JWT token
                const token = loginResponse.body.token;

                //Update a user that doesnt exist
                const updateContactResponse = await request(app)
                .put('/api/contacts/999')
                .set('Authorization' , `Bearer ${token}`)
                .send({
                    name : 'Aaryan',
            email : 'aaryan@example.com',
            phone : '12345667890',
            type : 'personal'
                });

                expect(updateContactResponse.statusCode).toBe(404);
                expect(updateContactResponse.body.message).toBe('Contact Not Found');
        });

        test("should reject contact creation without a name", async () => {
                const email = `validation${Date.now()}@example.com`;
                const password = "123456";

                // Register User
                await request(app)
                    .post("/api/users/register")
                    .send({
                        username: "Validation User",
                        email: email,
                        password: password
                    });

                // Login User
                const loginResponse = await request(app)
                    .post("/api/users/login")
                    .send({
                        email: email,
                        password: password
                    });

                const token = loginResponse.body.token;

                // Create contact without name
                const response = await request(app)
                    .post("/api/contacts")
                    .set("Authorization", `Bearer ${token}`)
                    .send({
                        email: "test@example.com",
                        phone: "1234567890",
                        type: "personal"
                    });

                expect(response.statusCode).toBe(400);
                expect(response.body.message).toBe("Name is required");
            });

        test("should reject registration with an already registered email", async () => {
                const email = `duplicate${Date.now()}@example.com`;
                const password = "123456";

                // First registration
                await request(app)
                    .post("/api/users/register")
                    .send({
                        username: "First User",
                        email,
                        password
                    });

                // Second registration with same email
                const response = await request(app)
                    .post("/api/users/register")
                    .send({
                        username: "Second User",
                        email,
                        password
                    });

                expect(response.statusCode).toBe(409);
                expect(response.body.message).toBe("Email already registered.");
            });
afterAll(async()=>{
    await db.end();
});