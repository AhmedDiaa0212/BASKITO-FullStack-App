const mongoose = require("mongoose");

const category = mongoose.model(
    "category",
    mongoose.Schema({
        categoryName: {
            type: String,
            required: true,
            unique: true,
        },
        categoryDescription: {
            type: String,
            required: false,
        },
    },),
);

module.exports = {
    category,
}