"use strict";

import mongoose, { model, Schema, Types } from "mongoose";
const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";
// Declare the Schema of the Mongo model
var discountSchema = new mongoose.Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      default: "unKnow",
      required: true,
    },
    discount_type: {
      type: String,
      default: "fixed_amount",
      enum: ["fixed_amount", "percentage"],
    },
    discount_value: {
      type: Number,
      required: true,
    },
    discount_code: {
      type: String,
      required: true,
    },
    //Số lượng discount tối đa được áp dụng
    discount_max_uses: {
      type: Number,
      required: true,
    },
    //Số discount đã sử dụng
    discount_used_count: {
      type: Number,
      required: true,
    },
    //Ai là người đã sử dụng nó
    discount_users_used: {
      type: Array,
      default: [],
    },
    discount_start_date: {
      type: Date,
      required: true,
    },
    discount_end_date: {
      type: Date,
      required: true,
    },
    //Mỗi user được sử dụng tối đa bao nhiêu
    discount_max_uses_per_user: {
      type: Number,
      required: true,
    },
    //Giá trị đơn hàng tối thiểu để áp dụng
    discount_min_order_value: {
      type: Number,
      required: true,
      default: 0,
    },
    discount_shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    discount_is_active: {
      type: Boolean,
      default: true,
      required: true,
    },
    //Áp dụng cho tất cả sản phẩm hay không
    discount_apply_to: {
      type: String,
      default: "all",
      enum: ["all", "specific"],
    },
    //Số sản phẩm được áp dụng
    discount_product_ids: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
export default model(DOCUMENT_NAME, discountSchema);
