"use strict";
import _ from "lodash";

export const getInfoData = ({ field = [], object = {} }) => {
  return _.pick(object, field);
};
