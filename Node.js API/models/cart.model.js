const mongoose = require("mongoose");

const cart = mongoose.model(
    "Cart",
    mongoose.Schema({
        userId: {
            type: String,
            required: true,
        },
        products: {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                require: true
            },
            qty: {
                type: Number,
                require: true
            }
        },
    },
        {
            toJSON: {
                transfrom: function (doc, ret) {
                    ret.cartId = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                }
            }
        }
    ),
);

module.exports = {
    cart,
}