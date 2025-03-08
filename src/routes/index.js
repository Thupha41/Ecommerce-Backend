"use strict";
import { Router } from "express";
import { apiKey, checkPermission } from "../utils/checkAuth.js";
import accessRouter from "./access/index.js";
import productRouter from "./product/index.js";
import discountRouter from "./discount/index.js";
const router = Router();
//check apiKey
router.use(apiKey);
//check permission
router.use(checkPermission("0000"));

router.use("/api/v1/products", productRouter);
router.use("/api/v1/shop", accessRouter);
router.use("/api/v1/discount", discountRouter);

export default router;
