"use strict";
import crypto from "crypto";
import apikeyModels from "../models/apikey.models";

class ApiKeyService {
  static findById = async (key) => {
    // const newKey = await apikeyModels.create({
    //   key: crypto.randomBytes(64).toString("hex"),
    //   permissions: ["0000"],
    // });
    console.log(newKey);
    const objKey = await apikeyModels.findOne({ key, status: true }).lean();
    return objKey;
  };
}

export default ApiKeyService;
