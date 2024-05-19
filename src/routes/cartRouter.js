import { Router } from "express";
import CartController from "../controllers/cartController.js";
import { authToken, isUser } from "../config/jwtConfig.js";

const cartRouter = Router();
const cartController = new CartController();

cartRouter.post("/", cartController.createCart)

cartRouter.get("/:cartId", cartController.getCartById);  

cartRouter.post("/:cartId/product/:productId", cartController.addProduct)

cartRouter.post("/:cartId/buy", cartController.buyCart);

cartRouter.get("/:cid/purchase", authToken, isUser, cartController.getBuyCart);


export { cartRouter };
