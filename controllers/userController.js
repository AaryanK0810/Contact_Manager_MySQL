const userService = require('../services/userService');

const register = async (req, res) => {

    try
    {
        const {username , email , password} = req.body;

        const result = await userService.registerUser(
            username,
            email,
            password
        );

        res.status(201).json(result);
    }
    catch(error)
    {
        console.error(error);
        
        if(error.code === 'ER_DUP_ENTRY')
        {
            return res.status(409).json({
                message : 'Email already registered.'
            });
        }

        if(error.message === 'MISSING_FIELDS')
        {
            return res.status(400).json({
                message : "Please provide username , email and password"
            });
        }

        res.status(500).json({
            message : 'Server error'
            });
    }
};

module.exports = {register};