const util = require('util');
const db = require('../config/database')
const helper = require('../config/helper');

const query = util.promisify(db.query).bind(db);

class GoiVip {
  async getAll() {
    return await helper('Select * from goi_vip');
  }

  

  async create(data) {
    const {
      ten_goi,
      mo_ta,
      gia,
      so_ngay,
    } = data;

    try {
      // 1. Insert phim
      const result = await query(
        `INSERT INTO goi_vip(ten_goi, mo_ta, gia, so_ngay) VALUES (?, ?, ?, ?)`,
        [ten_goi, mo_ta, gia, so_ngay]
      );

      return data;
    } catch (err) {
      throw err;
    }
  }
//   async deleted(user_id,phim_id) {

//     try {
//       // 1. Insert phim
//       const result = await query(
//         `DELETE FROM yeuthich where user_id= ? and phim_id= ?`,
//         [user_id, phim_id]
//       );

//       return result;
//     } catch (err) {
//       throw err;
//     }
//   }
}

module.exports = GoiVip;