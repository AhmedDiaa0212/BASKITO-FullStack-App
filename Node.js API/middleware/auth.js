const jwt = require("jsonwebtoken")

const TOKEN_KEY = "RANDOM_KEY";

function authenticationToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    //if (token == null) return res.sendStatus(401);
    if(!token){
        return res.status(403).send({message:"No Token Provided"});
    }

    jwt.verify(token, TOKEN_KEY, (err, user) => {
        if (err) return res.status(401).send({Unauthorized});
        req.user = user.data;
        next();
    })
}

function generateAcceseToken(authHeader) {
    return jwt.sign({data: authHeader}, TOKEN_KEY, {expiresIn:"1h"})
}

module.exports = {
    authenticationToken,
    generateAcceseToken,
};