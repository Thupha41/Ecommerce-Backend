"use strict";

import keytokenModels from "../models/keytoken.models";

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey }) => {
    try {
      //publicKey được sinh ra từ thuật toán bất đối xứng, đang được buffer
      //nên phải chuyển qua string để lưu vào database
      const publicKeyString = publicKey.toString();
      const tokens = await keytokenModels.create({
        user: userId,
        publicKey: publicKeyString,
      });

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

export default KeyTokenService;
