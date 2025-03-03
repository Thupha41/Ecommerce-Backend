"use strict";
import crypto from "crypto";
import apikeyModels from "../models/apikey.models.js";
import { NotFoundError } from "../core/error.response.js";
import { OK } from "../core/success.response.js";
class ApiKeyService {
  static findById = async (key) => {
    // const newKey = await apikeyModels.create({
    //   key: crypto.randomBytes(64).toString("hex"),
    //   permissions: ["0000"],
    // });
    // console.log(">>> ::check new key: ", newKey);
    const objKey = await apikeyModels.findOne({ key, status: true }).lean();
    if (!objKey) {
      throw new NotFoundError("Not found: API key not found");
    }
    return new OK({
      message: "API key founded!!",
      metadata: objKey,
    });
  };
}

export default ApiKeyService;
