const { MONG0_DB_CONFIG } = require("../config/app.config");
const { product } = require("../models/product.model");
const { category } = require("../models/category.model");

async function createProduct(params, callback) {
    if (!params.productName) {
        return callback(
            {
                message: "Product Name Required"
            },
            ""
        );
    }

    if (!params.category) {
        return callback(
            {
                message: "Category Required"
            },
            ""
        );
    }

    const productModel = new product(params);
    productModel
        .save()
        .then((response) => {
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}

async function getProducts(params, callback) {
    const productName = params.productName;
    const categoryId = params.categoryId;
    var condition = {};

    if (productName) {
        condition["productName"] = { $regex: new RegExp(productName), $options: "i" };
    }

    if (categoryId) {
        condition["category"] = categoryId;
    }

    let perPage = Math.abs(params.pageSize) || MONG0_DB_CONFIG.PAGE_SIZE;
    let page = (Math.abs(params.page) || 1) - 1;

    product
        .find(condition, "productId productName productShortDescription productPrice productSalePrice productImage productSKU productType stockStatus")
        .populate("category", "categoryName categoryImage")
        .limit(perPage)
        .skip(perPage * page)
        .then((response) => {
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}


async function getProductById(params, callback) {
    const productId = params.productId;

    product
        .findById(productId)
        .populate("category", "categoryName categoryImage")
        .then((response) => {
            if (!response) {
                return callback({
                    message: "Product not found with ID " + productId,
                });
            }
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}

async function updateProduct(params, callback) {
    const productId = params.productId;

    product
        .findByIdAndUpdate(productId, params, { useFindAndModify: false })
        .then((response) => {
            if (!response) {
                return callback({
                    message: "Not found product with ID " + productId,
                });
            }
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}

async function deleteProduct(params, callback) {
    ``
    const productId = params.productId;

    product
        .findByIdAndDelete(productId)
        .then((response) => {
            if (!response) {
                return callback({
                    message: "Not found product with ID " + productId,
                });
            }
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
}