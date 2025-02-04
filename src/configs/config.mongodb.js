const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3052,
  },
  db: {
    HOST: process.env.DEV_DB_HOST || "localhost",
    PORT: process.env.DEV_DB_PORT || 27017,
    NAME: process.env.DEV_DB_NAME || "shopDev",
  },
};

const prod = {
  app: {
    port: process.env.PROD_APP_PORT || 3000,
  },
  db: {
    HOST: process.env.PROD_DB_HOST || "localhost",
    PORT: process.env.PROD_DB_PORT || 27017,
    NAME: process.env.PROD_DB_NAME || "shopProd",
  },
};

const config = { dev, prod };
const env = process.env.NODE_ENV || "dev";
export default config[env];
