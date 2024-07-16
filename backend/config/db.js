const sql = require("mssql");

const dbConfig = {
  user: "sqlserver", 
  password: "Gatito06", 
  server: "34.30.173.222", 
  database: "tiendita", 
  options: {
    encrypt: false, 
    enableArithAbort: true
  },
};

const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then((pool) => {
    console.log("Connected to SQL Server");
    return pool;
  })
  .catch((err) => {
    console.error("Database Connection Failed! Bad Config: ", err);
    throw err;
  });

module.exports = {
  sql,
  poolPromise,
};