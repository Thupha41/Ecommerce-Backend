"use strict";

import models from "../product.models.js";

const { product, clothing, electronic, furniture } = models;
import {
  convertToObjectIdMongodb,
  getSelectData,
  getUnSelectData,
} from "../../utils/index.js";
import { Types } from "mongoose";

const findDrafts = async ({ query, limit, skip }) => {
  return await queryProducts({ query, limit, skip });
};

const findPublished = async ({ query, limit, skip }) => {
  return await queryProducts({ query, limit, skip });
};

const queryProducts = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const publishProduct = async ({ product_shop, product_id }) => {
  // Find product by shop ID and product ID
  const foundProduct = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  // Check if the product exists
  if (!foundProduct) return null;

  // Update the product's status
  const { modifiedCount } = await product.updateOne(
    { _id: foundProduct._id }, // Filter
    { $set: { isDraft: false, isPublished: true } } // Update values
  );

  return modifiedCount;
};

const unPublishProduct = async ({ product_shop, product_id }) => {
  // Find product by shop ID and product ID
  const foundProduct = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  // Check if the product exists
  if (!foundProduct) return null;

  // Update the product's status
  const { modifiedCount } = await product.updateOne(
    { _id: foundProduct._id }, // Filter
    { $set: { isDraft: true, isPublished: false } } // Update values
  );

  return modifiedCount;
};

const searchProduct = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await product
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();

  return results;
};

const findAll = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return products;
};

const findOne = async ({ product_id, unSelect }) => {
  return await product.findById(product_id).select(getUnSelectData(unSelect));
};

const updateProductById = async ({
  productId,
  bodyUpdate,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(productId, bodyUpdate, {
    new: isNew,
  });
};

const removeNullOrUndefinedV1 = (obj) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
};

const removeNullOrUndefinedV2 = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  });
  return obj;
};

const updateNestedObjectParser = (obj) => {
  // First remove any null/undefined values
  console.log(`[1]`, obj);
  const cleanObj = removeNullOrUndefinedV2(obj);
  console.log(`[2]`, cleanObj);
  const final = {};
  Object.keys(cleanObj).forEach((key) => {
    if (
      typeof cleanObj[key] === "object" &&
      cleanObj[key] !== null &&
      !Array.isArray(cleanObj[key])
    ) {
      // Recursively clean nested objects
      const res = updateNestedObjectParser(cleanObj[key]);
      // Only add nested properties if the result is not empty
      if (Object.keys(res).length > 0) {
        Object.keys(res).forEach((resKey) => {
          final[`${key}.${resKey}`] = res[resKey];
        });
      }
    } else {
      final[key] = cleanObj[key];
    }
  });
  console.log(`[3]`, final);
  return final;
};

const getProductById = async (productId) => {
  return await product.findOne({
    _id: convertToObjectIdMongodb(productId),
  });
};

export {
  findDrafts,
  publishProduct,
  findPublished,
  unPublishProduct,
  searchProduct,
  findAll,
  findOne,
  updateProductById,
  removeNullOrUndefinedV1,
  removeNullOrUndefinedV2,
  updateNestedObjectParser,
  getProductById,
};
