import ProductService from "../services/product.services.xxx.js";
import { CREATED, OK } from "../core/success.response.js";
class ProductController {
  createProduct = async (req, res, next) => {
    new OK({
      message: "Create new product successfully",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  publishProduct = async (req, res, next) => {
    new OK({
      message: "Publish a product successfully",
      metadata: await ProductService.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  unPublishProduct = async (req, res, next) => {
    new OK({
      message: "Publish a product successfully",
      metadata: await ProductService.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    new OK({
      message: "Update product successfully",
      metadata: await ProductService.updateProduct(
        req.body.product_type,
        req.params.productId,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
  };

  // QUERY
  /**
   * @desc Get all Draft Products for shop
   * @param {number} limit
   * @param {number} skip
   * @return {JSON} res
   */
  getAllDraftsForShop = async (req, res, next) => {
    new OK({
      message: "Get list product with draft status successfully",
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @desc Get all Published Products for shop
   * @param {number} limit
   * @param {number} skip
   * @return {JSON} res
   */
  getAllPublishedForShop = async (req, res, next) => {
    new OK({
      message: "Get list product with published status successfully",
      metadata: await ProductService.findAllPublishedForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getListSearchProduct = async (req, res, next) => {
    const keySearch = req.params.keySearch;

    new OK({
      message: "Get list search products successfully",
      metadata: await ProductService.searchProductByUser({ keySearch }),
    }).send(res);
  };

  getAllProducts = async (req, res, next) => {
    new OK({
      message: "Get all products successfully",
      metadata: await ProductService.findAllProducts(req.query),
    }).send(res);
  };

  getProductDetail = async (req, res, next) => {
    new OK({
      message: "Get product detailed successfully",
      metadata: await ProductService.findOneProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
  // END QUERY
}

export default new ProductController();
