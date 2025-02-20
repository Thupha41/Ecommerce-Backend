import shopModels from "../models/shop.models.js";

export const findByEmail = async ({
  email,
  select = {
    email: 1,
    password: 1,
    name: 1,
    status: 1,
    roles: 1,
  },
}) => {
  return await shopModels.findOne({ email }).select(select).lean();
};
