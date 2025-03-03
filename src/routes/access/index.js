import { Router } from "express";
import accessControllers from "../../controllers/access.controllers.js";
import asyncHandler from "../../utils/asyncHandlers.js";
import { authentication } from "../../utils/authUtils.js";
const accessRouter = Router();

accessRouter.post("/signup", asyncHandler(accessControllers.signUp));
accessRouter.post("/login", asyncHandler(accessControllers.login));

//authentication
accessRouter.use(authentication);

accessRouter.post("/logout", asyncHandler(accessControllers.logout));
accessRouter.post(
  "/handleRefreshToken",
  asyncHandler(accessControllers.handleRefreshToken)
);

export default accessRouter;
