-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 10, 2026 lúc 03:51 PM
-- Phiên bản máy phục vụ: 10.4.28-MariaDB
-- Phiên bản PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `webxemphim`
--

DELIMITER $$
--
-- Thủ tục
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_theloai` (IN `p_page` INT, IN `p_limit` INT)   BEGIN
    DECLARE p_offset INT;

    SET p_offset = (p_page - 1) * p_limit;

    SELECT * FROM theloai
    LIMIT p_limit OFFSET p_offset;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_loc_phim` (IN `quocgiaList` VARCHAR(255), IN `theloaiList` VARCHAR(255), IN `loaiList` VARCHAR(255), IN `namList` VARCHAR(255))   BEGIN
    SELECT DISTINCT p.*
    FROM phim p
    LEFT JOIN phim_theloai pt ON p.id = pt.phim_id
    WHERE 
        (quocgiaList IS NULL OR FIND_IN_SET(p.quocgia, quocgiaList) > 0)
        AND (theloaiList IS NULL OR FIND_IN_SET(pt.theloai_id, theloaiList) > 0)
        AND (loaiList IS NULL OR FIND_IN_SET(p.loai, loaiList) > 0)
        AND (namList IS NULL OR FIND_IN_SET(p.ngay_phat_hanh, namList) > 0);
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `binhluan`
--

CREATE TABLE `binhluan` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `phim_id` int(11) NOT NULL,
  `binh_luan` text DEFAULT NULL,
  `ngay` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `binhluan`
--

INSERT INTO `binhluan` (`id`, `user_id`, `phim_id`, `binh_luan`, `ngay`) VALUES
(1, 1, 8, 'abc', '2025-10-13 03:32:38'),
(2, 1, 10, 'Tôi rất thích nhân vật chính!', '2025-10-13 03:42:03'),
(3, 1, 14, 'Tôi thấy hay', '2025-10-13 03:43:12'),
(4, 1, 14, 'Đánh đấm đỉnh', '2025-10-14 07:06:18'),
(5, 1, 14, 'abc', '2025-10-14 07:38:26'),
(6, 1, 14, 'bcd', '2025-10-14 07:39:24'),
(7, 1, 14, 'xccc', '2025-10-14 07:40:59'),
(8, 1, 18, 'hay', '2025-10-14 07:41:18'),
(9, 1, 18, 'good', '2025-10-14 07:44:13');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danhgia`
--

CREATE TABLE `danhgia` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `phim_id` int(11) NOT NULL,
  `diem` int(11) DEFAULT NULL CHECK (`diem` >= 1 and `diem` <= 10),
  `danhgia` text DEFAULT NULL,
  `ngay` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `danhgia`
--

INSERT INTO `danhgia` (`id`, `user_id`, `phim_id`, `diem`, `danhgia`, `ngay`) VALUES
(1, 1, 18, 10, 'hay', '2025-10-17 15:37:30'),
(3, 3, 18, 6, 'Tôi thấy hay', '2025-10-17 15:49:31'),
(9, 1, 14, 10, 'good', '2025-10-28 15:50:15'),
(11, 1, 13, 8, 'dinh cao', '2025-10-31 03:16:19'),
(12, 1, 20, 10, 'gay cấn, đúng idol phim hành động', '2026-01-04 01:12:30');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dien_vien`
--

