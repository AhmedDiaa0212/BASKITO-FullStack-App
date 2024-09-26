const usersController = require("../controllers/users.controller");
const categoriesController = require("../controllers/categories.controller");
const productsController = require("../controllers/products.controller");
const relatedProductsController = require("../controllers/related-products.controller");
const slidersController = require("../controllers/sliders.controller");
const cartsController = require("../controllers/cart.controller");
const ordersController = require("../controllers/order.controller");
const {authenticationToken} = require("../middleware/auth");
const express = require("express");
const router = express.Router();

// auth
router.post("/register", usersController.register);
router.post("/login", usersController.login);

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

// related product
router.post("/relatedProduct", relatedProductsController.create);
router.delete("/relatedProduct/:id", relatedProductsController.delete);

// slider
router.post("/slider", slidersController.create);
router.get("/slider", slidersController.findAll);
router.get("/slider/:id", slidersController.findOne);
router.put("/slider/:id", slidersController.update);
router.delete("/slider/:id", slidersController.delete);

// cart
router.post("/cart", [authenticationToken], cartsController.create);
router.get("/cart", [authenticationToken], cartsController.findAll);
router.delete("/cart", [authenticationToken], cartsController.delete);

// order
router.get("/order", [authenticationToken], ordersController.findAll);
router.post("/order", [authenticationToken], ordersController.create);
router.put("/order", [authenticationToken], ordersController.update);

module.exports = router;