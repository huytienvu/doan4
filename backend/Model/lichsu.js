const util = require('util');
const db = require('../config/database')
const helper = require('../config/helper');

const query = util.promisify(db.query).bind(db);

class Lichsu {
  async getbyUser(id) {
    return await helper('SELECT l.phim_id, l.so_tap,p.ten,p.ten_tieng_anh,p.anh_dai_dien FROM lich_su_xem l inner join phim p on p.id= l.phim_id where l.user_id = ?',[id]);
  }

//   async check(data) {
//     const {
//       user_id,
//       phim_id
//     } = data;
//     try {
//       // 1. Insert phim
//       const result = await query(
//         `SELECT COUNT(*) AS total FROM yeuthich WHERE user_id = ? AND phim_id =?`,
//         [user_id, phim_id]
//       );
      
//       return result[0].total>0;
//     } catch (err) {
//       throw err;
//     }
//   }

  async create(data) {
    const {
      user_id,
      phim_id,
      so_tap
    } = data;

    try {
      // 1. Insert phim
      await query('delete from lich_su_xem where user_id =? and phim_id=?',[user_id,phim_id])
      const result = await query(
        `INSERT INTO lich_su_xem(user_id, phim_id, so_tap) VALUES (?, ?, ?)`,
        [user_id, phim_id, so_tap]
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

module.exports = Lichsu;