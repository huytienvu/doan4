const util = require('util');
const db = require('../config/database')

const query = util.promisify(db.query).bind(db);

class Phim {
  async getAllPhim() {
    try {
      const phim = await query('SELECT * FROM phim');
      for (const p of phim) {
        const theloai = await query('SELECT id,ten FROM theloai LEFT JOIN phim_theloai p on p.theloai_id=id WHERE p.phim_id=?', [p.id]);
        p.theloai = theloai;
        const dienvien = await query('SELECT id,ten FROM dien_vien d LEFT JOIN phim_dien_vien p on p.dien_vien_id=d.id WHERE p.phim_id=?', [p.id])
        p.dienvien = dienvien
      }
      return phim;
    } catch (error) {
      throw error;
    }
  }
  async getPhimBoLe(loai) {
    try {
      const phim = await query('SELECT * FROM phim where loai = ?',[loai]);
      for (const p of phim) {
        const theloai = await query('SELECT id,ten FROM theloai LEFT JOIN phim_theloai p on p.theloai_id=id WHERE p.phim_id=?', [p.id]);
        p.theloai = theloai;
        const dienvien = await query('SELECT id,ten FROM dien_vien d LEFT JOIN phim_dien_vien p on p.dien_vien_id=d.id WHERE p.phim_id=?', [p.id])
        p.dienvien = dienvien
      }
      return phim;
    } catch (error) {
      throw error;
    }
  }
  async getPhimquocgia(quocgia) {
    try {
      const phim = await query('SELECT * FROM phim where quocgia = ?',[quocgia]);
      for (const p of phim) {
        const theloai = await query('SELECT id,ten FROM theloai LEFT JOIN phim_theloai p on p.theloai_id=id WHERE p.phim_id=?', [p.id]);
        p.theloai = theloai;
        const dienvien = await query('SELECT id,ten FROM dien_vien d LEFT JOIN phim_dien_vien p on p.dien_vien_id=d.id WHERE p.phim_id=?', [p.id])
        p.dienvien = dienvien
      }
      return phim;
    } catch (error) {
      throw error;
    }
  }
  async getAllPhimdanhmuc(id) {
    try {
      const phim = await query('SELECT id,ten, p.ten_tieng_anh,p.mota,p.anh_dai_dien,p.daodien,p.quocgia,p.ngay_phat_hanh,p.trang_thai,p.loai,p.thoi_luong,p.video_url,p.created_at FROM phim p INNER JOIN phim_theloai ptl on ptl.phim_id=p.id WHERE ptl.theloai_id=? GROUP by p.ten', [id]);
      for (const p of phim) {
        const theloai = await query('SELECT id,ten FROM theloai LEFT JOIN phim_theloai p on p.theloai_id=id WHERE p.phim_id=?', [p.id]);
        p.theloai = theloai;
        const dienvien = await query('SELECT id,ten FROM dien_vien d LEFT JOIN phim_dien_vien p on p.dien_vien_id=d.id WHERE p.phim_id=?', [p.id])
        p.dienvien = dienvien
      }
      const theloai = await query('SELECT * FROM `theloai` WHERE id =?', [id])

      return {
        theloai,
        phim
      }
    } catch (error) {
      throw error;
    }
  }
  async getPhimNEW() {
    try {
      const phim = await query('SELECT * FROM phim ORDER BY created_at DESC LIMIT 5');
      for (const p of phim) {
        const theloai = await query('SELECT id,ten FROM theloai LEFT JOIN phim_theloai p on p.theloai_id=id WHERE p.phim_id=?', [p.id]);
        p.theloai = theloai;
      }
      return phim
    } catch (error) {
      throw error;
    }
  }

