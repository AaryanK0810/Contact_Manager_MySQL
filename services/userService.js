const userController = require('../controllers/userController');
const bcrypt = require('bcrypt');
const db = require('../db');
const jwt = require('jsonwebtoken');

const registerUser = async (username , email , password) => {

    if(!username || !email || !password)
    {
        throw new Error('MISSING_FIELDS');
    }

    const hashedPassword = await bcrypt.hash(password , 10);

    const [result] = await db.query("INSERT INTO users (username , email , password) VALUES (?,?,?)",
        [username , email , hashedPassword]
    );

    return {
        message : 'User registered successfully',
        userId : result.insertId
    };
};

const loginUser = async (email , password) => {
    if(!email || !password)
    {
        throw new Error('MISSING_FIELDS');
    }

    const [users] = await db.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );

    if(users.length === 0)
    {
        throw new Error('INVALID_CREDENTIALS');
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );
    if(!passwordMatch)
    {
        throw new Error('INVALID_CREDENTIALS');
    }
    const token = jwt.sign(
        {
            id : user.id,
            email : user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn : '1h'
        }
    );
    return {
        message : 'Login Successful',
        token : token
    }
}
module.exports = {
    registerUser,
    loginUser
};