import { Router } from "express";
import asyncHandler from "../../utils/asyncHandlers.js";
import { authentication } from "../../utils/authUtils.js";
import discountControllers from "../../controllers/discount.controllers.js";
const discountRouter = Router();

//get amount of discount
discountRouter.post(
  "/amount",
  asyncHandler(discountControllers.getDiscountAmount)
);

discountRouter.get(
  "/list-product-code",
  asyncHandler(discountControllers.getAllDiscountCodesWithProducts)
);

//authentication
discountRouter.use(authentication);

discountRouter.post("/", asyncHandler(discountControllers.createDiscountCode));
discountRouter.get("/", asyncHandler(discountControllers.getAllDiscountCodes));

export default discountRouter;
