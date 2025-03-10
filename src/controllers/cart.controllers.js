import CartService from "../services/cart.services.js";
import { OK } from "../core/success.response.js";

class CartController {
  static async addToCart(req, res, next) {
    return new OK({
      message: "Add to cart success",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  }

  static async updateCart(req, res, next) {
    return new OK({
      message: "Update cart success",
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  }

  static async deleteUserCart(req, res, next) {
    return new OK({
      message: "Delete cart success",
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res);
  }

  static async getListCart(req, res, next) {
    return new OK({
      message: "Get list cart success",
      metadata: await CartService.getListCart(req.query),
    }).send(res);
  }
}

// Export the class itself, not an instance
export default CartController;
