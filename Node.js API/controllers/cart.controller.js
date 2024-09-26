const cartsServices = require("../services/cart.services");


exports.create = (req, res, next) => {
    var model = {
        userId: req.user.userId,
        products: req.body.products,
    };

    cartsServices.addCart(model, (error, results) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: results,
        });
    });
}

exports.findAll = (req, res, next) => {
    cartsServices.getCart({userId: req.user.userId,}, (error, results) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: results,
        });
    });
}

exports.delete = (req, res, next) => {
    // Assuming you send the productId and qty in the request body
    const productToRemove = req.body.products[0]; // Get the first product if sending as an array
    var model = {
        userId: req.user.userId,
        productId: productToRemove.product,
        qty: productToRemove.qty // Assuming qty is sent as a string, parse it to number in the service function
    };

    cartsServices.removeCartItem(model, (error, results) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: results,
        });
    });
}
