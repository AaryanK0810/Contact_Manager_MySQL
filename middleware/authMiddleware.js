const jwt = require("jsonwebtoken");

const protect = (req, res, next) =>{
    const authorization = req.headers.authorization || "";
    const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);
    const token = tokenMatch ? tokenMatch[1].trim() : null;

    if(!token)
    {
        return res.status(401).json({
            message : 'Not authorized, no token'
        });
    }

    try{
        const decoded = jwt.verify(token ,process.env.JWT_SECRET);

        req.user = decoded;

        next();
    }

    catch(error)
    {
        return res.status(401).json({
            message : 'Not authorized, invalid token!'
        });
    }
};

module.exports = protect;