import { Router } from "express";
import accessControllers from "../../controllers/access.controllers";
const accessRouter = Router();

accessRouter.post("/shop/signup", accessControllers.signUp);

export default accessRouter;
