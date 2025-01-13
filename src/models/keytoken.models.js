"use strict";

import { Schema, model } from "mongoose"; // Erase if already required
const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "Keys";
// Declare the Schema of the Mongo model
var KeyTokenSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    publicKey: {
      type: String,
      required: true,
    },
    refreshToken: {
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
export default model(DOCUMENT_NAME, KeyTokenSchema);
