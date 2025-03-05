"use strict";

import mongoose, { model, Schema, Types } from "mongoose";
const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";
// Declare the Schema of the Mongo model
var inventorySchema = new mongoose.Schema(
  {
    inv_productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    inv_location: {
      type: String,
      default: "unKnow",
      required: true,
    },
    inv_stock: {
      type: Number,
      required: true,
    },
    inv_shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    inv_status: {
      type: String,
      required: true,
      enum: ["active", "inactive"],
    },
    /*
       Khi người ta đặt hàng, mình sẽ trừ vào số lượng hàng tồn kho
       Khi người ta thanh toán, mình sẽ xóa đi đơn đặt
    */
    inv_reservation: {
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
export default model(DOCUMENT_NAME, inventorySchema);
