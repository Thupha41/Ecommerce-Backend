import ProductService from "../services/product.services";
import { CREATED, OK } from "../core/success.response";
class ProductController {
  createProduct = async (req, res, next) => {
    new OK({
      message: "Create new product successfully",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }).send(res),
    });
  };
}

export default new ProductController();
