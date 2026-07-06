const jwt = require('jsonwebtoken');

async function authMiddleware(req, res, next) {
    const token = req.headers.token;
        if(!token){
            res.status(403).json({
                message: "not logged in"
            })
            return;
        }
        const decoded = jwt.verify(token, "nix123");
        const userID = decoded.userID;
    
        if(!userID){
            res.status(403).json({
                message: "incorrect token"
            })
            return;
        }
    
        req.userID = userID;    
    next();
}

module.exports = {authMiddleware};