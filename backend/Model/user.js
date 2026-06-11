const db = require('../config/database');
const util = require('util');
const query = util.promisify(db.query).bind(db);

class User {
  async findByUsername(username) {
    const rows = await query("SELECT * FROM nguoi_dung WHERE username = ?", [username]);
    return rows[0]; // chỉ lấy 1 user
  }
  async checkVip(id) {
    const check = await query(`SELECT COUNT(*) AS total
FROM nguoi_dung
WHERE id = ?
  AND vip_end IS NOT NULL
  AND vip_end >= NOW();`, [id])
    return check[0].total > 0
  }
}

module.exports = User;
