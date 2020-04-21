const mysql = require("mysql");

module.exports = () => {
  var db = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME,
  });

  db.connect((err) => {
    if (err) throw err;
  });

  return db;
};
