const { MONG0_DB_CONFIG } = require("../config/app.config"); // Importing the MongoDB configuration
const { category } = require("../models/category.model"); // Importing the 'category' model

// Function to create a new category
async function createCategories(params, callback) {
    if (!params.categoryName) { // If category name is missing, return an error message
        return callback(
            {
                message: "Category Name Required"
            },
            ""
        );
    }

    const categoryModel = new category(params); // Create a new instance of the 'category' model with the provided parameters
    categoryModel
        .save() // Save the category to the database
        .then((response) => {
            return callback(null, response); // Return the saved category in the callback
        })
        .catch((error) => {
            return callback(error); // Handle any error during saving
        });
}

// Function to get a list of categories with optional filtering by category name
async function getCategories(params, callback) {
    const categoryName = params.categoryName; // Get category name from params
    var condition = categoryName ? // If category name is provided, create a regex condition for case-insensitive search
    {
        categoryName: {$regex: new RegExp(categoryName), $options: "i"}
    }
    : {}; // If no category name is provided, set an empty condition (return all categories)
    
    let perPage = Math.abs(params.pageSize) || MONG0_DB_CONFIG.PAGE_SIZE; // Set the number of items per page or use the default from the config
    let page = (Math.abs(params.page) || 1) - 1; // Set the current page (default is 1), and convert to zero-based index

    category
        .find(condition, "categoryName categoryImage") // Find categories based on the condition, return only categoryName and categoryImage
        .limit(perPage) // Limit the number of categories returned per page
        .skip(perPage * page) // Skip categories for pagination
        .then((response) => {
            return callback(null, response); // Return the list of categories in the callback
        })
        .catch((error) => {
            return callback(error); // Handle any error during the query
        });
}

// Function to get a single category by its ID
async function getCategoriesById(params, callback) {
    const categoryId = params.categoryId; // Get category ID from params

    category
        .findById(categoryId) // Find the category by its ID
        .then((response) => {
            if (!response) callback("Not found category with id" + categoryId); // If no category is found, return an error message
            else callback(null, response); // Return the found category in the callback
        })
        .catch((error) => {
            return callback(error); // Handle any error during the query
        });
}

// Function to update an existing category by its ID
async function updateCategory(params, callback) {
    const categoryId = params.categoryId; // Get category ID from params

    category
        .findByIdAndUpdate(categoryId, params, { useFindAndModify: false }) // Update the category with the new parameters
        .then((response) => {
            if (!response) callback("Not found category with id" + categoryId); // If no category is found, return an error message
            else callback(null, response); // Return the updated category in the callback
        })
        .catch((error) => {
            return callback(error); // Handle any error during the update
        });
}

// Function to delete a category by its ID
async function deleteCategory(params, callback) {
    const categoryId = params.categoryId; // Get category ID from params

    category
        .findByIdAndDelete(categoryId) // Delete the category by its ID
        .then((response) => {
            if (!response) callback("Not found category with id" + categoryId); // If no category is found, return an error message
            else callback(null, response); // Return the deleted category in the callback
        })
        .catch((error) => {
            return callback(error); // Handle any error during the deletion
        });
}

// Exporting all the category service functions for use in other parts of the application
module.exports = {
    createCategories,
    getCategories,
    getCategoriesById,
    updateCategory,
    deleteCategory
}
