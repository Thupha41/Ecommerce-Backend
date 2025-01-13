"use strict";

import mongoose from "mongoose";
import os from "os";
import process from "process";
const _SECONDS = 5000;

// Count MongoDB Connections
export const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connections: ${numConnection}`);
};

// Check Overload
export const checkOverload = () => {
  setInterval(async () => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    const maxConnections = numCores * 5;

    console.log(`Active connections: ${numConnection}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);

    if (numConnection > maxConnections) {
      console.log(`Connection overload detected!`);
    }
  }, _SECONDS);
};
