const { MONG0_DB_CONFIG } = require("../config/app.config");
const { product } = require("../models/product.model");

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

    if (params.productIds) {
        condition["_id"] = {
            $in: params.productIds.split(",")
        }
    }

    let perPage = Math.abs(params.pageSize) || MONG0_DB_CONFIG.PAGE_SIZE;
    let page = (Math.abs(params.page) || 1) - 1;

    product
        .find(condition, "productId productName productShortDescription productPrice productSalePrice productImage productSKU productType stockStatus")
        .populate("category", "categoryName categoryImage")
        .populate("relatedProducts", "relatedProduct") 
        .limit(perPage)
        .skip(perPage * page)
        .then((response) => {
                var res = response.map(r => {
                    r.relatedProducts = r.relatedProducts.length > 0 ? r.relatedProducts : ["No related products found"];
                    return r;
                });
            return callback(null, res);
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
        .populate("relatedProducts", "relatedProduct") 
        .then((response) => {
            if (!response) {
                return callback({
                    message: "Product not found with ID " + productId,
                });
            }
            response.relatedProducts = response.relatedProducts.map(x => {return x.relatedProduct});

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