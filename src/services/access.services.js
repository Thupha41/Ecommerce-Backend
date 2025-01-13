import shopModels from "../models/shop.models";
import bcrypt from "bcrypt";
import crypto from "crypto";
import KeyTokenService from "./keyToken.services";
import { createTokenPair } from "../utils/authUtils";
import { getInfoData } from "../utils/index";
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      //step1: check email exist
      const holderShop = await shopModels.findOne({ email }).lean();
      if (!holderShop) {
        return {
          code: "xxxx",
          message: "Shop already registered!",
        };
      }
      //step2: hash user password
      const hashPassword = await bcrypt.hash(password, 10);
      const newShop = await shopModels.create({
        name,
        email,
        password: hashPassword,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        //create Private key: signToken and Public key: VerifyToken
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
        //save colection KeyStore
        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });

        if (!publicKeyString) {
          return {
            code: "xxxx",
            message: "Public key string error",
          };
        }

        const publicKeyObject = crypto.createPublicKey(publicKeyString);
        console.log(`public key object::`, publicKeyObject);
        //create jwt token pair
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKeyString,
          privateKey
        );
        console.log(`Created token success`, tokens);
        return {
          code: 201,
          metadata: {
            shop: getInfoData({
              field: ["_id", "name", "email"],
              object: newShop,
            }),
            tokens,
          },
        };
      }
      return {
        code: 201,
        metadata: {
          shop: null,
        },
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

export default AccessService;
