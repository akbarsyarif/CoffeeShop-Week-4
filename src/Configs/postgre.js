const pg = require("pg");
const { Pool } = pg;

const { dbHost, dbName, dbUser, dbPass } = require("./environment");

const db = new Pool({
  host: dbHost,
  database: dbName,
  user: dbUser,
  password: dbPass,
});

module.exports = db;
