"use strict";

import mongoose, { model, Schema, Types } from "mongoose"; // Erase if already required
const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";
// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema(
  {
    cart_userId: {
      type: Number,
      required: true,
    },
    cart_products: {
      type: Array,
      required: true,
      default: [],
    },
    cart_total_quantity: {
      type: Number,
      default: 0,
    },
    cart_total_price: {
      type: Number,
      default: 0,
    },
    cart_count_product: {
      type: Number,
      default: 0,
    },
    cart_status: {
      type: String,
      enum: ["active", "pending", "failed", "completed"],
      required: true,
      default: "active",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
export default model(DOCUMENT_NAME, cartSchema);
