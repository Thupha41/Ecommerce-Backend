import shopModels from "../models/shop.models.js";
import bcrypt from "bcrypt";
import crypto, { verify } from "crypto";
import KeyTokenService from "./keyToken.services.js";
import { createTokenPair, verifyJWT } from "../utils/authUtils.js";
import { getInfoData } from "../utils/index.js";
import {
  BadRequestError,
  ConflictRequestError,
  AuthFailureError,
  ForbiddenRequestError,
} from "../core/error.response.js";
import { findByEmail } from "./shop.services.js";

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
    if (holderShop) {
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

    // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    //   modulusLength: 4096,
    //   publicKeyEncoding: {
    //     type: "pkcs1",
    //     format: "pem",
    //   },
    //   privateKeyEncoding: {
    //     type: "pkcs8",
    //     format: "pem",
    //   },
    // });

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    console.log({ privateKey, publicKey });

    const keyStore = await KeyTokenService.createKeyToken({
      userId: newShop._id,
      publicKey,
      privateKey,
    });

    console.log(">>> check keystore", keyStore);

    if (!keyStore) {
      throw new BadRequestError("Bad Request Error: Public key string error");
    }

    const tokens = await createTokenPair(
      { userId: newShop._id, email },
      publicKey,
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
    if (!isPassMatch) throw new AuthFailureError("Auth Error: Wrong password!");

    //3

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

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

  /*
    1. check token reused before -> If yes -> Revoke
    2. check RT exists
    3. Verify token and check who is using it
    4. Check if user exist before issue new tokens
    5. Create new pair of tokens
  */
  static handleRefreshToken = async (refreshToken) => {
    console.log("Checking refresh token:", refreshToken);
    //1️⃣ Check if the refresh token was previously used
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    console.log("Found used token:", foundToken);

    if (foundToken) {
      //Decode token to get user details
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      console.log({ userId, email });
      // Immediately revoke all tokens for the user
      console.log("Deleting tokens for userId:", userId);
      const deleteResult = await KeyTokenService.deleteKeyById(userId);
      console.log("Delete result:", deleteResult);
      throw new ForbiddenRequestError(
        "Error: Something wrong happened! Please re-login"
      );
    }

    // 2️⃣ Check if refresh token exists
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError("Error: Shop not registered");

    // 3️⃣ Verify the token
    console.log("============START============");
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    console.log("============END============");
    console.log(">>> 2", { userId, email });
    // 4️⃣ Verify the user exists before issuing new pair of tokens
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Error: Shop not registered");

    // 5️⃣ Generate new token pair
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    //6️⃣Update the refresh token in the database
    await KeyTokenService.findByIdAndUpdate(holderToken._id, {
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, // Store old token to detect reuse
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };

  static handleRefreshTokenV2 = async ({ user, refreshToken, keyStore }) => {
    const { userId, email } = user;

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenRequestError(
        "Error: Something wrong happened! Please re-login"
      );
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError("Error: Shop not registered");
    }

    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Error: Shop not registered");

    // create 1 cap token moi
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    //update token
    await KeyTokenService.findByIdAndUpdate(keyStore._id, {
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, // Store old token to detect reuse
      },
    });

    return {
      user,
      tokens,
    };
  };
}

export default AccessService;
