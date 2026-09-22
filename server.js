const express = require("express");
const db = require("./db");
const userRoutes = require("./routes/userRoutes");
const protect = require("./middleware/authMiddleware");
const app = express();
const contactRoutes = require("./routes/contactRoutes");

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/contacts" , contactRoutes);

app.get("/", (req, res) => {
    res.send("Contact Manager API is running");
});

app.get("/test-db", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT 1 AS result");

        res.json(rows);
    } catch (error) {
        console.error("MYSQL ERROR:", error);

        res.status(500).json({
            message: "Database connection failed",
            error: error.message
        });
    }
});

app.get("/protected" , protect , (req , res) =>{
    res.json({
        message : 'You have access to this route',
        user : req.user
    });
});
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});