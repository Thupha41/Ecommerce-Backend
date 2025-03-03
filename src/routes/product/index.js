import { Router } from "express";
import productControllers from "../../controllers/product.controllers.js";
import asyncHandler from "../../utils/asyncHandlers.js";
import { authentication } from "../../utils/authUtils.js";
const productRouter = Router();

//search product
productRouter.get(
  "/search/:keySearch",
  asyncHandler(productControllers.getListSearchProduct)
);

productRouter.get("/", asyncHandler(productControllers.getAllProducts));

productRouter.get(
  "/:product_id",
  asyncHandler(productControllers.getProductDetail)
);

//authentication
productRouter.use(authentication);

//CREATE
productRouter.post("/", asyncHandler(productControllers.createProduct));
productRouter.post(
  "/publish/:id",
  asyncHandler(productControllers.publishProduct)
);
productRouter.post(
  "/unpublish/:id",
  asyncHandler(productControllers.unPublishProduct)
);
//END CREATE

//UPDATE
productRouter.patch(
  "/:productId",
  asyncHandler(productControllers.updateProduct)
);
//END UPDATE

//QUERY
productRouter.get(
  "/drafts/all",
  asyncHandler(productControllers.getAllDraftsForShop)
);

productRouter.get(
  "/published/all",
  asyncHandler(productControllers.getAllPublishedForShop)
);
//END QUERY

export default productRouter;
