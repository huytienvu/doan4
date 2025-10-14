const util = require('util');
const db = require('../config/database')
const helper = require('../config/helper');

const query = util.promisify(db.query).bind(db);

class Dienvien {
  async getAll() {
    return await helper('SELECT * FROM dien_vien');
  }

  async getbyid(id) {
    const result = await helper('SELECT * FROM dien_vien where id = ?',[id])
    return result[0];
  }

  async create(data) {
    const {
      ten,
      anh
    } = data;

    try {

      const result = await query(
        `INSERT INTO dien_vien(ten, anh) VALUES (?, ?)`,
        [ten, anh]
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
      anh
    } = data;

    try {
      const result = await query(
        `UPDATE dien_vien SET ten = ?, anh = ? WHERE id = ?`,
        [ten, anh, id]
      );

      return data;
    } catch (err) {
      throw err;
    }
  }

  async delete(id) {
    try {
      const result = await query(
        `DELETE FROM dien_vien WHERE id = ?`,
        [id]
      );

      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Dienvien;