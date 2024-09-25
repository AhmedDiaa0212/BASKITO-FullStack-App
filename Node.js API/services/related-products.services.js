const { product } = require("../models/product.model");
const { relatedProduct } = require("../models/related-products.model"); 

async function addRelatedProducts(params, callback) {
    if (!params.product) {
        return callback(
            {
                message: "Product Id Required"
            },
            ""
        );
    }

    if (!params.relatedProduct) {
        return callback(
            {
                message: "Related Product Id Required"
            },
            ""
        );
    }

    const relatedProductModel = new relatedProduct(params); 
    relatedProductModel
        .save()
        .then(async (response) => {
            await product.findOneAndUpdate(
                {
                    _id: params.product
                },
                {
                    $addToSet: {
                        "relatedProducts": relatedProductModel
                    }
                },
            );
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}

async function removeRelatedProducts(params, callback) {
    const id = params.id;

    relatedProduct.findByIdAndDelete(id)
        .then((response) => {
            if(!response){
                callback("Product Id Not Found");   
            } 
            else{
                callback(null, response);
            }
        })
        .catch((error) => {
            return callback(error);
        });
}

module.exports ={
    addRelatedProducts,
    removeRelatedProducts
}