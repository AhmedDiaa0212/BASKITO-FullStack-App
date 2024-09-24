const mongoose = require("mongoose");

const relatedproduct = mongoose.model(
    "RelatedProducts",
    mongoose.Schema(
        {
            Product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            relatedproduct: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },

        },
        {
            toJSON: {
                transform: function (doc, ret) {
                    delete ret._id;
                    delete ret.__v;
                }
            },
        }, { timestamps: true }
    )
);

module.exports = {
    relatedproduct,
};