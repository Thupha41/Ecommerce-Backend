"use strict";
import crypto from "crypto";
import apikeyModels from "../models/apikey.models";
import { NotFoundError } from "../core/error.response";
import { OK } from "../core/success.response";
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
