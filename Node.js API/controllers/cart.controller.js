const cartsServices = require("../services/cart.services");

// Controller method to create a new cart for the user
exports.create = (req, res, next) => {
    // Model containing the userId and list of products from the request
    var model = {
        userId: req.user.userId,
        products: req.body.products,
    };

    // Call the addCart service to add products to the cart
    cartsServices.addCart(model, (error, results) => {
        if (error) {
            return next(error); // Pass the error to the next middleware
        }
        // Send success response with the results
        return res.status(200).send({
            message: "Success",
            data: results,
        });
    });
};

// Controller method to fetch all cart items for the user
exports.findAll = (req, res, next) => {
    // Retrieve the cart for the current user using their userId
    cartsServices.getCart({userId: req.user.userId}, (error, results) => {
        if (error) {
            return next(error); // Handle any errors
        }
        // Return a success response with the cart data
        return res.status(200).send({
            message: "Success",
            data: results,
        });
    });
};

// Controller method to remove a product from the user's cart
exports.delete = (req, res, next) => {
    // Assuming the product to be removed and its quantity are provided in the request body
    const productToRemove = req.body.products[0]; // Extract the first product if sent as an array
    var model = {
        userId: req.user.userId, // User's ID
        productId: productToRemove.product, // ID of the product to remove
        qty: productToRemove.qty // Quantity to be removed, assumed to be sent as a string
    };

    // Call the removeCartItem service to remove the product from the cart
    cartsServices.removeCartItem(model, (error, results) => {
        if (error) {
            return next(error); // Pass the error to the next middleware
        }
        // Return success response with the updated cart details
        return res.status(200).send({
            message: "Success",
            data: results,
        });
    });
};
