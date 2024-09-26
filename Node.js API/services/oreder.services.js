const { user } = require("../models/user.model");
const { cards } = require("../models/cards.model");
const { order } = require("../models/order.model");

const stripeService = require("../services/stripe.services");
const cartService = require("../services/cart.services");

async function createOrder(params, callback) {
    user.findOne({ _id: params.userId }, async function (err, userDB) {
        if (err) {
            return callback(err);
        }
        else {
            var model = {};

            if (!userDB.stripCustomerID) {
                await stripeService.createCustomer({
                    "name": userDB.fullName,
                    "email": userDB.email,
                }, (error, result) => {
                    if (error) {
                        return callback(error);
                    }

                    if (result) {
                        userDB.stripCustomerID = result.id;
                        userDB.save();

                        model.stripCustomerID = result.id;
                    }
                })
            }
            else {
                model.stripCustomerID = userDB.stripCustomerID;
            }

            cards.findOne({
                customerId: model.stripCustomerID,
                cardNumber: params.card_Number,
                cardExpMonth: params.card_ExpMonth,
                cardExpyear: params.card_ExpYear,
            }, async function (err, cardDB) {
                if (err) {
                    return callback(err);
                }
                else {
                    if (!cardDB) {
                        await stripeService.addCards({
                            "card_Name": params.card_Name,
                            "card_Number": params.card_Number,
                            "card_ExpMonth": params.card_ExpMonth,
                            "card_ExpYear": params.card_ExpYear,
                            "card_CVC": params.card_CVC,
                            "customer_Id": model.stripCustomerID,
                        }, (error, result) => {
                            if (error) {
                                return callback(error);
                            }

                            if (result) {
                                const cardModel = new cards({
                                    cardId: result.card,
                                    cardName: params.card_Name,
                                    cardNumber: params.card_Number,
                                    cardExpMonth: params.card_ExpMonth,
                                    cardExpYear: params.card_ExpYear,
                                    cardCVC: params.card_CVC,
                                    customerId: model.stripCustomerID,
                                });

                                cardModel.save();
                                model.cardId = result.card;
                            }

                        })
                    }
                    else {
                        model.cardId = cardDB.cardId;
                    }
                    await stripeService.generatePaymentIntent({
                        "receipt_email": userDB.email,
                        "amount": params.amount,
                        "card_id": model.cardId,
                        "customer_id": model.stripCustomerID,
                    }, (error, result) => {
                        if (error) {
                            return callback(error);
                        }

                        if (result) {
                            model.paymentIntentId = result.id;
                            model.client_secret = result.client_secret;
                        }
                    });
                    cartService.getCart({ userId: userDB.userId }, async function (err, cartDB) {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            if (cartDB) {
                                var products = [];
                                var grandTotal = 0;

                                cartDB.products.forEach(product => {
                                    products.push({
                                        product: product.product._id,
                                        qty: product.qty,
                                        amount: product.product.productSalePrice,
                                    });

                                    grandTotal += product.product.productSalePrice;

                                });

                                const orderModel = new order({
                                    userId: cartDB.userId,
                                    products: products,
                                    grandTotal: grandTotal,
                                    orderStatus: "pending"
                                });

                                orderModel
                                    .save()
                                    .then((response) => {
                                        model.orderId = response._id;
                                        return callback(null, model)
                                    })
                                    .catch((error) => {
                                        return callback(error)
                                    });

                            }
                        }
                    });
                }
            });
        }
    });
}

async function updateOrder(params, callback) {
    var model = {
        orderStatus: params.status,
        transactionId: params.transaction_id
    }
    order
        .findByIdAndUpdate(params.orderId, model, { useFindAndModify: false })
        .then((response) => {
            if (!response) {
                return callback("Order Update Failed");
            }
            else {
                if (params.status === "success") {
                    //Clear the cart code
                }
            }
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}

async function getOrders(params, callback) {
    order.findOne({ userId: params.userId })
        .populate({
            path: "products",
            populate: {
                path: "product",
                model: "Product",
                populate: {
                    path: "category",
                    model: "Category",
                    select: "categoryName"
                },
            }
        })
        .then((response) => {
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}

module.exports = {
    createOrder,
    updateOrder,
    getOrders
}