"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CrownIcon,
  CheckIcon,
  XMarkIcon,
  SparklesIcon,
  BoltIcon,
  StarIcon,
  ShieldCheckIcon,
  FilmIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  TvIcon,
  GiftIcon,
  CreditCardIcon,
  BanknotesIcon,
  DeviceTabletIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  FireIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid,

} from '@heroicons/react/24/solid';
import { getGoiVip } from '@/services/vip';
import Swal from 'sweetalert2';
import { Getiduser } from '@/utils/auth';
import { VnpayCreate } from '@/services/vnpay/vnpay';
import { nanoid } from 'nanoid';

export default function VIPUpgradePage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [loading, setLoading] = useState(true);
  const [vipPackages, setVipPackages] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [goivip, setGoivip] = useState([]);
  // Mock current user info
  const currentUser = {
    name: 'Nguyễn Văn A',
    email: 'user@example.com',
    currentPlan: 'Free',
    expiryDate: null
  };

  const fetdata = async () => {
    const data = await getGoiVip();
    setGoivip(data);

  }
  // Fetch VIP packages
  useEffect(() => {
    fetdata();
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // VIP Features
  const vipFeatures = [
    {
      icon: FilmIcon,
      title: 'Xem phim không giới hạn',
      description: 'Truy cập toàn bộ kho phim'
    },
    {
      icon: SparklesIcon,
      title: 'Chất lượng 4K HDR',
      description: 'Hình ảnh sắc nét, âm thanh sống động'
    },
    {
      icon: BoltIcon,
      title: 'Không quảng cáo',
      description: 'Trải nghiệm xem phim không gián đoạn'
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'Xem đa thiết bị',
      description: 'Điện thoại, máy tính, TV thông minh'
    },
    {
      icon: ClockIcon,
      title: 'Xem phim mới sớm nhất',
      description: 'Cập nhật phim mới nhanh nhất'
    },
    {
      icon: GiftIcon,
      title: 'Ưu đãi đặc biệt',
      description: 'Quà tặng và khuyến mãi độc quyền'
    }
  ];

  // Payment methods
  const paymentMethods = [
    { id: 'credit-card', name: 'Thẻ tín dụng', icon: CreditCardIcon },
    { id: 'bank-transfer', name: 'Chuyển khoản', icon: BanknotesIcon },
    { id: 'e-wallet', name: 'Ví điện tử', icon: DevicePhoneMobileIcon }
  ];

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };


  // Handle upgrade
  const handleUpgrade = async (pkg) => {
    // Lấy thời điểm hiện tại
    const now = new Date();
    // Tính ngày hết hạn
    const ngayHetHan = new Date(now);
    ngayHetHan.setDate(now.getDate() + pkg.so_ngay);

    // Hàm format theo kiểu MySQL DATETIME
    function toMySQLDateTime(date) {
      const pad = n => n.toString().padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} `
        + `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    // Format lại
    const formatted = toMySQLDateTime(ngayHetHan);

    // Hiển thị
    // alert(`${pkg.id} - Ngày hết hạn: ${formatted} - Giá: ${pkg.gia}`);
    Swal.fire({
      title: "Xác nhận?",
      text: "Bạn chắc chắc chọn gói!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Done",
          text: "",
          icon: "success"
        });
        const id = 'HD' + nanoid(8);
        const obj ={
          id,
          user_id: Getiduser(),
          goi_vip_id: pkg.id,
          so_tien: pkg.gia,
          ngay_het_han: formatted
        }
        const data = await VnpayCreate(obj)
        window.location.href= data.URLpay
        
      }
    });
    setSelectedPlan(pkg);
    // setShowPaymentModal(true);
  };

  // Process payment
  const processPayment = () => {
    // Simulate payment processing
    alert(`Thanh toán gói ${selectedPlan.ten_goi} thành công!`);
    setShowPaymentModal(false);
    router.push('/profile');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="text-white mt-4">Đang tải gói VIP...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 py-12">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-4">
            {/* <CrownIconSolid className="h-12 w-12 text-white" /> */}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Nâng cấp tài khoản <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">VIP</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Mở khóa toàn bộ tính năng cao cấp và trải nghiệm xem phim tuyệt vời nhất
          </p>
        </div>

        {/* Current Status */}
        {currentUser.currentPlan === 'Free' && (
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 mb-12 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-800 rounded-xl">
                  <ShieldCheckIcon className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Gói hiện tại của bạn</p>
                  <p className="text-white text-xl font-bold">Tài khoản miễn phí</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Giới hạn</p>
                <p className="text-red-400 font-semibold">Có quảng cáo • Chất lượng SD</p>
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Quyền lợi VIP độc quyền
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {vipFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl">
                      <Icon className="h-6 w-6 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Chọn gói phù hợp với bạn
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {goivip.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800
                overflow-hidden hover:scale-105 transition-all duration-300`}
              >


                <div className="p-6">
                  {/* Package Icon */}
                  {/* <div className={`inline-flex items-center justify-center p-3 bg-gradient-to-r ${pkg.color} rounded-xl mb-4`}>
                    <CrownIcon className="h-8 w-8 text-white" />
                  </div> */}

                  {/* Package Name */}
                  <h3 className="text-xl font-bold text-white mb-2">{pkg.ten_goi}</h3>
                  <p className="text-gray-400 text-sm mb-4">{pkg.mo_ta || 'Gói VIP tiêu chuẩn'}</p>

                  {/* Price */}
                  <div className="mb-4">
                    <p className="text-3xl font-bold text-white">
                      {formatPrice(pkg.gia)}
                    </p>

                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-2 mb-6">
                    <ClockIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-300">{pkg.so_ngay} ngày</span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircleIcon className="h-4 w-4 text-green-400" />
                      Xem phim không giới hạn
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircleIcon className="h-4 w-4 text-green-400" />
                      Chất lượng 4K HDR
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircleIcon className="h-4 w-4 text-green-400" />
                      Không quảng cáo
                    </li>
                    {pkg.so_ngay >= 180 && (
                      <li className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircleIcon className="h-4 w-4 text-green-400" />
                        Ưu đãi đặc biệt
                      </li>
                    )}
                  </ul>

                  {/* Action Button */}
                  <button
                    onClick={() => handleUpgrade(pkg)}
                    className={`w-full py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25`

                    }
                  >
                    Chọn gói này
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why VIP Section */}
        <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-3xl p-8 md:p-12 mb-12 max-w-5xl mx-auto border border-yellow-800/30">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Tại sao nên nâng cấp VIP?
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckIcon className="h-6 w-6 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold">Tiết kiệm thời gian</p>
                    <p className="text-gray-400 text-sm">Không phải xem quảng cáo, tập trung vào nội dung</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="h-6 w-6 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold">Trải nghiệm cao cấp</p>
                    <p className="text-gray-400 text-sm">Chất lượng hình ảnh và âm thanh tốt nhất</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="h-6 w-6 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold">Hỗ trợ nhà sản xuất</p>
                    <p className="text-gray-400 text-sm">Đóng góp cho việc phát triển nội dung chất lượng</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-3xl opacity-30"></div>
                {/* <CrownIconSolid className="h-48 w-48 text-yellow-400 relative animate-pulse" /> */}
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Câu hỏi thường gặp
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Tôi có thể hủy gói VIP không?',
                a: 'Bạn có thể hủy gói VIP bất cứ lúc nào. Tài khoản VIP sẽ hoạt động đến hết thời hạn đã đăng ký.'
              },
              {
                q: 'Có thể xem trên bao nhiêu thiết bị?',
                a: 'Gói VIP cho phép xem đồng thời trên 3 thiết bị khác nhau.'
              },
              {
                q: 'Thanh toán có an toàn không?',
                a: 'Chúng tôi sử dụng công nghệ mã hóa SSL và các cổng thanh toán uy tín để đảm bảo an toàn tuyệt đối.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
                <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-md w-full border border-gray-800">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Thanh toán</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Selected Plan Summary */}
              <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Gói đã chọn:</span>
                  <span className="text-white font-bold">{selectedPlan.ten_goi}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Thời hạn:</span>
                  <span className="text-white">{selectedPlan.so_ngay} ngày</span>
                </div>
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Tổng thanh toán:</span>
                    <span className="text-2xl font-bold text-yellow-400">
                      {formatPrice(selectedPlan.gia)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <label className="text-white font-semibold mb-3 block">
                  Phương thức thanh toán
                </label>
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <label
                        key={method.id}
                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === method.id
                          ? 'border-yellow-500 bg-yellow-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                          }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="sr-only"
                        />
                        <Icon className="h-6 w-6 text-gray-400" />
                        <span className="text-white">{method.name}</span>
                        {paymentMethod === method.id && (
                          <CheckCircleIcon className="h-5 w-5 text-yellow-400 ml-auto" />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={processPayment}
                  className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Thanh toán ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}