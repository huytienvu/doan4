const util = require('util');
const db = require('../config/database');
const helper = require('../config/helper');

const query = util.promisify(db.query).bind(db);

class Binhluan {
  // Lấy danh sách bình luận theo phim
  async getByPhim(phim_id) {
    return await helper(
      `SELECT b.id, b.binh_luan, b.ngay, 
              u.username, u.avatar
       FROM binhluan b 
       INNER JOIN nguoi_dung u ON u.id = b.user_id
       WHERE b.phim_id =?
       ORDER BY b.ngay DESC`,
      [phim_id]
    );
  }

  // Thêm bình luận mới
  async create(data) {
    const { user_id, phim_id, binh_luan } = data;

    try {
      const result = await query(
        `INSERT INTO binhluan (user_id, phim_id, binh_luan) VALUES (?, ?, ?)`,
        [user_id, phim_id, binh_luan]
      );
      return { id: result.insertId, ...data };
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Binhluan;
