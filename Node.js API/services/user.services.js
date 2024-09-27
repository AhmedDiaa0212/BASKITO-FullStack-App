const { user } = require("../models/user.model");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");

async function login({ email, password }, callback) {
    const userModel = await user.findOne({ email });

    if (userModel != null) {
        // Compare the provided password with the stored hashed password
        if (bcrypt.compareSync(password, userModel.password)) {
            const token = auth.generateAcceseToken(userModel.toJSON());
            callback(null, { ...userModel.toJSON(), token });
        } else {
            // Invalid password case, return 401
            callback({
                status: 401,
                message: "Invalid email or password"
            });
        }
    } else {
        // Invalid email case, return 401
        callback({
            status: 401,
            message: "Invalid email or password"
        });
    }
}


async function register(params, callback) {
    if(params.email === undefined){
        return callback({
            status: 400,
            message: "Email Required!"
        });
    }

    let isUserExist = await user.findOne({ email: params.email });
    if(isUserExist){
        return callback({
            status: 400,
            message: "User already exists!"
        });
    }

    const salt = bcrypt.genSaltSync(10);
    params.password = bcrypt.hashSync(params.password, salt);

    const userSchema = new user(params);
    userSchema.save()
    .then((response) => {
        return callback(null, response);
    })
    .catch((error) => {
        return callback({
            status: 500,
            message: error.message
        });
    });
}

module.exports = {
    login,
    register
}