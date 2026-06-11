const { nanoid } = require('nanoid');
const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay')
const Thanhtoan = require('../Model/thanhtoan');
const thanhtoan =new Thanhtoan()
const vnpay = new VNPay({
    tmnCode: 'Q3WR70K5',
    secureSecret: '0ZK5MJJ7RQYK4FO8CAETR5VZ39LT1WVJ',
    vnpayHost: 'https://sandbox.vnpayment.vn/',
    testMode: true,
    hashAlgorithm: 'SHA512',
    loggerFn: ignoreLogger
})

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const create = async (req, res) => {
    try {
        // const maHoaDon = 'HD' + nanoid(8); // Ví dụ: HDgA3Fv9Pk
        // truyền body mahd, tong tien,hd này là code vi du
        // const maHoaDon = 'HD13e34g24'
        // console.log(maHoaDon);

        const objhoadon = req.body
        await thanhtoan.createHoadon(objhoadon);
        const {id,so_tien} =req.body
        
        const vnpayResponse = await vnpay.buildPaymentUrl({
            vnp_Amount: so_tien,
            vnp_IpAddr: '127.0.0.1',
            vnp_TxnRef:  id,
            vnp_OrderInfo: id,
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: 'http://localhost:5273/api/vnpay/check',
            vnp_Locale: VnpLocale.VN,
            vnp_CreateDate: dateFormat(new Date()),
            vnp_ExpireDate: dateFormat(tomorrow)
        })

        return res.status(200).json({ URLpay: vnpayResponse })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
// 🧾 Hàm kiểm tra kết quả thanh toán
const check = async (req, res) => {
   
    
    try {
        // B1: Lấy tất cả query VNPay trả về
        const query = req.query;

        // B2: Kiểm tra chữ ký (hash) có hợp lệ không
        const verify = vnpay.verifyReturnUrl(query);

        if (!verify.isVerified) {
            return res.status(400).json({ message: 'Chữ ký không hợp lệ!' });
        }

        // B3: Lấy thông tin thanh toán
        const orderId = query.vnp_TxnRef;      // Mã đơn hàng bạn tạo
        const transactionNo = query.vnp_TransactionNo; // Mã giao dịch từ VNPay
        const amount = query.vnp_Amount / 100; // VNPay trả số nhân 100
        const responseCode = query.vnp_ResponseCode;
        
        const hd = await thanhtoan.gethoadon(orderId)

        // B4: Xử lý kết quả giao dịch
        if (responseCode === '00') {
            // thanh toán thành công
            // Ở đây bạn có thể lưu hóa đơn vào DB, ví dụ:
            // await db.query("INSERT INTO lich_su_mua_vip (...) VALUES (...)")
            const data = {
                id: orderId,
                user_id:hd.user_id,
                goi_vip_id:hd.goi_vip_id,
                ma_giao_dich: transactionNo,
                phuong_thuc : 'VNPay',
                so_tien: amount,
                ngay_het_han :hd.ngay_het_han,
                trang_thai : 'Thành công'
            }
            await thanhtoan.create(data)

            //update trạng thái hóa đơn
            await thanhtoan.updateHoadon(orderId,"Thành công")

            console.log(`Thanh toán thành công: ${orderId} | Mã GD: ${transactionNo}`);

            // Chuyển hướng đến trang thành công
            return res.redirect('http://localhost:5274');// sửa lại thành trang payment
        } else {
            // Thanh toán thất bại
            console.log(`Thanh toán thất bại: ${orderId} | Code: ${responseCode}`);
            return res.redirect('http://localhost:5274/login');// tương tự
        }

    } catch (error) {
        console.error('VNPay check error:', error);
        res.status(500).json({ error: 'Lỗi xử lý kết quả thanh toán' });
    }
};

module.exports = {
    create,
    check
};