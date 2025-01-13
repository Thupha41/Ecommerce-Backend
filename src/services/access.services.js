import shopModels from "../models/shop.models";
import bcrypt from "bcrypt";
import crypto from "crypto";
import KeyTokenService from "./keyToken.services";
import { createTokenPair } from "../utils/authUtils";
import { getInfoData } from "../utils/index";
import {
  BadRequestError,
  ConflictRequestError,
  AuthFailureError,
} from "../core/error.response";
import { findByEmail } from "./shop.services";

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {
  static signUp = async ({ name, email, password }) => {
    // check email exist
    const holderShop = await shopModels.findOne({ email }).lean();
    if (!holderShop) {
      throw new BadRequestError("Error: Shop already registered!");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newShop = await shopModels.create({
      name,
      email,
      password: hashPassword,
      roles: [RoleShop.SHOP],
    });

    if (!newShop) {
      throw new BadRequestError("Shop creation failed");
    }

    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });

    const publicKeyString = await KeyTokenService.createKeyToken({
      userId: newShop._id,
      publicKey,
    });

    if (!publicKeyString) {
      throw new BadRequestError("Error: Public key string error");
    }

    const tokens = await createTokenPair(
      { userId: newShop._id, email },
      publicKeyString,
      privateKey
    );

    return {
      shop: getInfoData({
        field: ["_id", "name", "email"],
        object: newShop,
      }),
      tokens,
    };
  };
  /*
    1- check email dbs
    2- match password
    3- create AT and RT and save
    4- generate token
    5- get data return login
  */
  static login = async ({ email, password }) => {
    //1
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Error: Shop not registered!");

    //2
    const isPassMatch = await bcrypt.compare(password, foundShop.password);
    if (!isPassMatch) throw new AuthFailureError("Error: Wrong password!");

    //3

    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });

    //4
    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId,
    });

    return {
      shop: getInfoData({
        field: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeTokenById(keyStore._id);
    return delKey;
  };
}

export default AccessService;
