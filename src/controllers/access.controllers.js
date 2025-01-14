import AccessService from "../services/access.services";
import { CREATED, OK } from "../core/success.response";
class AccessController {
  login = async (req, res, next) => {
    return new OK({
      message: "Shop login successfully",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    console.log(`[P]::signUp::`, req.body);
    const result = await AccessService.signUp(req.body);
    return new CREATED({
      message: "Shop created successfully",
      metadata: result,
    }).send(res);
  };

  logout = async (req, res, next) => {
    return new OK({
      message: "Shop logout successfully",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  handleRefreshToken = async (req, res, next) => {
    return new OK({
      message: "Get token successfully",
      metadata: await AccessService.handleRefreshToken(req.body.refreshToken),
    }).send(res);
  };
}

export default new AccessController();
