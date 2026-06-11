const util = require('util');
const db = require('../config/database')
const helper = require('../config/helper');

const query = util.promisify(db.query).bind(db);

class Thongke {
  async Tongquan() {
    const phim = await query('SELECT COUNT(*) AS total FROM phim');
    const user = await query('SELECT COUNT(*) AS total FROM nguoi_dung');
    const dienvien = await query('SELECT COUNT(*) AS total FROM dien_vien');
    const theloai = await query('SELECT COUNT(*) AS total FROM theloai');
    const luotxem = await query('SELECT SUM(luotxem) AS total FROM phim');
    return {
      phim: phim[0].total,
      user: user[0].total,
      dienvien: dienvien[0].total,
      theloai: theloai[0].total,
      luotxem: luotxem[0].total
    }
  }
  async Thongke_top_phim_Category_Country_Actor() {
    const theloai = await query('SELECT t.id,t.ten,COUNT(p.phim_id) AS total FROM theloai t LEFT JOIN phim_theloai p on p.theloai_id=t.id GROUP BY t.id ORDER BY total DESC LIMIT 10');
    const quoc_gia = await query('SELECT p.quocgia,COUNT(p.id) AS total FROM phim p GROUP BY p.quocgia ORDER BY total DESC LIMIT 10');
    const dien_vien = await query('SELECT d.id,d.ten,d.anh,COUNT(p.phim_id) AS total FROM dien_vien d LEFT JOIN phim_dien_vien p on p.dien_vien_id=d.id GROUP BY d.id ORDER BY total DESC LIMIT 5');
    return {
      theloai: theloai,
      quoc_gia: quoc_gia,
      dien_vien: dien_vien
    }
  }
  async Top5_phim_nhieu_luot_xem() {
    const phim = await query('SELECT p.id,p.ten,p.anh_dai_dien,p.luotxem FROM phim p ORDER BY p.luotxem DESC LIMIT 5');
    return phim;
  }
   async Doanhthu() {
    const dt = await query(`SELECT 
    MONTH(ngay_mua) AS thang,
    SUM(so_tien) AS doanh_thu
FROM hoadon
WHERE YEAR(ngay_mua) = 2026
GROUP BY MONTH(ngay_mua)
ORDER BY thang`);
    return dt;
  }
  async get_created_at() {
    const [user] = await query(`SELECT username,ho_ten FROM nguoi_dung ORDER BY created_at DESC LIMIT 1`);
    const [phim] = await query(`SELECT ten,ten_tieng_anh FROM phim ORDER BY created_at DESC LIMIT 1`)
    return {
      user,
      phim
    }
  }
  async get_topRatting() {
    const ratingCao = await query(`SELECT 
    p.id,
    p.ten,
    p.ten_tieng_anh,
    AVG(d.diem) AS diem_tb,
    COUNT(d.diem) AS so_luot
FROM phim p
JOIN danhgia d ON p.id = d.phim_id
GROUP BY p.id, p.ten, p.ten_tieng_anh
ORDER BY diem_tb DESC
LIMIT 5;
`);
    const ratingThap = await query(`SELECT 
    p.id,
    p.ten,
    p.ten_tieng_anh,
    AVG(d.diem) AS diem_tb,
    COUNT(d.diem) AS so_luot
FROM phim p
JOIN danhgia d ON p.id = d.phim_id
GROUP BY p.id, p.ten, p.ten_tieng_anh
ORDER BY diem_tb ASC
LIMIT 5;
`);
    return {
      cao: ratingCao,
      thap: ratingThap
    }
  }
  async get_Top_Favorite() {
    const phim = await query(`SELECT 
    p.id,
    p.ten,
    COUNT(yt.phim_id) AS so_luot_yeu_thich
FROM phim p
JOIN yeuthich yt ON p.id = yt.phim_id
GROUP BY p.id, p.ten
ORDER BY so_luot_yeu_thich DESC
LIMIT 5;`);
    return phim;
  }


}

module.exports = Thongke;