import mongoose from "mongoose";



//variant schema 
const variantSchema = new mongoose.Schema({
    color: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
    },
    mainImage: {
        type: String,
        required: false,
    },
    sideImages: [
        {
            type: String
        }
    ]
});


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    sizes: {
        type: [String],  
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    sellingPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    discount: {
        type: Number,
        required: true,
        min: 0,
    },

    variants: [variantSchema],

    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const Product = mongoose.model('products', productSchema);
export default Product;