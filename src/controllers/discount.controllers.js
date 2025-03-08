import DiscountService from "../services/discount.services.js";
import { OK } from "../core/success.response.js";
class DiscountController {
  createDiscountCode = async (req, res, next) => {
    return new OK({
      message: "Create discount code success",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        discount_shopId: req.user.userId,
      }),
    }).send(res);
  };
  getAllDiscountCodes = async (req, res, next) => {
    return new OK({
      message: "Get all discount codes success",
      metadata: await DiscountService.getAllDiscountCodeOfShop({
        ...req.query,
      }),
    }).send(res);
  };
  getDiscountAmount = async (req, res, next) => {
    return new OK({
      message: "Get discount amount success",
      metadata: await DiscountService.getDiscountAmount(req.body),
    }).send(res);
  };
  getAllDiscountCodesWithProducts = async (req, res, next) => {
    return new OK({
      message: "Get all discount codes with products success",
      metadata: await DiscountService.getAllDiscountCodesWithProducts({
        ...req.query,
      }),
    }).send(res);
  };
  cancelDiscountCode = async (req, res, next) => {
    return new OK({
      message: "Cancel discount code success",
      metadata: await DiscountService.cancelDiscountCode(req.body),
    }).send(res);
  };
  deleteDiscountCode = async (req, res, next) => {
    return new OK({
      message: "Delete discount code success",
      metadata: await DiscountService.deleteDiscountCode(req.body),
    }).send(res);
  };
}

export default new DiscountController();
