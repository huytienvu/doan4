const util = require('util');
const db = require('../config/database')
const helper = require('../config/helper');

const query = util.promisify(db.query).bind(db);
// async function helper(sql){
//   try {
//       const theloai = await query(sql);
//       return theloai;
//     } catch (error) {
//       throw error;
//     }
// }
class Theloai {
  async getAll() {
    return await helper('SELECT * FROM theloai');
  }

  async getbyid(id) {
    return await helper('SELECT * FROM theloai where id = ?',[id])
  }

  async create(data) {
    const {
      ten,
      mota
    } = data;

    try {

      const result = await query(
        `INSERT INTO theloai(ten, mota) VALUES (?, ?)`,
        [ten, mota]
      );

      return data;
    } catch (err) {
      throw err;
    }
  }

  async update(data) {
    const {
      id,
      ten,
      mota
    } = data;

    try {
      const result = await query(
        `UPDATE theloai SET ten = ?, mota = ? WHERE id = ?`,
        [ten, mota, id]
      );

      return data;
    } catch (err) {
      throw err;
    }
  }

  async delete(id) {
    try {
      const result = await query(
        `DELETE FROM theloai WHERE id = ?`,
        [id]
      );

      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Theloai;