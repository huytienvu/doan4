const util = require('util');
const db = require('../config/database')
const helper = require('../config/helper');

const query = util.promisify(db.query).bind(db);

class Quocgia {
  



  async create(data) {
    const {
        phim_id,
        so_tap,
        video_url
    } = data;

    try {
      // 1. Insert phim
      const result = await query(
        `INSERT INTO tap_phim(phim_id, so_tap, video_url) VALUES (?, ?, ?)`,
        [phim_id, so_tap, video_url]
      );

      return data;
    } catch (err) {
      throw err;
    }
  }
  async delete(id) {
    

    try {
      // 1. Insert phim
      const result = await query(
        `DELETE FROM tap_phim WHERE id = ?`,
        [id]
      );

      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Quocgia;