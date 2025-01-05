const app = require("./src/app");
const PORT = 3055;
const server = app.listen(PORT, () => {
  console.log(`WSV eCommerce start with port ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => console.log(`Exit Server Express`));
});
