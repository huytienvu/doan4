const jwt = require("jsonwebtoken");
const User = require("../Model/user");
const users = new User();

const JWT_SECRET = process.env.JWT_SECRET// nên để trong biến môi trường .env

class AuthController {
  async login(req, res) {
    try {
      const { username, password } = req.body;

      // Kiểm tra đầu vào
      if (!username || !password) {
        return res.status(400).json({ error: "Vui lòng nhập username và password" });
      }

      // Tìm user trong DB
      const user = await users.findByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Sai username hoặc password" });
      }

      // So sánh password (ở đây so sánh trực tiếp, không hash)
      if (password !== user.password) {
        return res.status(401).json({ error: "Sai username hoặc password" });
      }

      // Kiểm tra trạng thái
      if (user.trang_thai === "Khóa") {
        return res.status(403).json({ error: "Tài khoản đã bị khóa" });
      }

      // Tạo JWT token
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.loai_tai_khoan,
          vip: user.userlevel
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.json({
        message: "Đăng nhập thành công",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.loai_tai_khoan,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Lỗi server" });
    }
  }
  async checkVip(req, res) {

    try {
      const id = req.params.id
      const result = await users.checkVip(id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }

  }
}


module.exports = new AuthController();