CREATE TABLE `dien_vien` (
  `id` int(11) NOT NULL,
  `ten` varchar(255) NOT NULL,
  `anh` varchar(250) NOT NULL,
  `status` enum('Hiển thị','Khóa') DEFAULT 'Hiển thị',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `dien_vien`
--

INSERT INTO `dien_vien` (`id`, `ten`, `anh`, `status`, `created_at`) VALUES
(1, 'Lee Jung-jae', 'https://vcdn1-giaitri.vnecdn.net/2025/10/23/202405051744126968-0-176118892-9899-4260-1761189180.jpg?w=500&h=300&q=100&dpr=1&fit=crop&s=iJls4jDD25opMApyciDGwg', 'Hiển thị', '2025-11-03 08:51:33'),
(2, 'T.O.P', 'https://cdn-images.vtv.vn/66349b6076cb4dee98746cf1/2025/09/30/top-03557041164094032375015.jpg', 'Hiển thị', '2025-11-03 08:51:33'),
(3, 'Lee Seung gi', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh3_JHDGPpEIim1TaGxsoOCgbpho0AYyM4ueI25kkieIRR_VOUkHzqYoLCO6jnNEoGUV-5eK4lV5zFV9UASlyzdhMn4xc1yFLkpF_op04&s=10', 'Hiển thị', '2025-11-03 08:51:33'),
(4, 'Park Joo-hyun', '', 'Hiển thị', '2025-11-03 08:51:33'),
(6, 'Cha Eun-woo', 'https://i.mydramalist.com/JBLjqX_5f.jpg', 'Hiển thị', '2025-11-03 08:51:33'),
(7, 'Song Kang', 'https://admin.vov.gov.vn/UploadFolder/KhoTin/Images/UploadFolder/VOVVN/Images/sites/default/files/styles/large/public/2025-10/z5714576630187_fa9cf0564e4bac96b7da721ed1dd0f78.jpg', 'Hiển thị', '2025-11-03 08:51:33'),
(8, 'Nam Joo-hyuk', 'https://wiki.d-addicts.com/images/thumb/7/7c/Nam_Joo-Hyuk-PR002.jpg/300px-Nam_Joo-Hyuk-PR002.jpg', 'Hiển thị', '2025-11-03 08:51:33'),
(9, 'Kim Soo-hyun', 'huy', 'Hiển thị', '2025-11-03 08:51:33'),
(10, 'Park Ji-hoon', 'huy', 'Hiển thị', '2025-11-03 08:51:33'),
(11, 'Lee Min-ho', 'huy', 'Hiển thị', '2025-11-03 08:51:33'),
(12, 'Hyun Bin', 'huy', 'Hiển thị', '2025-11-03 08:51:33'),
(13, 'Ji Chang-wook', 'https://nld.mediacdn.vn/291774122806476800/2025/6/17/ji-chang-wook-da-binh-phuc-sau-khi-nhiem-covid-19-1750142732004881831802.jpeg', 'Hiển thị', '2025-11-03 08:51:33'),
(14, 'Gong Yoo', 'huy', 'Hiển thị', '2025-11-03 08:51:33'),
(15, 'Wi Ha-joon', 'huy', 'Hiển thị', '2025-11-03 08:51:33'),
(16, 'Huy', 'abc123', 'Khóa', '2025-11-03 08:51:33'),
(17, 'admin', 'acc', 'Khóa', '2025-11-03 09:42:28');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `goi_vip`
--

CREATE TABLE `goi_vip` (
  `id` int(11) NOT NULL,
  `ten_goi` varchar(50) NOT NULL,
  `mo_ta` varchar(255) DEFAULT NULL,
  `gia` decimal(12,2) NOT NULL,
  `so_ngay` int(11) NOT NULL,
  `status` enum('Hiển thị','Ẩn') DEFAULT 'Hiển thị',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `goi_vip`
--

INSERT INTO `goi_vip` (`id`, `ten_goi`, `mo_ta`, `gia`, `so_ngay`, `status`, `created_at`) VALUES
(1, 'Vip 1 tháng', NULL, 60000.00, 30, 'Hiển thị', '2025-11-07 21:08:36'),
(2, 'Vip 3 tháng', 'demo', 150000.00, 90, 'Hiển thị', '2025-11-08 12:43:55');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hoadon`
--

CREATE TABLE `hoadon` (
  `id` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `goi_vip_id` int(11) NOT NULL,
  `so_tien` decimal(12,2) NOT NULL,
  `trang_thai` enum('Thành công','Thất bại','Đang xử lý') DEFAULT 'Đang xử lý',
  `ngay_mua` datetime DEFAULT current_timestamp(),
  `ngay_het_han` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `hoadon`
--

INSERT INTO `hoadon` (`id`, `user_id`, `goi_vip_id`, `so_tien`, `trang_thai`, `ngay_mua`, `ngay_het_han`) VALUES
('HD-LgmxJPN', 2, 2, 150000.00, 'Đang xử lý', '2026-01-10 15:20:36', '2026-04-10 15:20:35'),
('HDD3r4hg9r92lx', 1, 1, 110000.00, 'Đang xử lý', '2025-12-19 00:34:34', '2025-12-12 00:00:00'),
('HDD3r4hg9ư2lx', 1, 1, 110000.00, 'Đang xử lý', '2025-12-31 05:43:56', '2025-12-12 00:00:00'),
('HDD3rd4hg92lx', 1, 1, 110000.00, 'Đang xử lý', '2025-12-31 05:45:27', '2025-12-12 00:00:00'),
('HDD3rd4hgds92lx', 1, 1, 110000.00, 'Đang xử lý', '2026-04-29 20:47:04', '2025-12-12 00:00:00'),
('HDDmQ5EouA', 2, 2, 150000.00, 'Đang xử lý', '2026-01-10 10:14:42', '2026-04-10 10:14:41'),
('HDDRUYFmVs', 1, 1, 60000.00, 'Thành công', '2026-01-10 10:17:28', '2026-02-09 10:17:27'),
('HDdtibFLpk', 1, 1, 60000.00, 'Đang xử lý', '2026-02-04 08:04:53', '2026-03-03 08:04:51'),
('HDEpDGQgpv', 1, 2, 150000.00, 'Thành công', '2026-01-10 10:20:39', '2026-04-10 10:20:37'),
('HDmI4VQSCU', 1, 1, 60000.00, 'Đang xử lý', '2026-04-29 20:46:12', '2026-05-29 20:46:10'),
('HDPPtA1jW8', 1, 1, 60000.00, 'Đang xử lý', '2025-12-18 23:57:51', '2026-01-17 23:57:49'),
('HDqprVT3Tc', 1, 1, 60000.00, 'Thành công', '2026-01-10 16:14:47', '2026-02-09 16:14:43'),
('HDt0YKoyui', 2, 1, 60000.00, 'Đang xử lý', '2026-01-10 10:12:51', '2026-02-09 10:12:50'),
('HDZ1E2u6Bq', 2, 1, 60000.00, 'Đang xử lý', '2026-01-10 10:04:57', '2026-02-09 10:04:55');

--
-- Bẫy `hoadon`
--
DELIMITER $$
CREATE TRIGGER `trg_hoadon_update_success` AFTER UPDATE ON `hoadon` FOR EACH ROW BEGIN
  -- Chỉ chạy khi trạng thái đổi sang 'Thành công'
  IF NEW.trang_thai = 'Thành công' AND OLD.trang_thai <> 'Thành công' THEN
    UPDATE nguoi_dung
    SET 
      userlevel = 'VIP',
      vip_start = NOW(),
      vip_end = NEW.ngay_het_han
    WHERE id = NEW.user_id;
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lich_su_mua_vip`
--

CREATE TABLE `lich_su_mua_vip` (
  `id` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `goi_vip_id` int(11) NOT NULL,
  `ma_giao_dich` varchar(50) NOT NULL,
  `phuong_thuc` enum('VNPay','Momo','Banking','Thẻ tín dụng') NOT NULL,
  `so_tien` decimal(10,2) NOT NULL,
  `ngay_mua` datetime DEFAULT current_timestamp(),
  `ngay_het_han` datetime NOT NULL,
  `trang_thai` enum('Thành công','Thất bại','Đang xử lý') DEFAULT 'Thành công'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `lich_su_mua_vip`
--

INSERT INTO `lich_su_mua_vip` (`id`, `user_id`, `goi_vip_id`, `ma_giao_dich`, `phuong_thuc`, `so_tien`, `ngay_mua`, `ngay_het_han`, `trang_thai`) VALUES
('HDDRUYFmVs', 1, 1, '15389514', 'VNPay', 60000.00, '2026-01-10 10:18:10', '2026-02-09 10:17:27', 'Thành công'),
('HDEpDGQgpv', 1, 2, '15389520', 'VNPay', 150000.00, '2026-01-10 10:21:00', '2026-04-10 10:20:37', 'Thành công'),
('HDqprVT3Tc', 1, 1, '15389941', 'VNPay', 60000.00, '2026-01-10 16:15:29', '2026-02-09 16:14:43', 'Thành công');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lich_su_xem`
--

CREATE TABLE `lich_su_xem` (
  `user_id` int(11) NOT NULL,
  `phim_id` int(11) NOT NULL,
  `so_tap` int(11) DEFAULT NULL,
  `ngay_xem` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `lich_su_xem`
--

INSERT INTO `lich_su_xem` (`user_id`, `phim_id`, `so_tap`, `ngay_xem`) VALUES
(1, 1, NULL, '2025-11-06 14:17:47'),
(1, 7, NULL, '2025-10-25 16:48:53'),
(1, 8, NULL, '2025-10-25 15:37:02'),
(1, 10, NULL, '2025-10-30 13:00:34'),
(1, 12, NULL, '2025-10-18 07:39:11'),
(1, 13, NULL, '2025-10-25 15:54:36'),
(1, 17, NULL, '2025-12-18 16:43:24'),
(1, 18, NULL, '2025-11-06 14:40:30'),
(1, 19, NULL, '2025-11-05 15:26:01'),
(1, 20, NULL, '2026-01-04 01:13:07'),
(1, 21, NULL, '2026-01-10 09:13:55'),
(2, 3, NULL, '2025-11-03 15:07:24'),
(2, 19, NULL, '2026-01-10 06:29:38'),
(2, 20, NULL, '2026-01-10 05:39:51');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nguoi_dung`
--

CREATE TABLE `nguoi_dung` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `so_dien_thoai` varchar(15) DEFAULT NULL,
  `ho_ten` varchar(150) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `loai_tai_khoan` enum('User','Admin') DEFAULT 'User',
  `userlevel` enum('Thường','VIP') DEFAULT 'Thường',
  `vip_start` datetime DEFAULT NULL,
  `vip_end` datetime DEFAULT NULL,
  `trang_thai` enum('Hoạt động','Khóa') DEFAULT 'Hoạt động',
  `lan_dang_nhap_cuoi` timestamp NULL DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `nguoi_dung`
--

INSERT INTO `nguoi_dung` (`id`, `username`, `password`, `email`, `so_dien_thoai`, `ho_ten`, `avatar`, `loai_tai_khoan`, `userlevel`, `vip_start`, `vip_end`, `trang_thai`, `lan_dang_nhap_cuoi`, `created_at`) VALUES
(1, 'huy', '123', 'user02@example.com', '0909090909', 'Nguyễn Văn B', NULL, 'User', 'VIP', '2026-01-10 16:15:30', '2026-02-09 16:14:43', 'Hoạt động', '2025-09-23 13:31:25', '2025-10-20 23:00:07'),
(2, 'admin', '123', 'huyha22', '0357209702', 'HUY VU', 'abc', 'Admin', 'VIP', NULL, NULL, 'Hoạt động', NULL, '2025-07-01 23:00:07'),
(3, 'khanh', '123', 'khanh@gmail', '0357209702', 'khanh', NULL, 'User', 'Thường', NULL, NULL, 'Hoạt động', NULL, '2025-11-01 23:00:07'),
(4, 'huy1', '123', '', NULL, 'huyvu', 'abc', 'User', 'Thường', NULL, NULL, 'Hoạt động', NULL, '2026-01-10 12:40:42');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phim`
--

CREATE TABLE `phim` (
  `id` int(11) NOT NULL,
  `ten` varchar(255) NOT NULL,
  `ten_tieng_anh` varchar(255) DEFAULT NULL,
  `mota` text DEFAULT NULL,
  `anh_dai_dien` varchar(255) DEFAULT NULL,
  `daodien` varchar(255) DEFAULT NULL,
  `quocgia` varchar(100) NOT NULL,
  `ngay_phat_hanh` int(11) DEFAULT NULL,
  `trang_thai` enum('dang_chieu','sap_chieu','da_chieu') DEFAULT 'da_chieu',
  `loai` enum('bo','le') DEFAULT 'bo',
  `thoi_luong` int(11) DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `nhan_dan` varchar(255) DEFAULT NULL,
  `luotxem` int(11) DEFAULT 0,
  `status` enum('Hiển thị','Khóa') DEFAULT 'Hiển thị',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `phim`
--

INSERT INTO `phim` (`id`, `ten`, `ten_tieng_anh`, `mota`, `anh_dai_dien`, `daodien`, `quocgia`, `ngay_phat_hanh`, `trang_thai`, `loai`, `thoi_luong`, `video_url`, `nhan_dan`, `luotxem`, `status`, `created_at`) VALUES
(1, 'Trò chơi con mực 12', 'Squid Game', 'Trò chơi sinh tồn', 'squid-game-2021.jpg', 'demo', 'Hàn Quốc', 2025, '', 'bo', NULL, NULL, '', 0, 'Hiển thị', '2025-07-01 05:10:08'),
(2, 'Búp bê ma ám 2', 'Annabelle 2: Creation (2017)', 'Mô tả phim ABC', 'annabelle-2-khoi-nguon-creation-201705463.jpg', 'abc', 'Âu Mỹ', 2024, '', 'le', 120, 'https://example.com/video.mp4', '', 0, 'Hiển thị', '2025-07-01 15:20:49'),
(3, 'Búp Bê Ma Ám', 'Annabelle (2014)', 'Mô tả phim ABC', 'annabele-201705777.jpg', 'avc', 'Âu Mỹ', 2019, '', 'le', 120, 'https://example.com/video.mp4', '', 1, 'Hiển thị', '2025-07-02 01:23:19'),
(4, 'Vượt Ngục', 'Prison break', 'Mô tả phim ABC', 'vuot-nguc-phan-1.jpg', 'huy', 'Âu Mỹ', 2005, '', 'bo', NULL, NULL, '', 0, 'Hiển thị', '2025-07-03 05:09:21'),
(5, 'Ám ảnh kinh hoàng', 'The Conjuring (2013)', 'Mô tả phim ABC', 'am-anh-kinh-hoang-the--conjuring-201605874.jpg', 'abc', 'Âu Mỹ', 2013, '', 'le', 45, 'https://example.com/video.mp4', '', 0, 'Hiển thị', '2025-07-03 05:12:04'),
(6, 'The Conjuring (2013)', 'The Conjuring (2013)', 'Mô tả phim ABC', '0420e956de304f11a4854ad197cdb52f.webp', 'lee jung hoon', 'Âu Mỹ', 2017, '', 'le', 120, 'https://example.com/video.mp4', '', 0, 'Hiển thị', '2025-07-03 05:17:35'),
(7, 'Người Nhện: Không Còn Nhà', 'Spider-Man: No Way Home', 'Peter Parker nhờ Doctor Strange giúp đỡ, nhưng mọi chuyện vượt ngoài tầm kiểm soát.', 'nguoi-nhen-khong-con-nha.jpg', 'Jon Watts', 'Âu Mỹ', 2018, '', 'le', 148, 'https://example.com/videos/spiderman.mp4', '', 1, 'Hiển thị', '2025-09-22 15:17:43'),
(8, 'Người Hùng Yếu Đuối', 'Weak Hero', 'Câu chuyện về một học sinh tưởng chừng yếu đuối nhưng lại đứng lên chống lại bạo lực học đường bằng trí tuệ và sự kiên cường.', 'nguoi-hung-yeu-duoi.jpg', 'Han Jun-hee', 'Hàn Quốc', 2022, '', 'bo', NULL, NULL, '', 2, 'Hiển thị', '2025-09-22 15:34:49'),
(9, 'Người nhện', 'Spider men', 'abc', 'nguoi-nhen.jpg', 'abc', 'Âu Mỹ', 2005, '', 'le', 212, 'khongthuocve.mp4', '', 0, 'Hiển thị', '2025-09-25 14:13:02'),
(10, 'Vượt ngục 2', 'Prison break 2', 'avc', 'vuot-nguc-phan-2.jpg', 'avc', 'Âu Mỹ', 2005, '', 'bo', NULL, NULL, '', 1, 'Hiển thị', '2025-09-30 13:18:07'),
(11, 'Vượt ngục 3', 'Prison break 3', 'abc', 'vuot-nguc-3-201608158.jpg', 'abc', 'Âu Mỹ', 2006, '', 'bo', NULL, NULL, '', 0, 'Hiển thị', '2025-09-30 13:25:25'),
(12, 'Bóng ma anh quốc 1', 'Peaky Blinders Season 1 (2013)', 'abc', 'bong-ma-anh-quoc-phan-1.jpg', 'abc', 'Âu Mỹ', 2000, '', 'bo', NULL, NULL, '', 0, 'Khóa', '2025-09-30 13:28:31'),
(13, 'Vinh quang trong thù hận', 'The glory', 'abc', 'vinh-quang-trong-thu-han.jpg', 'abc', 'Hàn Quốc', 2022, '', 'bo', NULL, NULL, '', 1, 'Hiển thị', '2025-09-30 13:34:14'),
(14, 'Truy sát', 'Kill it', 'do an 4', '1d6f49e3dcf536d16ec3c210aeaa8e5c (1).webp', 'do an 4 1', 'Hàn Quốc', 2018, '', 'bo', NULL, NULL, '', 0, 'Hiển thị', '2025-09-30 13:46:55'),
(15, 'Búp Bê Ma Ám 3: Ác Quỷ Trở Về', 'Annabelle 3: Comes Home (2019)', 'do an 4', 'bup-be-ma-am-3-ac-quy-tro-ve.jpg', 'do an 4', 'Âu Mỹ', 2017, '', 'le', 120, 'khongthuocve.mp4', '', 0, 'Hiển thị', '2025-09-30 13:48:49'),
(16, 'Giải mã mê cung', 'The Maze Runner', 'do an 4', 'ff0c7ee7a1c0fce2d9326c5495dbf659dfc800b5.jpg', 'do an 4', 'Âu Mỹ', 2014, '', 'le', 114, 'khongthuocve.mp4', '', 0, 'Hiển thị', '2025-09-30 13:58:55'),
(17, 'Lãng khách', 'Vagabond', 'kịch tính nghẹt thở', 'lang-khach.jpg', 'test', 'Hàn Quốc', 2017, '', 'le', 120, 'khongthuocve.mp4', '', 2, 'Hiển thị', '2025-09-30 14:39:14'),
(18, 'Cảnh giác', 'Vigilante', 'test', 'canh-giac.jpg', 'test', 'Hàn Quốc', 2026, '', 'bo', NULL, NULL, '', 0, 'Hiển thị', '2025-09-30 14:44:15'),
(19, 'Vincenzo', 'Vincenzo', 'abc', '5e17867bc3648dec70e9a6e3b9c4f561.webp', ' Ham Seung-hoon, Kim Hee-won', 'Hàn Quốc', 2021, '', 'bo', NULL, NULL, '', 3, 'Hiển thị', '2025-10-28 15:00:41'),
(20, 'Trò Chơi Thao Túng 1', 'The Manipulated', '', '3de70ffa8b003c61a6a43ba64472aa39.webp', 'Park Shin-woo', 'Hàn Quốc', 2025, '', 'bo', NULL, NULL, '', 2, 'Hiển thị', '2025-11-16 16:04:33'),
(21, 'Avatar: Lửa và Tro Tàn', 'Avatar', 'abc', '92820de2f565c1cbd145af35f750ed38.webp', 'abc', 'Âu Mỹ', 2026, '', 'le', 120, 'The Manipulated.mp4', '', 1, 'Hiển thị', '2026-01-10 09:00:28'),
(22, 'Năm Đêm Kinh Hoàng 2', 'Five Nights at Freddy\'s 2', 'aaa', '497f0d1666d09e6613a4252f687888b3.webp', 'abc', 'Âu Mỹ', 2026, '', 'le', 120, 'The Manipulated.mp4', '', 0, 'Hiển thị', '2026-01-10 09:04:28');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phim_dien_vien`
--

CREATE TABLE `phim_dien_vien` (
  `phim_id` int(11) NOT NULL,
  `dien_vien_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `phim_dien_vien`
--

INSERT INTO `phim_dien_vien` (`phim_id`, `dien_vien_id`) VALUES
(1, 2),
(1, 13),
(2, 2),
(2, 8),
(3, 3),
(3, 11),
(4, 1),
(4, 3),
(5, 3),
(5, 7),
(6, 3),
(6, 15),
(7, 7),
(7, 8),
(8, 6),
(8, 10),
(9, 2),
(10, 2),
(11, 14),
(12, 9),
(13, 10),
(14, 10),
(15, 13),
(16, 12),
(17, 3),
(18, 8),
(19, 1),
(20, 13),
(21, 14),
(22, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phim_theloai`
--

CREATE TABLE `phim_theloai` (
  `phim_id` int(11) NOT NULL,
  `theloai_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `phim_theloai`
--

INSERT INTO `phim_theloai` (`phim_id`, `theloai_id`) VALUES
(1, 1),
(1, 3),
(2, 3),
(3, 3),
(4, 1),
(4, 4),
(5, 3),
(6, 1),
(6, 3),
(7, 1),
(7, 4),
(8, 1),
(8, 9),
(9, 1),
(9, 4),
(10, 1),
(10, 4),
(11, 1),
(11, 4),
(11, 12),
(12, 9),
(12, 12),
(13, 1),
(13, 9),
(14, 1),
(14, 4),
(15, 3),
(16, 7),
(16, 10),
(17, 1),
(17, 4),
(18, 1),
(18, 12),
(19, 1),
(19, 4),
(19, 9),
(19, 11),
(20, 1),
(20, 4),
(21, 1),
(21, 4),
(21, 7),
(22, 3);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `quocgia`
--

CREATE TABLE `quocgia` (
  `id` int(11) NOT NULL,
  `quocgia` varchar(100) NOT NULL,
  `status` enum('Hiển thị','Khóa') DEFAULT 'Hiển thị',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `quocgia`
--

INSERT INTO `quocgia` (`id`, `quocgia`, `status`, `created_at`) VALUES
(1, 'Hàn Quốc', 'Hiển thị', '2025-11-03 08:53:29'),
(2, 'Trung Quốc', 'Hiển thị', '2025-11-03 08:53:29'),
(3, 'Nhật Bản', 'Hiển thị', '2025-11-03 08:53:29'),
(4, 'Âu Mỹ', 'Hiển thị', '2025-11-03 08:53:29'),
(5, 'Đài Loan', 'Hiển thị', '2025-11-03 08:53:29'),
(6, 'Hồng Kông', 'Hiển thị', '2025-11-03 08:53:29'),
(7, 'noname', 'Hiển thị', '2025-11-03 08:53:29'),
(8, 'Hà Lan', 'Hiển thị', '2025-11-03 08:53:29'),
(9, 'Pháp', 'Hiển thị', '2025-11-03 08:53:29'),
(10, 'demo', 'Khóa', '2025-11-03 08:53:29'),
(11, 'acccvc123', 'Khóa', '2025-11-03 08:53:29'),
(12, 'test1', 'Khóa', '2025-11-03 08:53:29');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tap_phim`
--

CREATE TABLE `tap_phim` (
  `id` int(11) NOT NULL,
  `phim_id` int(11) DEFAULT NULL,
  `so_tap` int(11) DEFAULT NULL,
  `video_url` varchar(255) NOT NULL,
  `ngay_phat_hanh` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tap_phim`
--

INSERT INTO `tap_phim` (`id`, `phim_id`, `so_tap`, `video_url`, `ngay_phat_hanh`) VALUES
(60, 19, 1, 'khongthuocve.mp4', NULL),
(61, 19, 2, 'ghequa.mp4', NULL),
(62, 18, 1, 'khongthuocve.mp4', NULL),
(63, 18, 2, 'khongthuocve.mp4', NULL),
(64, 18, 3, 'ghequa.mp4', NULL),
(65, 4, 1, 'urlhuy', NULL),
(66, 4, 2, 'urlhuy', NULL),
(67, 4, 3, 'urlhuy', NULL),
(68, 8, 1, 'https://example.com/videos/weakhhero-ep1.mp4', NULL),
(69, 8, 2, 'https://example.com/videos/weakhhero-ep2.mp4', NULL),
(70, 8, 5, 'demo', NULL),
(71, 14, 1, 'do an 4', NULL),
(72, 13, 1, 'abcccfd', NULL),
(75, 20, 1, 'khongthuocve.mp4', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `theloai`
--

CREATE TABLE `theloai` (
  `id` int(11) NOT NULL,
  `ten` varchar(100) NOT NULL,
  `mota` varchar(100) DEFAULT NULL,
  `status` enum('Hiển thị','Khóa') DEFAULT 'Hiển thị',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `theloai`
--

INSERT INTO `theloai` (`id`, `ten`, `mota`, `status`, `created_at`) VALUES
(1, 'Hành động', 'Phim hành động ', 'Hiển thị', '2025-11-03 08:50:37'),
(3, 'Kinh dị', 'Phim kinh dị đáng sợ', 'Hiển thị', '2025-11-03 08:50:37'),
(4, 'Tình cảm', 'test 123323', 'Hiển thị', '2025-11-03 08:50:37'),
(6, 'Hài Hước', 'Phim với nội dung vui nhộn, gây cười và giải trí.', 'Hiển thị', '2025-11-03 08:50:37'),
(7, 'Khoa Học Viễn Tưởng', 'Phim khám phá các ý tưởng khoa học, công nghệ và tương lai.', 'Hiển thị', '2025-11-03 08:50:37'),
(8, 'Hoạt Hình', 'Phim hoạt hình dành cho mọi lứa tuổi, thường có đồ họa đẹp mắt.', 'Khóa', '2025-11-03 08:50:37'),
(9, 'Tâm Lý', 'Phim đi sâu vào tâm lý nhân vật, khám phá cảm xúc và suy nghĩ.', 'Hiển thị', '2025-11-03 08:50:37'),
(10, 'Phiêu Lưu', 'Phim kể về những chuyến đi khám phá, thám hiểm đầy thử thách.', 'Hiển thị', '2025-11-03 08:50:37'),
(11, 'Tội phạm', '', 'Hiển thị', '2025-11-03 08:50:37'),
(12, 'Hình Sự', 'Phim liên quan đến tội phạm, điều tra và phá án.', 'Hiển thị', '2025-11-03 08:50:37'),
(13, 'demo', 'demo', 'Khóa', '2025-11-03 08:50:37');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `yeuthich`
--

CREATE TABLE `yeuthich` (
  `user_id` int(11) NOT NULL,
  `phim_id` int(11) NOT NULL,
  `ngay` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `yeuthich`
--

INSERT INTO `yeuthich` (`user_id`, `phim_id`, `ngay`) VALUES
(1, 1, '2025-10-12 10:16:02'),
(1, 17, '2025-12-18 16:43:24'),
(1, 20, '2026-01-04 01:12:39'),
(1, 22, '2026-01-10 09:15:48'),
(2, 3, '2025-10-25 16:42:51'),
(2, 18, '2025-10-25 16:32:13'),
(2, 19, '2025-11-07 08:55:30'),
(2, 20, '2026-01-05 15:25:23');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `binhluan`
--
ALTER TABLE `binhluan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `phim_id` (`phim_id`);

--
-- Chỉ mục cho bảng `danhgia`
--
ALTER TABLE `danhgia`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_movie_rating` (`phim_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `dien_vien`
--
ALTER TABLE `dien_vien`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `goi_vip`
--
ALTER TABLE `goi_vip`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `hoadon`
--
ALTER TABLE `hoadon`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `goi_vip_id` (`goi_vip_id`);

--
-- Chỉ mục cho bảng `lich_su_mua_vip`
--
ALTER TABLE `lich_su_mua_vip`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ma_giao_dich` (`ma_giao_dich`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `goi_vip_id` (`goi_vip_id`);

--
-- Chỉ mục cho bảng `lich_su_xem`
--
ALTER TABLE `lich_su_xem`
  ADD PRIMARY KEY (`user_id`,`phim_id`),
  ADD KEY `phim_id` (`phim_id`);

--
-- Chỉ mục cho bảng `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Chỉ mục cho bảng `phim`
--
ALTER TABLE `phim`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `phim_dien_vien`
--
ALTER TABLE `phim_dien_vien`
  ADD PRIMARY KEY (`phim_id`,`dien_vien_id`),
  ADD KEY `dien_vien_id` (`dien_vien_id`);

--
-- Chỉ mục cho bảng `phim_theloai`
--
ALTER TABLE `phim_theloai`
  ADD PRIMARY KEY (`phim_id`,`theloai_id`),
  ADD KEY `theloai_id` (`theloai_id`);

--
-- Chỉ mục cho bảng `quocgia`
--
ALTER TABLE `quocgia`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `tap_phim`
--
ALTER TABLE `tap_phim`
  ADD PRIMARY KEY (`id`),
  ADD KEY `phim_id` (`phim_id`);

--
-- Chỉ mục cho bảng `theloai`
--
ALTER TABLE `theloai`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `yeuthich`
--
ALTER TABLE `yeuthich`
  ADD PRIMARY KEY (`user_id`,`phim_id`),
  ADD KEY `phim_id` (`phim_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `binhluan`
--
ALTER TABLE `binhluan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `danhgia`
--
ALTER TABLE `danhgia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `dien_vien`
--
ALTER TABLE `dien_vien`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `goi_vip`
--
ALTER TABLE `goi_vip`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `phim`
--
ALTER TABLE `phim`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT cho bảng `quocgia`
--
ALTER TABLE `quocgia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `tap_phim`
--
ALTER TABLE `tap_phim`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT cho bảng `theloai`
--
ALTER TABLE `theloai`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `binhluan`
--
ALTER TABLE `binhluan`
  ADD CONSTRAINT `binhluan_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `binhluan_ibfk_2` FOREIGN KEY (`phim_id`) REFERENCES `phim` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `danhgia`
--
ALTER TABLE `danhgia`
  ADD CONSTRAINT `danhgia_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `danhgia_ibfk_2` FOREIGN KEY (`phim_id`) REFERENCES `phim` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `hoadon`
--
ALTER TABLE `hoadon`
  ADD CONSTRAINT `hoadon_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `hoadon_ibfk_2` FOREIGN KEY (`goi_vip_id`) REFERENCES `goi_vip` (`id`);

--
-- Các ràng buộc cho bảng `lich_su_mua_vip`
--
ALTER TABLE `lich_su_mua_vip`
  ADD CONSTRAINT `lich_su_mua_vip_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `nguoi_dung` (`id`),
  ADD CONSTRAINT `lich_su_mua_vip_ibfk_2` FOREIGN KEY (`goi_vip_id`) REFERENCES `goi_vip` (`id`);

--
-- Các ràng buộc cho bảng `lich_su_xem`
--
ALTER TABLE `lich_su_xem`
  ADD CONSTRAINT `lich_su_xem_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lich_su_xem_ibfk_2` FOREIGN KEY (`phim_id`) REFERENCES `phim` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `phim_dien_vien`
--
ALTER TABLE `phim_dien_vien`
  ADD CONSTRAINT `phim_dien_vien_ibfk_1` FOREIGN KEY (`phim_id`) REFERENCES `phim` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `phim_dien_vien_ibfk_2` FOREIGN KEY (`dien_vien_id`) REFERENCES `dien_vien` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `phim_theloai`
--
ALTER TABLE `phim_theloai`
  ADD CONSTRAINT `phim_theloai_ibfk_1` FOREIGN KEY (`phim_id`) REFERENCES `phim` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `phim_theloai_ibfk_2` FOREIGN KEY (`theloai_id`) REFERENCES `theloai` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `tap_phim`
--
ALTER TABLE `tap_phim`
  ADD CONSTRAINT `tap_phim_ibfk_1` FOREIGN KEY (`phim_id`) REFERENCES `phim` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `yeuthich`
--
ALTER TABLE `yeuthich`
  ADD CONSTRAINT `yeuthich_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `yeuthich_ibfk_2` FOREIGN KEY (`phim_id`) REFERENCES `phim` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
