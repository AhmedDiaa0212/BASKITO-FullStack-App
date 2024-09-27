const { user } = require("../models/user.model");
const { cards } = require("../models/cards.model");
const { order } = require("../models/order.model");

const stripeService = require("./stripe.services");
const cartService = require("./cart.services");

async function createOrder(params) {
    try {
        const userDB = await user.findOne({ _id: params.userId }).exec();
        if (!userDB) {
            throw new Error('User not found');
        }

        let model = {};

        if (!userDB.stripCustomerID) {
            const stripeCustomer = await stripeService.createCustomer({
                name: userDB.fullName,
                email: userDB.email,
            });

            if (!stripeCustomer) {
                throw new Error('Error creating Stripe customer');
            }

            userDB.stripCustomerID = stripeCustomer.id;
            await userDB.save();
            model.stripCustomerID = stripeCustomer.id;
        } else {
            model.stripCustomerID = userDB.stripCustomerID;
        }

        let cardDB = await cards.findOne({
            customerId: model.stripCustomerID,
            cardNumber: params.card_Number,
            cardExpMonth: params.card_ExpMonth,
            cardExpYear: params.card_ExpYear,
        }).exec();

        if (!cardDB) {
            const newCard = await stripeService.addCards({
                card_Name: params.card_Name,
                card_Number: params.card_Number,
                card_ExpMonth: params.card_ExpMonth,
                card_ExpYear: params.card_ExpYear,
                card_CVC: params.card_CVC,
                customer_Id: model.stripCustomerID,
            });

            if (!newCard) {
                throw new Error('Error adding card to Stripe');
            }

            const cardModel = new cards({
                cardId: newCard.card,
                cardName: params.card_Name,
                cardNumber: params.card_Number,
                cardExpMonth: params.card_ExpMonth,
                cardExpYear: params.card_ExpYear,
                cardCVC: params.card_CVC,
                customerId: model.stripCustomerID,
            });

            await cardModel.save();
            model.cardId = newCard.card;
        } else {
            model.cardId = cardDB.cardId;
        }

        const paymentIntent = await stripeService.generatePaymentIntent({
            receipt_email: userDB.email,
            amount: params.amount,
            card_id: model.cardId,
            customer_id: model.stripCustomerID,
        });

        if (!paymentIntent) {
            throw new Error('Error generating payment intent');
        }

        model.paymentIntentId = paymentIntent.id;
        model.client_secret = paymentIntent.client_secret;

        const cartDB = await cartService.getCart({ userId: userDB.userId });
        if (cartDB) {
            let products = [];
            let grandTotal = 0;

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
                orderStatus: "pending",
            });

            const savedOrder = await orderModel.save();
            model.orderId = savedOrder._id;

            return model;
        }
    } catch (error) {
        throw error;
    }
}

async function updateOrder(params) {
    try {
        const model = {
            orderStatus: params.status,
            transactionId: params.transaction_id,
        };

        const updatedOrder = await order.findByIdAndUpdate(params.orderId, model, { useFindAndModify: false });

        if (!updatedOrder) {
            throw new Error('Order Update Failed');
        }

        if (params.status === "success") {
            // Code to clear the cart
        }

        return updatedOrder;
    } catch (error) {
        throw error;
    }
}

async function getOrders(params) {
    try {
        const orderData = await order.findOne({ userId: params.userId })
            .populate({
                path: "products",
                populate: {
                    path: "product",
                    model: "Product",
                    populate: {
                        path: "category",
                        model: "Category",
                        select: "categoryName",
                    },
                },
            });

        return orderData;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createOrder,
    updateOrder,
    getOrders,
};
