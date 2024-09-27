const userServices = require("../services/user.services");

exports.register = (req, res, next) => {
    userServices.register(req.body, (error, result) => {
        if (error) {
            return res.status(error.status || 500).send({
                message: error.message || "Internal Server Error"
            });
        }
        return res.status(200).send({
            message: "Success",
            data: result
        });
    });
}

exports.login = (req, res, next) => {
    const { email, password } = req.body;

    userServices.login({ email, password }, (error, result) => {
        if (error) {
            // Set 401 Unauthorized if status is provided, otherwise use default
            return res.status(error.status || 500).send({
                message: error.message || "Internal Server Error"
            });
        }
        return res.status(200).send({
            message: "Success",
            data: result
        });
    });
};

exports.logout = (req, res, next) => {
    // For JWT, we can't really invalidate a token on the server,
    // but we can inform the client to delete the token.

    // Respond with a success message
    return res.status(200).send({
        message: "Logged out successfully"
    });
};
