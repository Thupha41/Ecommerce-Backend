import { Router } from "express";
import productControllers from "../../controllers/product.controllers.js";
import asyncHandler from "../../utils/asyncHandlers.js";
import { authentication } from "../../utils/authUtils.js";
const productRouter = Router();

//authentication
productRouter.use(authentication);

productRouter.post("/product", asyncHandler(productControllers.createProduct));

export default productRouter;
