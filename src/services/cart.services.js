"use strict";

import Cart from "../models/cart.models.js";
import { getProductById } from "../models/repositories/product.repo.js";
import { NotFoundError } from "../core/error.response.js";
/*
    1. Add product to cart [user]
    2. Reduce product quantity by one [user]
    3. Increase product quantity by one [user]
    4. Get list to Cart [user]
    5. Delete cart [user]
    6. Delete cart item [user]
*/

class CartService {
  /// START REPO
  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_status: "active" };
    const updateOrInsert = {
      $addToSet: {
        cart_products: product,
      },
    };
    const options = {
      upsert: true,
      new: true,
    };
    return await Cart.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
      cart_userId: userId,
      cart_status: "active",
      "cart_products.productId": productId,
    };
    const updateSet = {
      $inc: {
        "cart_products.$.quantity": quantity,
      },
    };
    const options = {
      upsert: true,
      new: true,
    };
    return await Cart.findOneAndUpdate(query, updateSet, options);
  }
  /// END REPO

  static async addToCart({ userId, product = {} }) {
    // check cart co ton tai hay khong
    const userCart = await Cart.findOne({ cart_userId: userId });
    if (!userCart) {
      // create new cart
      return await this.createUserCart({ userId, product });
    }
    //neu co gio hang roi nhung chua co san pham?
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    //gio hang ton tai va co san pham thi update quantity
    return await this.updateUserCartQuantity({ userId, product });
  }

  //update cart
  /*
    shop_order_ids: [
        {
            shopId,
            item_products: [
                {
                    quantity,
                    price,
                    shopId,
                    old_quantity,
                    productId,
                }
            ]
            version
        }
    ]
  */

  static async addToCartV2({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];
    //check san pham nay co ton tai hay khong
    const foundProduct = await getProductById(productId);
    if (!foundProduct) {
      throw new NotFoundError("Product not found");
    }
    //compare
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError("Product do not belong to the shop");
    }
    //check so luong
    if (quantity > foundProduct.product_quantity || quantity <= 0) {
      throw new NotFoundError("Product quantity is not enough");
    }
    if (quantity === 0) {
      ///delete
    }
    //update quantity
    return await this.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_status: "active" };
    const updateSet = {
      $pull: {
        cart_products: { productId },
      },
    };
    const deleteCart = await Cart.updateOne(query, updateSet);
    return deleteCart;
  }

  static async getListCart({ userId }) {
    const query = { cart_userId: userId };
    const listCart = await Cart.findOne(query);
    return listCart;
  }
}

export default CartService;
