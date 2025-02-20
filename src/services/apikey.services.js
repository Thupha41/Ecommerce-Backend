"use strict";
import crypto from "crypto";
import apikeyModels from "../models/apikey.models.js";
import { NotFoundError } from "../core/error.response.js";
import { OK } from "../core/success.response.js";
class ApiKeyService {
  static findById = async (key) => {
    const objKey = await apikeyModels.findOne({ key, status: true }).lean();
    if (!objKey) {
      throw new NotFoundError("API key not found");
    }
    return new OK({
      message: "API key found",
      metadata: objKey,
    });
  };
}

export default ApiKeyService;
