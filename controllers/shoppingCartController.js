import Product from "../models/productModel.js";
import ShoppingCart from "../models/shoppingCartModel.js";
import mongoose from 'mongoose';

export const insert = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, variantId, quantity, sizes } = req.body;

        if (!productId || !variantId || quantity == null) {
            return res.status(400).json({ message: "Missing productId, variantId, or quantity" });
        }

        const cartItem = new ShoppingCart({
            userId,
            productId,
            sizes,
            variantId,
            quantity
        });

        const savedItem = await cartItem.save();
        res.status(201).json({ message: "Cart item added", item: savedItem });
    } catch (err) {
        res.status(500).json({ message: "Failed to add cart item", error: err.message });
    }
}


export const getCartItemsByUser = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // Use `new` when converting string to ObjectId
        const cartItems = await ShoppingCart.find({ userId: new mongoose.Types.ObjectId(userId) });

        const detailedCartItems = await Promise.all(
            cartItems.map(async (item) => {
                const product = await Product.findById(item.productId).lean();
                if (!product) return null;

                // Use product.variants instead of Product.variants
                const variant = product.variants.find(
                    (v) => v._id.toString() === item.variantId.toString()
                );

                return {
                    id: item._id,
                    productId: item.productId,
                    variantId: item.variantId,
                    quantity: item.quantity,
                    price: product.sellingPrice,
                    discount: product.discount,
                    sizes: item.sizes,
                    productName: product.name,
                    variantColor: variant ? variant.color : null,
                    variantMainImage: variant ? variant.mainImage : null,
                };
            })
        );

        const filteredCartItems = detailedCartItems.filter(i => i !== null);

        res.status(200).json({ cartItems: filteredCartItems });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};



export const removeCartItem = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedItem = await ShoppingCart.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ message: "Cart not found" });
        }

        res.status(200).json({ message: "Cart item deleted", item: deletedItem });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const clearCart = async (req, res) => {
    try {
        const result = await ShoppingCart.deleteMany({ userId: req.user.id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No cart items found for this user." });
        }

        res.status(200).json({ message: "All cart items deleted successfully." });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
