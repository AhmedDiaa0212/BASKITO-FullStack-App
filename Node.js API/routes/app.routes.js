const categoriesController = require("../controllers/categories.controller");
const express = require("express");
const router = express.Router();

// Create a new category
router.post("/category", categoriesController.create);

// Retrieve all categories
router.get("/category", categoriesController.findAll);

// Retrieve a single category with id
router.get("/category/:id", categoriesController.findOne);

// Update a category with id
router.put("/category/:id", categoriesController.update);

// // Delete a category with id
router.delete("/category/:id", categoriesController.delete);

module.exports = router;