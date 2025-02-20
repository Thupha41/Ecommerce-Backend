"use strict";

import mongoose, { model, Schema, Types } from "mongoose";

const DOCUMENT_NAME = "Apikey";
const COLLECTION_NAME = "Apikeys";

// Declare the Schema of the Mongo model
const apiKeySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: ["0000", "1111", "2222"],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Export the model
export default model(DOCUMENT_NAME, apiKeySchema);
