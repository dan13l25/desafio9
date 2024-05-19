import cartsModel from "../models/cart.js";
import Product from "../models/product.js";
import ticketModel from "../models/ticket.js";
import { generateRandomCode } from "../../middlewares/auth.js";

const cartService = {
    async getCartById(cartId) {
        try {
            const cart = await cartsModel.findById(cartId).lean();
            return cart;
        } catch (error) {
            console.error("Error al obtener el carrito:", error.message);
            return null;
        }
    },

    async createCart() {
        try {
            const newCart = new cartsModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error("Error al crear el carrito:", error.message);
            return null;
        }
    },

    async addProduct(cartId, productId) {
        try {
            let cart = await cartsModel.findById(cartId);
            if (!cart) {
                console.log("El carrito no existe.");
                return;
            }

            const product = await Product.findById(productId);
            if (!product) {
                console.log("El producto no existe.");
                return;
            }

            const existingProduct = cart.products.find(item => String(item.product) === String(productId));
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }

            await cart.save();
        } catch (error) {
            console.error("Error al añadir producto al carrito:", error.message);
        }
    },

    async deleteProduct(cartId, productId) {
        try {
            let cart = await cartsModel.findById(cartId);
            if (!cart) {
                console.log("El carrito no existe.");
                return;
            }

            const index = cart.products.findIndex(item => String(item.product) === String(productId));
            if (index !== -1) {
                cart.products.splice(index, 1);
                await cart.save();
            } else {
                console.log("El producto no está en el carrito.");
            }
        } catch (error) {
            console.error("Error al eliminar producto del carrito:", error.message);
        }
    },

    async buyCart(cartId, cartData) {
        const { userId, quantity } = cartData;

        try {
            const cart = await this.getCartById(cartId);

            let totalPurchaseAmount = 0;
            const productsToPurchase = [];
            const productsToKeepInCart = [];

            for (const item of cart.products) {
                const product = await Product.findById(item.product);

                if (!product) {
                    throw new Error(`Producto con ID ${item.product} no encontrado`);
                }

                if (product.stock >= item.productQuantity) {
                    product.stock -= item.productQuantity;
                    await product.save();

                    totalPurchaseAmount += item.productTotal;
                    productsToPurchase.push(item);
                } else {
                    productsToKeepInCart.push(item);
                }
            }

            if (productsToPurchase.length === 0) {
                throw new Error("No hay productos suficientes en stock para realizar la compra");
            }

            const purchase = new Purchase({
                user: userId,
                products: productsToPurchase.map(item => ({
                    product: item.product,
                    productQuantity: item.productQuantity,
                    productTotal: item.productTotal,
                })),
                quantity,
            });

            const ticket = new ticketModel({
                code: generateRandomCode(10),
                purchase_datetime: new Date(),
                amount: totalPurchaseAmount,
                purchaser: userId,
                products: productsToPurchase.map(item => ({
                    id: item.product,
                    product: item.product.title,
                    productQuantity: item.productQuantity,
                    productTotal: item.productTotal,
                })),
            });

            await ticket.save();
            await purchase.save();

            cart.products = productsToKeepInCart;
            await cart.save();

            return ticket;
        } catch (error) {
            throw new Error("Error al realizar la compra: " + error.message);
        }
    },
    
    getPurchaseCart: async () => {
        return "purchase";
    },
};

export default cartService;
