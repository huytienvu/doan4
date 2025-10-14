const path = require('path');
const multer = require('multer');

// ================== UPLOAD ẢNH ==================
const storageImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/upload/anhdaidien'); // Thư mục lưu ảnh
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Giữ nguyên tên file gốc
  }
});
const uploadImage = multer({ storage: storageImage });

exports.uploadImage = [
  uploadImage.single('anh'), // field name = "anh"
  (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Không có ảnh được upload' });

    const imageUrl = `/upload/anhdaidien/${req.file.filename}`;
    res.json({
      message: 'Upload ảnh thành công',
      url: imageUrl
    });
  }
];

// ================== UPLOAD VIDEO ==================
const storageVideo = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/upload/video'); // Thư mục lưu video
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Giữ nguyên tên file gốc
  }
});
const uploadVideo = multer({ storage: storageVideo });

exports.uploadVideo = [
  uploadVideo.single('video'), // field name = "video"
  (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Không có video được upload' });

    const videoUrl = `/upload/video/${req.file.filename}`;
    res.json({
      message: 'Upload video thành công',
      url: videoUrl
    });
  }
];