  async getPhimbyid(id) {
    try {
      const phim = await query('SELECT * FROM phim where id = ?', [id]);

      const theloai = await query('SELECT id,ten FROM theloai LEFT JOIN phim_theloai p on p.theloai_id=id WHERE p.phim_id=?', [id]);
      phim[0].theloai = theloai;
      const dienvien = await query('SELECT id,ten FROM dien_vien d LEFT JOIN phim_dien_vien p on p.dien_vien_id=d.id WHERE p.phim_id=?', [id])
      phim[0].dienvien = dienvien

      const tapphim = await query('SELECT t.phim_id,t.id,t.so_tap,t.video_url from `tap_phim` t WHERE t.phim_id=?', [id]);
      phim[0].tapphim = tapphim;
      const obj =phim[0];
      return obj
    } catch (error) {
      throw error;
    }
  }
  async getTapPhim(phim_id) {
    try {
      const tapphim = await query('SELECT t.phim_id,t.id,t.so_tap,t.video_url from `tap_phim` t WHERE t.phim_id=?', [phim_id]);
      return tapphim;
    } catch (error) {
      throw error;
    }
  }
  async create(data) {
    const {
      ten, ten_tieng_anh, mota, anh_dai_dien,
      daodien, quocgia,
      ngay_phat_hanh,
      trang_thai,
      loai,
      thoi_luong, video_url, nhan_dan,
      tap_phim = [],
      theloai_ids = [],
      dienvien_ids = []
    } = data;

    try {
      // 1. Insert phim
      const result = await query(
        `INSERT INTO phim (ten, ten_tieng_anh, mota, anh_dai_dien, daodien,quocgia, ngay_phat_hanh, trang_thai, loai, thoi_luong, video_url, nhan_dan) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [ten, ten_tieng_anh, mota, anh_dai_dien, daodien, quocgia, ngay_phat_hanh, trang_thai, loai, thoi_luong, video_url, nhan_dan]
      );
      const phim_id = result.insertId;


      // 2. Insert thể loại
      for (const theloai_id of theloai_ids) {
        await query(
          `INSERT INTO phim_theloai (phim_id, theloai_id) VALUES (?, ?)`,
          [phim_id, theloai_id]
        );

      }
      for (const dv of dienvien_ids) {
        await query(
          `INSERT INTO phim_dien_vien (phim_id, dien_vien_id) VALUES (?, ?)`,
          [phim_id, dv]
        );
      }

      if (loai === 'bo') {
        for (const tap of tap_phim) {
          const {
            so_tap,
            video_url
          } = tap;

          await query(
            `INSERT INTO tap_phim (
              phim_id, so_tap, video_url
            ) VALUES (?, ?, ?)`,
            [
              phim_id, so_tap, video_url
            ]
          );
        }
      }

      return { id: phim_id, ...data };
    } catch (err) {
      throw err;
    }
  }
  
  async update(id, data) {
    const {
      ten, ten_tieng_anh, mota, anh_dai_dien,
      daodien, quocgia,
      ngay_phat_hanh,
      trang_thai,
      loai,
      thoi_luong, video_url, nhan_dan,
      tap_phim = [],
      theloai_ids = [],
      dienvien_ids = []
    } = data;

    try {
      // 1. Update bảng phim
      await query(
        `UPDATE phim SET
        ten = ?, ten_tieng_anh = ?, mota = ?, anh_dai_dien = ?,
        daodien = ?, quocgia = ?, ngay_phat_hanh = ?, trang_thai = ?,
        loai = ?, thoi_luong = ?, video_url = ?, nhan_dan = ?
      WHERE id = ?`,
        [
          ten, ten_tieng_anh, mota, anh_dai_dien,
          daodien, quocgia, ngay_phat_hanh, trang_thai,
          loai, thoi_luong, video_url, nhan_dan,
          id
        ]
      );

      // 2. Cập nhật thể loại → xoá hết cũ, thêm lại mới
      await query(`DELETE FROM phim_theloai WHERE phim_id = ?`, [id]);
      for (const theloai_id of theloai_ids) {
        await query(
          `INSERT INTO phim_theloai (phim_id, theloai_id) VALUES (?, ?)`,
          [id, theloai_id]
        );
      }

      // 3. Cập nhật diễn viên → xoá hết cũ, thêm lại mới
      await query(`DELETE FROM phim_dien_vien WHERE phim_id = ?`, [id]);
      for (const dv of dienvien_ids) {
        await query(
          `INSERT INTO phim_dien_vien (phim_id, dien_vien_id) VALUES (?, ?)`,
          [id, dv]
        );
      }

      // 4. Nếu là phim bộ thì cập nhật tập phim
      if (loai === 'bo') {
        // xoá tập cũ trước
        await query(`DELETE FROM tap_phim WHERE phim_id = ?`, [id]);

        for (const tap of tap_phim) {
          const { so_tap, video_url } = tap;
          await query(
            `INSERT INTO tap_phim (phim_id, so_tap, video_url) VALUES (?, ?, ?)`,
            [id, so_tap, video_url]
          );
        }
      }

      return { id, ...data };
    } catch (err) {
      throw err;
    }
  }

}

module.exports = Phim;