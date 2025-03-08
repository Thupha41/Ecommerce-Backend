"use strict";
import discountModels from "../models/discount.models.js";
import { BadRequestError, NotFoundError } from "../core/error.response.js";
import { convertToObjectIdMongodb } from "../utils/index.js";
import { findAll } from "../models/repositories/product.repo.js";
import {
  findAllDiscountCodeUnselect,
  checkDiscountExist,
} from "../models/repositories/discount.repo.js";
/**
 * Discount services
 * 1/ generator discount shop [shop | admin]
 * 2/ get discount amount || get all discount codes [user]
 * 3/ get all discount codes || get all product by discount code [user | shop | admin]
 * 4/ Verify discount code [user]
 * 5/ delete discount code [Admin | Shop]
 * 6/ Cancel discount code [user]
 */

class DiscountService {
  //1/ generator discount shop [shop | admin]
  static async createDiscountCode(payload) {
    const {
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      discount_code,
      discount_max_uses,
      discount_max_uses_per_user,
      discount_min_order_value,
      discount_start_date,
      discount_end_date,
      discount_is_active,
      discount_apply_to,
      discount_product_ids,
      discount_shopId,
      discount_used_count,
      discount_users_used,
    } = payload;

    // if (
    //   new Date() < new Date(discount_start_date) ||
    //   new Date() > new Date(discount_end_date)
    // ) {
    //   throw new BadRequestError("Discount code has expired");
    // }

    if (new Date(discount_start_date) > new Date(discount_end_date)) {
      throw new BadRequestError("Start date must be before end date");
    }

    //create index for discount code
    const foundDiscount = await discountModels
      .findOne({
        discount_code,
        discount_is_active: true,
        discount_shopId: convertToObjectIdMongodb(discount_shopId),
      })
      .lean();
    if (foundDiscount) {
      throw new BadRequestError("Discount code already exists");
    }
    const discount = await discountModels.create({
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      discount_code,
      discount_max_uses,
      discount_max_uses_per_user,
      discount_min_order_value: discount_min_order_value || 0,
      discount_start_date: new Date(discount_start_date),
      discount_end_date: new Date(discount_end_date),
      discount_is_active: discount_is_active || true,
      discount_apply_to: discount_apply_to || "all",
      discount_product_ids:
        discount_apply_to === "specific" ? discount_product_ids : [],
      discount_shopId: convertToObjectIdMongodb(discount_shopId),
      discount_used_count: discount_used_count || 0,
      discount_users_used: discount_users_used || [],
    });
    return discount;
  }

  static async updateDiscountCode(discountId, payload) {}

  //Get all discounts codes available with products
  static async getAllDiscountCodesWithProducts({
    discount_code,
    discount_shopId,
    userId,
    limit,
    page,
  }) {
    //create index for discount_code
    const foundDiscount = await discountModels
      .findOne({
        discount_code,
        discount_is_active: true,
        discount_shopId: convertToObjectIdMongodb(discount_shopId),
      })
      .lean();
    if (!foundDiscount) {
      throw new NotFoundError("Discount code not found");
    }

    //get all products
    const { discount_apply_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_apply_to === "all") {
      //get all products
      products = await findAll({
        limit: +limit || 50,
        page: +page || 1,
        sort: "ctime",
        select: ["product_name"],
        filter: {
          product_shop: convertToObjectIdMongodb(discount_shopId),
          isPublished: true,
        },
      });
    }
    if (discount_apply_to === "specific") {
      //get product ids
      products = await findAll({
        limit: +limit || 50,
        page: +page || 1,
        sort: "ctime",
        select: ["product_name"],
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
      });
    }
    return products;
  }

  // Get all discount code of shop
  static async getAllDiscountCodeOfShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodeUnselect({
      limit: +limit || 50,
      page: +page || 1,
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true,
      },
      unSelect: ["__v", "discount_shopId"],
      model: discountModels,
    });
    return discounts;
  }

  //Apply discount code
  /*
     products = {
      {
        productId,
        shopId,
        quantity,
        name, 
        price
      },
            {
        productId,
        shopId,
        quantity,
        name, 
        price
      },
     }
  */
  static async getDiscountAmount({ products, userId, shopId, code }) {
    const foundDiscount = await checkDiscountExist({
      model: discountModels,
      filter: {
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true,
      },
    });
    if (!foundDiscount) {
      throw new NotFoundError("Discount code not found");
    }
    const {
      discount_is_active,
      discount_max_uses,
      discount_max_uses_per_user,
      discount_users_used,
      discount_min_order_value,
      discount_value,
      discount_type,
    } = foundDiscount;

    if (!discount_is_active) {
      throw new BadRequestError("Discount code is not active");
    }

    if (discount_max_uses === 0) {
      throw new BadRequestError("Discount code has reached the maximum usage");
    }

    if (discount_max_uses_per_user === 0) {
      throw new BadRequestError(
        "Discount code has reached the maximum usage per user"
      );
    }

    // if (
    //   new Date() > new Date(foundDiscount.discount_start_date) ||
    //   new Date() < new Date(foundDiscount.discount_end_date)
    // ) {
    //   throw new BadRequestError("Discount code has expired");
    // }
    // check xem co gia tri toi thieu hay khong
    let totalOrder = 0;
    if (discount_min_order_value > totalOrder) {
      totalOrder = products.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      );
    }
    if (totalOrder < discount_min_order_value) {
      throw new BadRequestError(
        `Discount requires a minimum order value ${discount_min_order_value}`
      );
    }

    if (discount_max_uses_per_user > 0) {
      const userUseDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );
      if (userUseDiscount) {
        throw new BadRequestError(
          "Discount code has reached the maximum usage per user"
        );
      }
    }

    //check xem discount nay la fixed amount hay percentage
    const discountAmount =
      discount_type === "fixed_amount"
        ? discount_value
        : (totalOrder * discount_value) / 100;
    return {
      discount_amount: discountAmount,
      totalOrder,
      totalPrice: totalOrder - discountAmount,
    };
  }

  static deleteDiscountCode = async ({ shopId, discountCode }) => {
    const deleted = await discountModels.findOneAndDelete({
      discount_code: discountCode,
      discount_shopId: convertToObjectIdMongodb(shopId),
    });
    if (!deleted) {
      throw new NotFoundError("Discount code not found");
    }
    return deleted;
  };

  //Cancel discount code ()
  static cancelDiscountCode = async ({ shopId, discountCode, userId }) => {
    const foundDiscount = await checkDiscountExist({
      model: discountModels,
      filter: {
        discount_code: discountCode,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });
    if (!foundDiscount) {
      throw new NotFoundError("Discount code not found");
    }
    const result = await discountModels.findByIdAndUpdate(
      foundDiscount._id,
      {
        $pull: {
          discount_users_used: userId,
        },
        $inc: {
          discount_used_count: -1,
          discount_max_uses: 1,
        },
      },
      {
        new: true,
      }
    );
    return result;
  };
}

export default DiscountService;
