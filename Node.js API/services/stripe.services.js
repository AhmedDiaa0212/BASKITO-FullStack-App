const { STRIPE_CONFIG } = require("../config/app.config");
const stripe = require("stripe")(STRIPE_CONFIG.STEIPE_KEY);

async function createCustomer(params, callback) {
    try{
        const customer = stripe.customers.create({
            name: params.name,
            email: params.email
        })
        return callback(null, customer);
    }
    catch(error){
        return callback(error);
    }
    
}

async function addCards(params, callback) {
    try{
        const card_token = stripe.tokens.create({
            name: params.card_Name,
            number: params.card_Number,
            exp_month: params.card_ExpMonth,
            exp_year: params.card_ExpYear,
            cvc: params.card_CVC

        });

        const card = stripe.customers.createSource(params.customerI_d, {
            source: `${card_token.id}`,
        })
        return callback(null, {card: card.id});
    }
    catch(error){
        return callback(error);
    }
    
}

async function generatePaymentIntent(params, callback) {
    try{
        const createPaymentIntent = await stripe.paymentIntents.create({
            receipt_email: params.receipt_email,
            amount: params.amount,
            currency: STRIPE_CONFIG.CURRENCY,
            payment_method: params.card_id,
            customer: params.customer_id,
            payment_method_type:['card']

        });

        return callback(null, {card: createPaymentIntent});
    }
    catch(error){
        return callback(error);
    }
    
}

module.exports = {
    createCustomer,
    addCards,
    generatePaymentIntent
}