const util = require('util');
const db = require('../config/database')
const helper = require('../config/helper');

const query = util.promisify(db.query).bind(db);

class Dienvien {
  async getAll() {
    return await helper('SELECT * FROM dien_vien');
  }

  async getbyid(id) {
    const result = await helper('SELECT * FROM dien_vien where id = ?', [id])
    return result[0];
  }
  async GetPhimdienvien(id) {
    const phim = await helper(`SELECT  p.id, p.ten,p.ten_tieng_anh,p.anh_dai_dien, p.loai,p.luotxem,p.ngay_phat_hanh,p.thoi_luong FROM phim p INNER JOIN phim_dien_vien pdv 
on p.id = pdv.phim_id
WHERE pdv.dien_vien_id = ?`, [id])
    const [dienvien] = await query('Select*from dien_vien where id = ?', [id])
    const total_phim = await query(`SELECT COUNT(dv.phim_id) AS total
FROM phim_dien_vien dv
WHERE dv.dien_vien_id = ?`, [id])
    const total = total_phim[0].total
    return {
      phim: phim,
      dienvien,
      total
    }
  }

  async Search(keyword, page_number = 1, page_size = 20) {
    try {
      const offset = (page_number - 1) * page_size;

      const countResult = await query(
        'SELECT COUNT(*) AS total FROM dien_vien WHERE ten LIKE ?',
        [`%${keyword}%`]
      );
      const total_items = countResult[0].total;
      const total_pages = Math.ceil(total_items / page_size);

      const dienvien = await query(
        `SELECT * FROM dien_vien WHERE ten LIKE ? LIMIT ${page_size} OFFSET ${offset}`,
        [`%${keyword}%`] // thêm % để tìm kiếm mờ
      );

      return {
        page_number,
        page_size,
        total_pages,
        data: dienvien
      }
    } catch (error) {
      throw error;
    }
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
      anh,
      status
    } = data;

    try {
      const result = await query(
        `UPDATE dien_vien SET ten = ?, anh = ?, status = ? WHERE id = ?`,
        [ten, anh, status, id]
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