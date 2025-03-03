"use strict";
import ApiKeyService from "../services/apikey.services.js";
import { ForbiddenRequestError } from "../core/error.response.js";
const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};
export const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error: Wrong API-KEY",
      });
    }

    //check objKey
    const objKey = await ApiKeyService.findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error: Can not find API-KEY",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {
    console.error(error);
  }
};

export const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.metadata.permissions) {
      return res.status(403).json({
        message:
          "Forbidden Error: Can not find permissions -> Permission Denied!!",
      });
    }
    const validPermission =
      req.objKey.metadata.permissions.includes(permission);

    if (!validPermission) {
      return res.status(403).json({
        message: "Forbidden Error: Permission invalid!!!",
      });
    }
    return next();
  };
};
