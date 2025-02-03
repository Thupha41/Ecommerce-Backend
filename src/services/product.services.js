"use strict";
import { product, clothing, electronic } from "../models/product.models";
import { BadRequestError } from "../core/error.response";
//define Factory class to create product

class ProductFactory {
  /*
        type: 'Clothing',
        payload
    */
  static async createProduct(type, payload) {
    switch (type) {
      case "Electronics":
        return new Electronics(payload);
      case "Clothing":
        return new Clothing(payload).createProduct();
      default:
        throw new BadRequestError(`Invalid Product Types ${type}`);
    }
  }
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
    return await product.create({ ...this, _id: product_id });
  }
}

//define sub-class for different product type Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes);
    if (!newClothing) throw new BadRequestError("Create new clothing error");
    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Create new product error");

    return newProduct;
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

export default ProductFactory;
