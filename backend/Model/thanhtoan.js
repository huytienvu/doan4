const util = require('util');
const db = require('../config/database')
const helper = require('../config/helper');

const query = util.promisify(db.query).bind(db);

class Thanhtoan {

    async gethoadon(id) {
        
        try {
            const [result] = await query(`select * from hoadon where id = ?`,[id])
                
            console.log(result.id,result.user_id,result.goi_vip_id);
            

            // Trả kết quả thêm thành công
            return result
        } catch (err) {
            console.error('Lỗi thêm hóa đơn VIP:', err);
            throw err;
        }
    }
    async createHoadon(data) {
        const {
            id,
            user_id,
            goi_vip_id,
            so_tien,
            ngay_het_han,
        } = data;

        try {
            // Thêm hóa đơn vào bảng lich_su_mua_vip
            const result = await query(
                `INSERT INTO hoadon 
          (id,user_id, goi_vip_id, so_tien, ngay_het_han)
         VALUES (?, ?, ?, ?, ?)`,
                [id, user_id, goi_vip_id, so_tien, ngay_het_han]
            );

            // Trả kết quả thêm thành công
            return {
                message: 'Thêm hóa đơn VIP thành công',                
            };
        } catch (err) {
            console.error('Lỗi thêm hóa đơn VIP:', err);
            throw err;
        }
    }
    async updateHoadon(id,state) {
        

        try {
            // Thêm hóa đơn vào bảng lich_su_mua_vip
            const result = await query(
                `UPDATE hoadon set trang_thai= ? WHERE id= ?`,
                [state, id]
            );

            // Trả kết quả thêm thành công
            return result;
        } catch (err) {
            console.error('Lỗi thêm hóa đơn VIP:', err);
            throw err;
        }
    }

    async create(data) {
        const {
            id,
            user_id,
            goi_vip_id,
            ma_giao_dich,
            phuong_thuc,
            so_tien,
            ngay_het_han,
            trang_thai
        } = data;

        try {
            // Thêm hóa đơn vào bảng lich_su_mua_vip
            const result = await query(
                `INSERT INTO lich_su_mua_vip 
          (id,user_id, goi_vip_id, ma_giao_dich, phuong_thuc, so_tien, ngay_het_han, trang_thai)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [id, user_id, goi_vip_id, ma_giao_dich, phuong_thuc, so_tien, ngay_het_han, trang_thai]
            );

            // Trả kết quả thêm thành công
            return {
                message: 'Thanh toán thành công',                
            };
        } catch (err) {
            console.error('Lỗi thanh toán', err);
            throw err;
        }
    }

}

module.exports = Thanhtoan;