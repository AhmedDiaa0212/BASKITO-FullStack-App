const { model } = require("mongoose");
const { cart } = require("../models/cart.model");
const async = require("async");
async function addCart(params, callback) {
    if (!params.userId) {
        return callback(
            {
                message: "UserId Required"
            },
            ""
        );
    }

    cart.findOne({ userId: params.userId }, function (err, cartDB) {
        if (err) {
            return callback(err);
        }
        else {
            if (cartDB == null) {
                const cartModel = new cart({
                    userId: params.userId,
                    products: params.products
                });

                cartModel
                    .save()
                    .then((response) => {
                        return callback(null, response);
                    })
                    .catch((error) => {
                        return callback(error);
                    });
            }
            else if (cartDB.products.length == 0) {
                cartDB.products = params.products;
                cartDB.save();
                return callback(null, cartDB);
            }
            else {
                async.eachSeries(params.products, function (product, asyncDone) {
                    let itemIdex = cartDB.products.findIndex(p => p.product == product.product);

                    if (itemIdex === -1) {
                        cartDB.push({
                            product: product.product,
                            qty: product.qty
                        });
                        cartDB.save(asyncDone);
                    }
                    else {
                        cartDB.products[itemIdex].qty = cartDB.products[itemIdex].qty + product.qty;
                        cartDB.save(asyncDone);
                    }
                });
                return callback(null, cartDB);
            }
        }
    })
}

async function getCart(params, callback) {
    cart.findOne({ userId: params.userId })
        .populate({
            path: "prproducts",
            populate: {
                path: "product",
                model: "Products",
                select: "productName productPrice productSalePrice productImage",
                populate: {
                    path: "category",
                    model: "Category",
                    select: "categoryName"
                }
            }
        })
        .then((response) => {
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}

async function removeCartItem(params, callback) {
    cart.findOne({ userId: params.userId }, function (err, cartDB) {
        if (err) {
            return callback(err);
        }
        else {
            if(params.productId && params.qty){
                const productId = params.productId;
                const qty = params.qty;

                if(cartDB.products.length == 0){
                    return callback(null, "Cart empty!");
                }
                else{
                    if (itemIdex === -1) {
                        return callback(null, "Invaild Product!");
                    }
                    else{
                        if( cartDB.products[itemIdex].qty === qty){
                            cartDB.product.splice(itemIndex,1)
                        }
                        else if( cartDB.products[itemIdex].qty > qty){
                            cartDB.products[itemIdex].qty = cartDB.products[itemIdex].qty - product.qty;

                        }
                        else{
                            return callback(null, "Enter lower Qty!");

                        }
                        cartDB.save((err,cartM)=>{
                            if(err) return callback(err);
                            return callback(null, "Cart update");
                        })

                    }
                }
            }
        }
    },
    );
}

module.exports={
    addCart,
    getCart,
    removeCartItem
}