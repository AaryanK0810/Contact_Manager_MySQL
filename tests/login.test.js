const request = require("supertest");
const app = require("../server");
const db = require("../db");

describe("User Login", () => {

    test("should reject login with invalid credentials", async () => {
        const response = await request(app)
            .post("/api/users/login")
            .send({
                email: "wrong@example.com",
                password: "wrongpassword"
            });

        expect(response.statusCode).toBe(401);

        expect(response.body.message)
            .toBe("Invalid email or password");
    });

    test("should login with valid credentials", async () => {

        const email = `login${Date.now()}@example.com`;
        const password = "123456";

        await request(app)
            .post("/api/users/register")
            .send({
                username: "Login Test User",
                email: email,
                password: password
            });

        const response = await request(app)
            .post("/api/users/login")
            .send({
                email: email,
                password: password
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.message)
            .toBe("Login Successful");

        expect(response.body.token)
            .toBeDefined();
    });

});

afterAll(async () => {
    await db.end();
});