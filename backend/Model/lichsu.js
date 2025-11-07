const util = require('util');
const db = require('../config/database')
const helper = require('../config/helper');

const query = util.promisify(db.query).bind(db);

class Lichsu {
  async getbyUser(id) {
    return await helper('SELECT l.phim_id, l.so_tap,p.ten,p.ten_tieng_anh,p.anh_dai_dien FROM lich_su_xem l inner join phim p on p.id= l.phim_id where l.user_id = ?', [id]);
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
    const { user_id, phim_id, so_tap } = data;

    try {
      // 1️⃣ Kiểm tra người này đã từng xem phim này chưa
      const existed = await query(
        'SELECT * FROM lich_su_xem WHERE user_id = ? AND phim_id = ?',
        [user_id, phim_id]
      );

      if (existed.length === 0) {
        // 2️⃣ Nếu CHƯA xem → tăng lượt xem phim lên 1
        await query('UPDATE phim SET luotxem = luotxem + 1 WHERE id = ?', [phim_id]);
        
      } else {
        // 3️⃣ Nếu đã xem → xóa lịch sử cũ (để update lại số tập)
        await query('DELETE FROM lich_su_xem WHERE user_id = ? AND phim_id = ?', [user_id, phim_id]);
      }

      // 4️⃣ Thêm mới lịch sử xem
      await query(
        'INSERT INTO lich_su_xem (user_id, phim_id, so_tap) VALUES (?, ?, ?)',
        [user_id, phim_id, so_tap]
      );

      return data;
    } catch (err) {
      throw err;
    }
  }

  async deleted(user_id, phim_id) {

    try {
      // 1. Insert phim
      const result = await query(
        `DELETE FROM lich_su_xem where user_id= ? and phim_id= ?`,
        [user_id, phim_id]
      );

      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Lichsu;