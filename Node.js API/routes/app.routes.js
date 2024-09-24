const categoriesController = require("../controllers/categories.controller");
const productsController = require("../controllers/products.controller");
const usersController = require("../controllers/users.controller");
const express = require("express");
const router = express.Router();

// category
router.post("/category", categoriesController.create);
router.get("/category", categoriesController.findAll);
router.get("/category/:id", categoriesController.findOne);
router.put("/category/:id", categoriesController.update);
router.delete("/category/:id", categoriesController.delete);

// product
router.post("/product", productsController.create);
router.get("/product", productsController.findAll);
router.get("/product/:id", productsController.findOne);
router.put("/product/:id", productsController.update);
router.delete("/product/:id", productsController.delete);

// auth
router.post("/register", usersController.register);
router.post("/login", usersController.login);


module.exports = router;