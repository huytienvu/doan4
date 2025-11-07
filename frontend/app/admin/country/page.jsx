// app/page.jsx (hoặc pages/index.jsx tùy version Next.js)
'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, FilmIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { createCountry, getAllCountry, updateCountry } from '@/services/admin/quocgia';


export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ quocgia: '',status:"Hiển thị"});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getAllCountry();
      setCategories(data);
      console.log(data);
      
    } catch (error) {
      console.error('Lỗi khi tải quốc gia:', error);
      setError('Không thể tải danh sách quốc gia');
    } finally {
      setLoading(false);
    }
  };
  // Load danh sách quốc gia từ API
  useEffect(() => {

    loadCategories();
  }, []);

  // Mở modal thêm mới
  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ quocgia: '' });
    setError('');
    setIsModalOpen(true);
  };

  // Mở modal chỉnh sửa
  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ quocgia: category.quocgia, status: category.status});
    setError('');
    setIsModalOpen(true);
  };

  // Xóa quốc gia
  const handleDelete = async (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa quốc gia này?')) {
      try {
        await DeleteCategory(id);
        setCategories(categories.filter(cat => cat.id !== id));
        alert('Xóa quốc gia thành công!');
      } catch (error) {
        console.error('Lỗi khi xóa quốc gia:', error);
        alert('Lỗi khi xóa quốc gia!');
      }
    }
  };

  // Lưu quốc gia (thêm mới hoặc cập nhật)
  const handleSave = async () => {
    if (!formData.quocgia.trim()) {
      setError('Vui lòng nhập tên quốc gia');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editingCategory) {
        // Cập nhật
        await updateCountry(editingCategory.id, formData);
        loadCategories();
        alert('Cập nhật quốc gia thành công!');
      } else {
        // Thêm mới
        const newCategory = await createCountry(formData);
        loadCategories();
        alert('Thêm quốc gia thành công!');
      }

      setIsModalOpen(false);
      setFormData({ quocgia: ''});
    } catch (error) {
      console.error('Lỗi khi lưu quốc gia:', error);
      setError('Lỗi khi lưu quốc gia. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                <FilmIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Quản Lý Quốc Gia Phim
                </h1>
                <p className="text-gray-500 mt-1">Quản lý và tổ chức quốc gia phim của bạn</p>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Thêm quốc gia</span>
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  // value={searchTerm}
                  // onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-transparent rounded-xl focus:border-blue-400 focus:outline-none focus:bg-white transition-all duration-200"
                  placeholder="Tìm kiếm theo tên hoặc mô tả quốc gia..."
                />
               
              </div>
            </div>


          </div>

          {/* Search Results Info */}
          {/* {searchTerm && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Tìm thấy <span className="font-semibold text-blue-600">{filteredCategories.length}</span> kết quả
                {searchTerm && (
                  <span> cho "<span className="font-semibold">{searchTerm}</span>"</span>
                )}
              </p>
              {filteredCategories.length !== categories.length && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Xem tất cả
                </button>
              )}
            </div>
          )} */}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-red-500 text-lg">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Thử lại
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      quốc gia
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      trạng thái
                    </th>
                    
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories.map((category, index) => (
                    <tr
                      key={category.id}
                      className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 font-bold">
                          {category.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-900 font-semibold text-lg">
                          {category.quocgia}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-gray-600">
                          {category.created_at
                            ? new Date(category.created_at)
                              .toLocaleString('vi-VN')
                              
                            : 'Không có thời gian'}
                        </span>
                      </td>

                      <td className="px-6 py-4 ">
                        <span className={` px-2 py-2 rounded-2xl ${category.status == "Khóa"
                          ? 'bg-red-400' : 'bg-green-300'}`}>
                          <span className={` text-xs font-semibold ${category.status == "Khóa"
                            ? 'text-red-950' : 'text-green-700'}`}>
                            {category.status}
                          </span>
                        </span>

                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="bg-blue-100 text-blue-600 p-2.5 rounded-lg hover:bg-blue-200 transition-colors duration-200 group"
                          >
                            <PencilIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="bg-red-100 text-red-600 p-2.5 rounded-lg hover:bg-red-200 transition-colors duration-200 group"
                          >
                            <TrashIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && categories.length === 0 && (
            <div className="text-center py-12">
              <FilmIcon className="h-20 w-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Chưa có quốc gia nào</p>
              <p className="text-gray-400 mt-2">Bắt đầu bằng cách thêm quốc gia mới</p>
            </div>
          )}
        </div>

        {/* Statistics Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Tổng quốc gia</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{categories.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FilmIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Mới Cập Nhật</p>
                <p className="text-lg font-semibold text-gray-800 mt-2">Hôm nay</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <PencilIcon className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Trạng Thái</p>
                <p className="text-lg font-semibold text-green-600 mt-2">Hoạt động</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-green-500 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 ">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {editingCategory ? 'Chỉnh Sửa quốc gia' : 'Thêm quốc gia Mới'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên quốc gia <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.quocgia}
                    onChange={(e) => setFormData({ ...formData, quocgia: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                    placeholder="Nhập tên quốc gia..."
                  />
                </div>

                <div>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  >
                    <option value="Hiển thị">Hiển thị</option>
                    <option value="Khóa">Khóa</option>

                  </select>
                </div>

                

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang xử lý...' : (editingCategory ? 'Cập Nhật' : 'Thêm Mới')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}