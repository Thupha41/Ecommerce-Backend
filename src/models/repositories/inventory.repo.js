import inventoryModels from "../inventory.models.js";
import { Types } from "mongoose";
const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unKnow",
}) => {
  return await inventoryModels.create({
    inv_productId: new Types.ObjectId(productId),
    inv_shopId: new Types.ObjectId(shopId),
    inv_stock: stock,
    inv_location: location,
    inv_status: "active",
  });
};

export { insertInventory };
