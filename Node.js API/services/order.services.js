const { user } = require("../models/user.model");
const { cards } = require("../models/cards.model");
const { order } = require("../models/order.model");

const stripeService = require("../services/stripe.services");
const cartService = require("../services/cart.services");


async function createOrder(params, callback) {
    try {
        const userDB = await user.findOne({ _id: params.userId });
        if (!userDB) return callback(new Error('User not found'));

        let model = {};

        if (!userDB.stripCustomerID) {
            // Create a customer
            stripeService.createCustomer({
                "name": userDB.fullName,
                "email": userDB.email,
            }, async (err, customer) => {
                if (err) return callback(err);

                userDB.stripCustomerID = customer.id;
                await userDB.save();
                model.stripCustomerID = customer.id;

                // Proceed to add card and create order
                await handleCardAndOrder(params, model, userDB, callback);
            });
        } else {
            model.stripCustomerID = userDB.stripCustomerID;
            // Proceed to add card and create order
            await handleCardAndOrder(params, model, userDB, callback);
        }
    } catch (error) {
        callback(new Error(error.message));
    }
}

async function handleCardAndOrder(params, model, userDB, callback) {
    try {
        const cardDB = await cards.findOne({
            customerId: model.stripCustomerID,
            cardNumber: params.card_Number,
            cardExpMonth: params.card_ExpMonth,
            cardExpYear: params.card_ExpYear,
        });

        if (!cardDB) {
            stripeService.addCards({
                "card_Name": params.card_Name,
                "card_Number": params.card_Number,
                "card_ExpMonth": params.card_ExpMonth,
                "card_ExpYear": params.card_ExpYear,
                "card_CVC": params.card_CVC,
            }, async (err, card) => {
                if (err) return callback(err);

                const cardModel = new cards({
                    cardId: card.card,
                    cardName: params.card_Name,
                    cardNumber: params.card_Number,
                    cardExpMonth: params.card_ExpMonth,
                    cardExpYear: params.card_ExpYear,
                    cardCVC: params.card_CVC,
                    customerId: model.stripCustomerID,
                });
                await cardModel.save();
                model.cardId = card.card;

                // Now create the payment intent
                await createPaymentIntent(model, userDB, callback);
            });
        } else {
            model.cardId = cardDB.cardId;
            await createPaymentIntent(model, userDB, callback);
        }
    } catch (error) {
        callback(new Error(error.message));
    }
}

async function createPaymentIntent(model, userDB, callback) {
    try {
        const paymentIntent = await stripeService.generatePaymentIntent({
            "receipt_email": userDB.email,
            "amount": params.amount,
            "card_id": model.cardId,
            "customer_id": model.stripCustomerID,
        });

        model.paymentIntentId = paymentIntent.id;
        model.client_secret = paymentIntent.client_secret;

        const cartDB = await cartService.getCart({ userId: userDB.id });
        if (cartDB) {
            let products = [];
            let grandTotal = 0;

            cartDB.products.forEach(product => {
                products.push({
                    product: product.product._id,
                    qty: product.qty,
                    amount: product.product.productSalePrice,
                });
                grandTotal += product.product.productSalePrice * product.qty; // Update grand total calculation
            });

            const orderModel = new order({
                userId: cartDB.userId,
                products: products,
                grandTotal: grandTotal,
                orderStatus: "pending",
            });
            const savedOrder = await orderModel.save();
            model.orderId = savedOrder._id;

            return callback(null, model); // Return final model
        }
    } catch (error) {
        callback(new Error(error.message));
    }
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