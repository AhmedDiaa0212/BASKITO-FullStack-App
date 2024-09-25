const { cart } = require("../models/cart.model");

async function addCart(params, callback) {
    if (!params.userId) {
        return callback({ message: "UserId Required" }, "");
    }

    try {
        // Find the cart using Promises or async/await
        let cartDB = await cart.findOne({ userId: params.userId });

        if (!cartDB) {
            // Create a new cart if none is found
            const cartModel = new cart({
                userId: params.userId,
                products: params.products
            });
            const response = await cartModel.save();
            return callback(null, response);
        } else if (cartDB.products.length === 0) {
            cartDB.products = params.products;
            await cartDB.save();
            return callback(null, cartDB);
        } else {
            // Handle adding or updating products using async/await
            for (let product of params.products) {
                // Find the index of the product in the existing cart
                let itemIndex = cartDB.products.findIndex(p => p.product.toString() === product.product);
                
                if (itemIndex === -1) {
                    // If product is not in the cart, add it
                    cartDB.products.push({
                        product: product.product,
                        qty: product.qty
                    });
                } else {
                    // If product is already in the cart, update the quantity
                    cartDB.products[itemIndex].qty = Number(cartDB.products[itemIndex].qty) + Number(product.qty);
                }
            }
            await cartDB.save();
            return callback(null, cartDB);
        }
    } catch (err) {
        return callback(err);
    }
}

async function getCart(params, callback) {
    try {
        const cartDB = await cart.findOne({ userId: params.userId })
            .populate({
                path: "products.product", // Correct the path here
                select: "productName productPrice productSalePrice productImage",
                populate: {
                    path: "category", // Adjust if necessary based on your Product model
                    model: "Category",
                    select: "categoryName"
                }
            });

        return callback(null, cartDB);
    } catch (error) {
        return callback(error);
    }
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