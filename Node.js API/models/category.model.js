const mongoose = require("mongoose"); // Importing mongoose to interact with MongoDB

// Defining the 'Category' model using mongoose
const category = mongoose.model(
    "Category", 
    mongoose.Schema({
        // Defining the schema for the Category collection
        categoryName: {
            type: String, 
            required: true,
            unique: true, // The category name must be unique
        },
        categoryDescription: {
            type: String, // Category description is also a string
            required: false, 
        },
    },
    {
        // Customizing the JSON response
        toJSON: {
            transfrom: function (doc, ret) {
                // When converting the document to JSON, add a categoryId field
                ret.categoryId = ret._id.toString(); 
                delete ret._id; // Remove the _id field from the response
                delete ret.__v; // Remove the version key (__v) from the response
            }
        }
    })
);

// Exporting the 'category' model to be used in other parts of the application
module.exports = {
    category,
}
