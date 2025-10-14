const util = require('util');
const db = require('../config/database')
const helper = require('../config/helper');

const query = util.promisify(db.query).bind(db);

class Quocgia {
  async getAll() {
    return await helper('SELECT * FROM quocgia');
  }

  async getbyid(id) {
    return await helper('SELECT * FROM quocgia where id = ?',[id])
  }

  async create(data) {
    const {
      ten,
      mota
    } = data;

    try {
      // 1. Insert phim
      const result = await query(
        `INSERT INTO theloai(ten, mota) VALUES (?, ?)`,
        [ten, mota]
      );

      return data;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Quocgia;