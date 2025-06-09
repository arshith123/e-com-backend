import mongoose from "mongoose";

const shoppingCartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    variantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    sizes: {
        type: String,
        required: true
    },
    variantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const ShoppingCart = mongoose.model('ShoppingCart', shoppingCartSchema);
export default ShoppingCart;
