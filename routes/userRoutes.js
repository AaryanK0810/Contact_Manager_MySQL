const express = require ('express');
const bcrypt = require("bcrypt");
const db = require("../db");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register" , async (req,res) =>{
    try {
        const {username , email , password} = req.body;
    

    if(!username || !email || !password)
    {
        return res.status(400).json({
            message : "Please provide username , email and password"
        });
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const [result] = await db.query("INSERT INTO users (username , email , password) VALUES (?,?,?)",
        [username , email , hashedPassword]
    );

    res.status(201).json({
        message : 'User registered successfully',
        userId : result.insertId
    });
}
catch(error)
{
    console.error(error);

     if(error.code === 'ER_DUP_ENTRY'){
        return res.status(409).json({
            message : 'Email already registered.'
        })
     }
    
    res.status(500).json({
        message : 'Server Error'
    });
}
});

router.post('/login' ,async (req ,res) => {
    try {
        const {email , password } = req.body;   

        if(!email || !password)
        {
            return res.status(400).json({
                message : "Please provide email and password"
            });
        }

        const [users] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if(users.length === 0)
        {
            return res.status(401).json({
                message : "Invalid email or password"
            });
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(
            password,user.password
        );

        if(!passwordMatch)
        {
            return res.status(401).json({
                message : "Wrong Password"
            });
        }


        const token = jwt.sign(
            {
                id : user.id,
                email : user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn : "1h"
            }
        );

              res.json({
            message : 'Login Successful',
            token : token
        });
    }

    catch(error)
    {
        console.error(error);
        
        res.status(500).json({
            message : "Server error"
        })
    }
})
module.exports = router;