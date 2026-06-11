"use client";

import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { getDoanhthu } from "@/services/admin/thongke";

// Đăng ký chart components (BẮT BUỘC với Chart.js v4)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function DoanhThuChart() {
  const [chartData, setChartData] = useState(null);

  // 1️⃣ Fetch dữ liệu
  const fetchData = async () => {
    try {
      const res = await getDoanhthu();

      // 2️⃣ Xử lý data cho chart
      const labels = res.map((item) => `Tháng ${item.thang}`);
      const data = res.map((item) => item.doanh_thu);

      setChartData({
        labels,
        datasets: [
          {
            label: "Doanh thu (VNĐ)",
            data,
            backgroundColor: "rgba(85, 222, 247, 0.8)", // xanh dương
            borderRadius: 6,
          },
        ],
      });
    } catch (error) {
      console.error("Lỗi lấy doanh thu:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 3️⃣ Option cho chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#000",
        },
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            context.raw.toLocaleString("vi-VN") + " VNĐ",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#000",
        },  
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
      y: {
        ticks: {
          color: "#000",
          callback: (value) =>
            value.toLocaleString("vi-VN"),
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
    },
  };

  if (!chartData) {
    return <p className="text-gray-400">Đang tải biểu đồ...</p>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        📊 Doanh thu theo tháng
      </h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}
