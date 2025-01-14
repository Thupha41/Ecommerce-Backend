"use strict";

import keytokenModels from "../models/keytoken.models";
import { BadRequestError } from "../core/error.response";
import { Types } from "mongoose";
class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    //publicKey được sinh ra từ thuật toán bất đối xứng, đang được buffer
    //nên phải chuyển qua string để lưu vào database
    //lv0
    // const publicKeyString = publicKey.toString();
    // const tokens = await keytokenModels.create({
    //   user: userId,
    //   publicKey: publicKeyString,
    // });

    // if (!tokens) {
    //   throw new BadRequestError("Create key token error");
    // }

    //lv1
    try {
      const filter = { user: userId },
        update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken },
        options = {
          upsert: true,
          new: true,
        };
      const tokens = await keytokenModels.findOneAndUpdate({
        filter,
        update,
        options,
      });

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keytokenModels
      .findOne({ user: Types.ObjectId(userId) })
      .lean();
  };

  static removeTokenById = async ({ id }) => {
    const result = await keytokenModels.deleteOne({
      _id: new Types.ObjectId(id),
    });
    return result;
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModels
      .findOne({
        refreshTokenUsed: refreshToken,
      })
      .lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModels.findOne({
      refreshToken,
    });
  };

  static deleteKeyById = async (userId) => {
    return await keytokenModels.findByIdAndDelete({
      user: userId,
    });
  };
}

export default KeyTokenService;
