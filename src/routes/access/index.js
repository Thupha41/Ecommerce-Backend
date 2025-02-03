import { Router } from "express";
import accessControllers from "../../controllers/access.controllers";
import asyncHandler from "../../utils/asyncHandlers";
import { authentication } from "../../utils/authUtils";
const accessRouter = Router();

accessRouter.post("/shop/signup", asyncHandler(accessControllers.signUp));
accessRouter.post("/shop/login", asyncHandler(accessControllers.login));

//authentication
accessRouter.use(authentication);

accessRouter.post("/shop/logout", asyncHandler(accessControllers.logout));
accessRouter.post(
  "/shop/handleRefreshToken",
  asyncHandler(accessControllers.handleRefreshToken)
);

export default accessRouter;
