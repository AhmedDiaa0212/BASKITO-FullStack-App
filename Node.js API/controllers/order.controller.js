const orderServices = require("../services/order.services");

exports.create = async (req, res, next) => {
    try {
        console.log('Received request to create order with body:', req.body);
        const model = {
            userId: req.user.userId,
            card_Name: req.body.card_Name,
            card_Number: req.body.card_Number,
            card_ExpMonth: req.body.card_ExpMonth,
            card_ExpYear: req.body.card_ExpYear,
            card_CVC: req.body.card_CVC,
            amount: req.body.amount,
        };

        const result = await orderServices.createOrder(model);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error creating order:', error); // Log error
        next(error);
    }
};


exports.update = async (req, res, next) => {
    try {
        const result = await orderServices.updateOrder(req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const orders = await orderServices.getOrders({ userId: req.user.userId });
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};
