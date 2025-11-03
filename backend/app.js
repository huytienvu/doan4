const express = require('express');
const cors = require('cors');//bật quyền truy cập từ FE
require('dotenv').config();

const invoiceRoutes = require('./Routes/routesPhim');
const tapphimRoutes = require('./Routes/routesTapphim');
const theloaiRoutes = require('./Routes/routesTheloai');
const quocgiaRoutes = require('./Routes/routesQuocgia');
const uploadRoutes = require('./Routes/routesUpload');
const dienvienRoutes = require('./Routes/routesDienvien');
const userRoutes = require('./Routes/routesUser');
const yeuthichRoutes= require('./Routes/routesYeuthich');
const lichsuRoutes= require('./Routes/routesLichsu');
const binhluanRoutes =require('./Routes/routesBinhluan')
const danhgiaRoutes =require('./Routes/routesDanhgia')

const phimAdminROutes =require('./Routes/admin/routesAdminPhim');
const theloaiAdminRoutes = require('./Routes/admin/routesAdminTheloai')
const thongkeAdminRoutes = require('./Routes/admin/routesAdminThongke')
const app = express();
const path = require('path');

app.use(cors());
app.use(express.json());
// Serve static files (ảnh) từ thư mục public
app.use('/upload', express.static(path.join(__dirname, 'public/upload')));

app.use('/api/phim', invoiceRoutes);
app.use('/api/tapphim', tapphimRoutes);
app.use('/api/theloai', theloaiRoutes);
app.use('/api/quocgia',quocgiaRoutes);
app.use('/api/dienvien',dienvienRoutes);
app.use('/api/upload',uploadRoutes);
app.use('/api/user',userRoutes);
app.use('/api/yeuthich', yeuthichRoutes);
app.use('/api/lichsu', lichsuRoutes);
app.use('/api/binhluan', binhluanRoutes);
app.use('/api/danhgia',danhgiaRoutes);


app.use('/api/admin/phim',phimAdminROutes);
app.use('/api/admin/theloai',theloaiAdminRoutes)
app.use('/api/admin/thongke',thongkeAdminRoutes)

const PORT = process.env.PORT || 5273;
const HOST = "0.0.0.0";
app.listen(PORT,HOST, () => {
  console.log(`Server is running on port ${HOST}:${PORT}`);
});