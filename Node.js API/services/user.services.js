const { user } = require("../models/user.model");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");

async function login({ email, password }, callback) {
    const userModel = await user.findOne({ email });

    if (userModel != null) {
        if (bcrypt.compareSync(password, userModel.password)) {
            const token = auth.generateAcceseToken(userModel.toJSON());
            callback(null, { ...userModel.toJSON(), token });
        }
        else {
            callback({
                message: "Invalid email or password"
            });
        }
    }
    else {
        callback({
            message: "Invalid email or password"
        });
    }
}

async function register(params, callback) {
    if(params.email === undefined){
        return callback({
            message: "Email Required!"
        })
    }

    let isUserExist = await user.findOne({ email: params.email });
    if(isUserExist){
        return callback({
            message: "user already exist!"
        })
    }

    const salt = bcrypt.genSaltSync(10);
    params.password = bcrypt.hashSync(params.password, salt);

    const userSchema = new user(params);
    userSchema.save()
    .then((response)=>{
        return callback(null, response)
    })
    .catch((error)=>{
        return callback(error)
    })
} 

module.exports = {
    login,
    register
}