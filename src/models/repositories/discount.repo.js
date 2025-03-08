"use strict";

import { getUnSelectData, getSelectData } from "../../utils/index.js";

export const findAllDiscountCodeUnselect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  unSelect,
  filter,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectData(unSelect))
    .lean();

  return documents;
};

export const findAllDiscountCodeSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  select,
  filter,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return documents;
};

export const checkDiscountExist = async ({ model, filter }) => {
  return await model.findOne(filter).lean();
};
