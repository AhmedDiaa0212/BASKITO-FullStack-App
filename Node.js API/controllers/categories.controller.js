const categoriesServices = require("../services/categories.services");
const upload = require("../middleware/category.uploads");

// Controller method to create a new category
exports.create = (req, res, next) => {
    // Handling file upload using middleware
    upload(req, res, function (err) {
        if (err) {
            next(err); // Handle file upload error
        } else {
            // If a file is uploaded, get its path and normalize the slashes
            const path = req.file != undefined ? req.path.replace(/\\/g, "/") : "";
            
            // Create the model with the category details from the request
            var model = {
                categoryName: req.body.categoryName,
                categoryDescription: req.body.categoryDescription,
                categoryImage: path != "" ? "/" + path : "" // Set the image path if available
            };

            // Call service to create the category
            categoriesServices.createCategories(model, (error, results) => {
                if (error) {
                    return next(error); // Handle any service error
                }
                // Send success response with the created category data
                return res.status(200).send({
                    message: "Success",
                    data: results,
                });
            });
        }
    })
}

// Controller method to get all categories with optional pagination and filtering
exports.findAll = (req, res, next) => {
    // Create a model with query parameters for filtering and pagination
    var model = {
        categoryName: req.query.categoryName,
        pageSize: req.query.pageSize,
        page: req.query.page,
    };

    // Call service to retrieve all categories
    categoriesServices.getCategories(model, (error, results) => {
        if (error) {
            return next(error); // Handle any service error
        }
        // Send success response with the category data
        return res.status(200).send({
            message: "Success",
            data: results,
        });
    });
}

// Controller method to find a category by ID
exports.findOne = (req, res, next) => {
    // Create a model with the category ID from request params
    var model = {
        categoryId: req.params.id,
    };

    // Call service to retrieve a category by ID
    categoriesServices.getCategoriesById(model, (error, results) => {
        if (error) {
            return next(error); // Handle any service error
        }
        // Send success response with the category data
        return res.status(200).send({
            message: "Success",
            data: results,
        });
    });
}

// Controller method to update an existing category
exports.update = (req, res, next) => {
    // Handling file upload using middleware
    upload(req, res, function (err) {
        if (err) {
            next(err); // Handle file upload error
        } else {
            // If a file is uploaded, get its path and normalize the slashes
            const path = req.file != undefined ? req.path.replace(/\\/g, "/") : "";
            
            // Create the model with updated category details from the request
            var model = {
                categoryId: req.params.id,
                categoryName: req.body.categoryName,
                categoryDescription: req.body.categoryDescription,
                categoryImage: path != "" ? "/" + path : "" // Set the image path if available
            };

            // Call service to update the category
            categoriesServices.updateCategory(model, (error, results) => {
                if (error) {
                    return next(error); // Handle any service error
                }
                // Send success response with the updated category data
                return res.status(200).send({
                    message: "Success",
                    data: results,
                });
            });
        }
    })
}

// Controller method to delete a category by ID
exports.delete = (req, res, next) => {
    // Create a model with the category ID from request params
    var model = {
        categoryId: req.params.id,
    };

    // Call service to delete the category
    categoriesServices.deleteCategory(model, (error, results) => {
        if (error) {
            return next(error); // Handle any service error
        }
        // Send success response with the deletion result
        return res.status(200).send({
            message: "Success",
            data: results,
        });
    });
}
