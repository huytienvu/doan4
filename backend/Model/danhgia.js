const util = require('util');
const db = require('../config/database');
const helper = require('../config/helper');

const query = util.promisify(db.query).bind(db);

class Danhgia {
  // Lấy danh sách đánh giá theo phim
  async getByPhim(phim_id) {
    return await helper(
      `SELECT d.id, d.diem, d.danhgia, d.ngay, 
              u.username, u.avatar
       FROM danhgia d
       INNER JOIN nguoi_dung u ON u.id = d.user_id
       WHERE d.phim_id = ?
       ORDER BY d.ngay DESC`,
      [phim_id]
    );
  }
  async check(data) {
    const {
      user_id,
      phim_id
    } = data;
    try {
      // 1. Insert phim
      const result = await query(
        `SELECT COUNT(*) AS total FROM danhgia WHERE user_id = ? AND phim_id =?`,
        [user_id, phim_id]
      );
      
      return result[0].total>0;
    } catch (err) {
      throw err;
    }
  }
  // Thêm đánh giá mới
  async create(data) {
    const { user_id, phim_id, diem, danhgia } = data;

    try {
      const result = await query(
        `INSERT INTO danhgia (user_id, phim_id, diem, danhgia) VALUES (?, ?, ?, ?)`,
        [user_id, phim_id, diem, danhgia]
      );
      return { id: result.insertId, ...data };
    } catch (err) {
      throw err;
    }
  }

  // Lấy điểm trung bình của phim
  async getAvg(phim_id) {
    const rows = await query(
      `SELECT AVG(diem) AS diem_tb, COUNT(*) AS so_luot
       FROM danhgia
       WHERE phim_id = ?`,
      [phim_id]
    );
    return rows[0];
  }
}

module.exports = Danhgia;
