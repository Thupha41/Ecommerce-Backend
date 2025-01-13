import AccessService from "../services/access.services";

class AccessController {
  signUp = async (req, res, next) => {
    try {
      console.log(`[P]::signUp::`, req.body);
      const result = await AccessService.signUp(req.body);
      return res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };
}

export default new AccessController();
