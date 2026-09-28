const userController = require('../controllers/userController');
const bcrypt = require('bcrypt');
const db = require('../db');

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

module.exports = {
    registerUser
};