const mysql = require('mysql');

const db = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: '',
  database: process.env.database
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connect database MySQL thành công');
});

module.exports = db;