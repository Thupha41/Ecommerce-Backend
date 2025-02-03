"use strict";
import { Router } from "express";
import { apiKey, checkPermission } from "../utils/checkAuth";
import accessRouter from "./access";
import productRouter from "./product";
const router = Router();
//check apiKey
router.use(apiKey);
//check permission
router.use(checkPermission("0000"));

router.use("/api/v1", accessRouter);
router.use("api/v1", productRouter);

export default router;
