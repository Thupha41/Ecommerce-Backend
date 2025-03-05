"use strict";
import models from "../models/product.models.js";
import { insertInventory } from "../models/repositories/inventory.repo.js";
const { product, clothing, electronic, furniture } = models;

import { BadRequestError } from "../core/error.response.js";

import {
  findDrafts,
  publishProduct,
  findPublished,
  unPublishProduct,
  searchProduct,
  findAll,
  findOne,
  updateProductById,
  removeNullOrUndefinedV2,
  updateNestedObjectParser,
} from "../models/repositories/product.repo.js";
//define Factory class to create product

class ProductFactory {
  /*
        type: 'Clothing',
        payload
  */

  static productRegistry = {};
  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }
  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product Types ${type}`);

    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product Types ${type}`);

    return new productClass(payload).updateProduct(productId);
  }

  /// QUERY

  //find all drafts' for shop
  static findAllDraftsForShop = async ({
    product_shop,
    limit = 50,
    skip = 0,
  }) => {
    const query = { product_shop, isDraft: true };
    return await findDrafts({ query, limit, skip });
  };

  //find all published products for shop
  static findAllPublishedForShop = async ({
    product_shop,
    limit = 50,
    skip = 0,
  }) => {
    const query = { product_shop, isPublished: true };
    return await findPublished({ query, limit, skip });
  };

  static searchProductByUser = async ({ keySearch }) => {
    return await searchProduct({ keySearch });
  };

  static findAllProducts = async ({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) => {
    return await findAll({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_description", "product_price"],
    });
  };

  static findOneProduct = async ({ product_id }) => {
    return await findOne({
      product_id,
      unSelect: ["__v", "product_variations"],
    });
  };
  /// END QUERY

  //PUT
  static publishProductByShop = async ({ product_shop, product_id }) => {
    return await publishProduct({ product_shop, product_id });
  };

  static unPublishProductByShop = async ({ product_shop, product_id }) => {
    return await unPublishProduct({ product_shop, product_id });
  };
  //END PUT
}

//define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_price,
    product_quantity,
    product_type,
    product_description,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_description = product_description;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    const newProduct = await product.create({ ...this, _id: product_id });
    if (newProduct) {
      // add product stock into inventory collection
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });
    }
    return newProduct;
  }

  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({
      productId,
      bodyUpdate,
      model: product,
    });
  }
}

//define sub-class for different product type Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("Create new clothing error");
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Create new product error");

    return newProduct;
  }

  async updateProduct(productId) {
    /*
      {
        a: undefined, 
        b: null
      } 
      //1. remove attribute has null / undefined
      //2 check where to update
    */
    //1
    console.log(`[1]`, this);
    const objectParams = removeNullOrUndefinedV2(this);
    console.log(`[2]`, objectParams);
    //2
    if (objectParams.product_attributes) {
      //update child
      await updateProductById({
        productId,
        bodyUpdate: {
          product_attributes: updateNestedObjectParser(
            objectParams.product_attributes
          ),
        },
        model: clothing,
      });
    }

    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );

    return updateProduct;
  }
}

//define sub-class for different product type Electronics
class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("Create new electronic error");
    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("Create new product error");

    return newProduct;
  }
}

//define sub-class for different product type Electronics
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError("Create new furniture error");
    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("Create new product error");

    return newProduct;
  }
}

//register product types
ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);

export default ProductFactory;
