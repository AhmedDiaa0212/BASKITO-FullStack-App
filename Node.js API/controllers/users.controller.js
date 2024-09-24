const userServices = require("../services/user.services");

exports.register = (req, res, next) =>{
    userServices.register(req.body, (error, result) =>{
        if(error){
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: result
        })
    }) 
}

exports.login = (req, res, next) =>{
    const { email, password } = req.body;

    userServices.login({email,password}, (error, result) =>{
        if(error){
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: result
        })
    }) 
}