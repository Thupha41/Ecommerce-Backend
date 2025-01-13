"use strict";

import mongoose from "mongoose";
import config from "../configs/config.mongodb.js";
const connectString = `mongodb://${config.db.HOST}:${config.db.PORT}/${config.db.NAME}`;
import { countConnect } from "../helpers/check.connect.js";
class Database {
  constructor() {
    this.connect();
  }

  //connect
  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then((_) => console.log(`Connected Mongodb Success`, countConnect()))
      .catch((err) => console.log(`Error connect!`, err));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
export default instanceMongodb;
