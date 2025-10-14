const util = require('util');
const db = require('../config/database')
const helper = require('../config/helper');

const query = util.promisify(db.query).bind(db);

class Yeuthich {
  async getbyUser(id) {
    return await helper('SELECT p.id, p.ten,p.ten_tieng_anh,p.anh_dai_dien FROM yeuthich inner join phim p on p.id= yeuthich.phim_id where yeuthich.user_id = ?',[id]);
  }

  async check(data) {
    const {
      user_id,
      phim_id
    } = data;
    try {
      // 1. Insert phim
      const result = await query(
        `SELECT COUNT(*) AS total FROM yeuthich WHERE user_id = ? AND phim_id =?`,
        [user_id, phim_id]
      );
      
      return result[0].total>0;
    } catch (err) {
      throw err;
    }
  }

  async create(data) {
    const {
      user_id,
      phim_id
    } = data;

    try {
      // 1. Insert phim
      const result = await query(
        `INSERT INTO yeuthich(user_id, phim_id) VALUES (?, ?)`,
        [user_id, phim_id]
      );

      return data;
    } catch (err) {
      throw err;
    }
  }
  async deleted(user_id,phim_id) {

    try {
      // 1. Insert phim
      const result = await query(
        `DELETE FROM yeuthich where user_id= ? and phim_id= ?`,
        [user_id, phim_id]
      );

      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Yeuthich;