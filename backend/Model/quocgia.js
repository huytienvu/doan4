const util = require('util');
const db = require('../config/database')
const helper = require('../config/helper');

const query = util.promisify(db.query).bind(db);

class Quocgia {
  async getAllUser() {
    return await helper(`SELECT * FROM quocgia WHERE status=N'Hiển thị'`);
  }
  async getAll() {
    return await helper(`SELECT * FROM quocgia`);
  }

  async getbyid(id) {
    return await helper('SELECT * FROM quocgia where id = ?', [id])
  }

  async create(data) {
    const a =data.quocgia

    try {
      // 1. Insert phim
      const result = await query(
        `INSERT INTO quocgia(quocgia) VALUES (?)`,
        [a]
      );

      return data;
    } catch (err) {
      throw err;
    }
  }
  async update(data) {
    const {
      id,
      quocgia,
      status
    } = data;

    try {
      const result = await query(
        `UPDATE quocgia SET quocgia = ?, status = ? WHERE id = ?`,
        [quocgia, status, id]
      );

      return data;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Quocgia;