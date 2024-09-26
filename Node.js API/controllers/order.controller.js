const orderServices = require("../services/oreder.services");

exports.create = (req, res, next) => {
    var model = {
        userId: req.user.userId,
        card_Name: req.body.card_Name,
        card_Number: req.body.card_Number,
        card_ExpMonth: req.body.card_ExpMonth,
        card_ExpYear: req.body.card_ExpYear,
        card_CVC: req.body.card_CVC,
        amount: req.body.products,

    };

    orderServices.createOrder(model, (error, results) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: results,
        });
    });
}

exports.update = (req, res, next) => {
    orderServices.updateOrder(req.body, (error, results) => {
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
    orderServices.getOrders(req.user, (error, results) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: results,
        });
    });
}