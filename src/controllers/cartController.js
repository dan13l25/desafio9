import cartService from "../dao/services/cartService.js";

export default class CartController {
    constructor() {
        console.log("CartController funciona");
    }

    async getCartById(req, res) {
        const { cartId } = req.params;
        try {
            const cart = await cartService.getCartById(cartId);
            if (cart) {
                res.json(cart);
            } else {
                res.status(404).send("Carrito no encontrado");
            }
        } catch (error) {
            console.error("Error al obtener el carrito:", error.message);
            res.status(500).send("Error interno del servidor");
        }
    }

    async createCart(req, res) {
        try {
            const newCart = await cartService.createCart();
            res.json(newCart);
        } catch (error) {
            console.error("Error al crear el carrito:", error.message);
            res.status(500).send("Error interno del servidor");
        }
    }

    async addProduct(req, res) {
        const { cartId, productId } = req.params;
        try {
            await cartService.addProduct(cartId, productId);
            res.send("Producto añadido al carrito correctamente");
        } catch (error) {
            console.error("Error al añadir producto al carrito:", error.message);
            res.status(500).send("Error interno del servidor");
        }
    }

    async deleteProduct(req, res) {
        const { cartId, productId } = req.params;
        try {
            await cartService.deleteProduct(cartId, productId);
            res.send("Producto eliminado del carrito correctamente");
        } catch (error) {
            console.error("Error al eliminar producto del carrito:", error.message);
            res.status(500).send("Error interno del servidor");
        }
    }

    async buyCart(req, res) {
        const { cartId } = req.params;
        const cartData = req.body;
        try {
            const ticket = await cartService.buyCart(cartId, cartData);
            res.json(ticket);
        } catch (error) {
            console.error("Error al realizar la compra:", error.message);
            res.status(500).send("Error interno del servidor");
        }
    }

    async getBuyCart(req, res) {
        const { cartId } = req.params;
        const userId = req.session.userId;
        const user = req.session.user;
        const isAuthenticated = req.session.isAuthenticated;
        const jwtToken = req.session.token;

        try {
            const cart = await cartService.getCartById(cartId, userId);
            const purchaseCartView = await cartService.getPurchaseCart();
            res.render(purchaseCartView, { user, isAuthenticated, jwtToken, cart });
        } catch (error) {
            console.error("Error al obtener el carrito de compra:", error.message);
            res.status(500).send("Error interno del servidor");
        }
    }
}
