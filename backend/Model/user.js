const db = require('../config/database');
const util = require('util');
const query = util.promisify(db.query).bind(db);

class User {
  async findByUsername(username) {
    const rows = await query("SELECT * FROM nguoi_dung WHERE username = ?", [username]);
    return rows[0]; // chỉ lấy 1 user
  }
}

module.exports = User;
