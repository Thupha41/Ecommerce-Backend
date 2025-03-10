import { Router } from "express";
import asyncHandler from "../../utils/asyncHandlers.js";
import { authentication } from "../../utils/authUtils.js";
import cartControllers from "../../controllers/cart.controllers.js";
const cartRouter = Router();

//authentication
// cartRouter.use(authentication);

cartRouter.post("/update", asyncHandler(cartControllers.updateCart));

cartRouter.delete("/", asyncHandler(cartControllers.deleteUserCart));

cartRouter.post("/", asyncHandler(cartControllers.addToCart));
cartRouter.get("/", asyncHandler(cartControllers.getListCart));

export default cartRouter;
