"use strict";
import _ from "lodash";

export const getInfoData = ({ field = [], object = {} }) => {
  return _.pick(object, field);
};

// ['a', 'b'] => {a: 1, b: 1}
export const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

export const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};
