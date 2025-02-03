import { Router } from "express";
import productControllers from "../../controllers/product.controllers";
import asyncHandler from "../../utils/asyncHandlers";
import { authentication } from "../../utils/authUtils";
const productRouter = Router();

//authentication
accessRouter.use(authentication);

accessRouter.post("/product", asyncHandler(productControllers.createProduct));

export default productRouter;
