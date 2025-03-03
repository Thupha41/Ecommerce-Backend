"use strict";
import JWT from "jsonwebtoken";
import asyncHandler from "./asyncHandlers.js";
import { AuthFailureError, NotFoundError } from "../core/error.response.js";
import KeyTokenService from "../services/keyToken.services.js";
const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESH_TOKEN: "x-rtoken-id",
};
export const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      // algorithm: "RS256",
      expiresIn: "2 days",
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      // algorithm: "RS256",
      expiresIn: "14 days",
    });

    //verify token
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify::`, err);
      } else {
        console.log(`decode verify::`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

export const authentication = asyncHandler(async (req, res, next) => {
  /*
  1- check userId missing?
  2- get accessToken
  3- verifyToken
  4- check user in dbs
  5- check keyStore with userId
  6- OK all => return next()
  */

  //1
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Auth Error: Invalid request");

  //2
  const keyStore = await KeyTokenService.findByUserId(userId);
  console.log(">>> check keystore", keyStore);
  if (!keyStore) throw new NotFoundError("Auth Error: Key store not found!");

  //3
  if (req.headers[HEADER.REFRESH_TOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
      const decodeUser = await verifyJWT(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId)
        throw new AuthFailureError("Error: Invalid UserId");
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("AT Error: Invalid Request");

  try {
    const decodeUser = await verifyJWT(accessToken, keyStore.publicKey);
    console.log(">>> check decode user at auth utils: ", decodeUser);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Error: Invalid UserId");
    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (error) {
    throw error;
  }
});

export const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};
