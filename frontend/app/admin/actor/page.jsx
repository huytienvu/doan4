// app/page.jsx (hoặc pages/index.jsx tùy version Next.js)
'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, FilmIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getAllActor, createActor, updateActor } from '@/services/actor';
import { APIUploadActor } from '@/services/upload';
import { toast } from 'react-toastify';

export default function ActorManagement() {
    const [actors, setActors] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingActor, setEditingActor] = useState(null);
    const [formData, setFormData] = useState({ ten: '', anh: '',status: "Hiển thị" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState('');

    // Load danh sách diễn viên từ API
    const loadActors = async () => {
        setLoading(true);
        try {
            const data = await getAllActor();
            setActors(data);
        } catch (error) {
            console.error('Lỗi khi tải diễn viên:', error);
            setError('Không thể tải danh sách diễn viên');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadActors();
    }, []);

    // Mở modal thêm mới
    const handleAdd = () => {
        setEditingActor(null);
        setFormData({ ten: '', anh: '' });
        setImagePreview('');
        setError('');
        setIsModalOpen(true);
    };

    // Mở modal chỉnh sửa
    const handleEdit = (actor) => {
        setEditingActor(actor);
        setFormData({ ten: actor.ten, anh: actor.anh || '', status : actor.status });
        setImagePreview(actor.anh || '');
        setError('');
        setIsModalOpen(true);
    };

    // Xóa diễn viên
    const handleDelete = async (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa diễn viên này?')) {
            try {
                // TODO: Thêm API xóa diễn viên
                setActors(actors.filter(actor => actor.id !== id));
                alert('Xóa diễn viên thành công!');
            } catch (error) {
                console.error('Lỗi khi xóa diễn viên:', error);
                alert('Lỗi khi xóa diễn viên!');
            }
        }
    };

    // Xử lý thay đổi ảnh
    const handleImageChange = (e) => {
        const value = e.target.value;
        setFormData({ ...formData, anh: value });
        setImagePreview(value);
    };

    // Upload file ảnh
    const handleFileUpload = async (file) => {
        try {
            const result = await APIUploadActor(file);
            setFormData({ ...formData, anh: result.filename });
            setImagePreview(result.filename);
        } catch (error) {
            console.error('Lỗi khi upload ảnh:', error);
            setError('Lỗi khi upload ảnh');
        }
    };

    // Lưu diễn viên (thêm mới hoặc cập nhật)
    const handleSave = async () => {
        if (!formData.ten.trim()) {
            setError('Vui lòng nhập tên diễn viên');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (editingActor) {
                // Cập nhật
                await updateActor(editingActor.id, formData);
                setActors(actors.map(actor =>
                    actor.id === editingActor.id
                        ? { ...actor, ten: formData.ten, anh: formData.anh }
                        : actor
                ));
                toast.success('Cập nhật diễn viên thành công!');
                loadActors()
            } else {
                // Thêm mới
                await createActor(formData);
                loadActors();
                alert('Thêm diễn viên thành công!');
            }

            setIsModalOpen(false);
            setFormData({ ten: '', anh: '' });
            setImagePreview('');
        } catch (error) {
            console.error('Lỗi khi lưu diễn viên:', error);
            setError('Lỗi khi lưu diễn viên. Vui lòng thử lại!');
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
                                    Quản Lý Diễn viên Phim
                                </h1>
                                <p className="text-gray-500 mt-1">Quản lý và tổ chức diễn viên phim của bạn</p>
                            </div>
                        </div>
                        <button
                            onClick={handleAdd}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                        >
                            <PlusIcon className="h-5 w-5" />
                            <span>Thêm Diễn viên</span>
                        </button>
                    </div>
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
                                            Ảnh
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                            Diễn viên
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                            Ngày tạo
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                            Trạng thái
                                        </th>
                                        <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                                            Thao Tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {actors.map((actor, index) => (
                                        <tr
                                            key={actor.id}
                                            className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-colors duration-200"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 font-bold">
                                                    {actor.id}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {actor.anh ? (
                                                    <img
                                                        src={actor.anh.startsWith('http') ? actor.anh : `http://localhost:5273/upload/dienvien/${actor.anh}`}
                                                        alt={actor.ten}
                                                        className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
                                                        onError={(e) => {
                                                            e.target.src = '/images/ava.jpg';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                        <FilmIcon className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-900 font-semibold text-lg">
                                                    {actor.ten}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-600">
                                                    {new Date (actor.created_at).toLocaleString("vi-VN") || 'Không có dữ liệu'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 ">
                                                <span className={` px-2 py-2 rounded-2xl ${actor.status == "Khóa"
                                                    ? 'bg-red-400' : 'bg-green-300'}`}>
                                                    <span className={` text-xs font-semibold ${actor.status == "Khóa"
                                                        ? 'text-red-950' : 'text-green-700'}`}>
                                                        {actor.status}
                                                    </span>
                                                </span>

                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(actor)}
                                                        className="bg-blue-100 text-blue-600 p-2.5 rounded-lg hover:bg-blue-200 transition-colors duration-200 group"
                                                    >
                                                        <PencilIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(actor.id)}
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

                    {!loading && !error && actors.length === 0 && (
                        <div className="text-center py-12">
                            <FilmIcon className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">Chưa có diễn viên nào</p>
                            <p className="text-gray-400 mt-2">Bắt đầu bằng cách thêm diễn viên mới</p>
                        </div>
                    )}
                </div>


            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 ">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white">
                                    {editingActor ? 'Chỉnh Sửa Diễn Viên' : 'Thêm Diễn Viên Mới'}
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
                                        Tên Diễn Viên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.ten}
                                        onChange={(e) => setFormData({ ...formData, ten: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                                        placeholder="Nhập tên diễn viên..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Ảnh diễn viên
                                    </label>
                                    <div className="space-y-3">
                                        {/* Input link ảnh */}
                                        <input
                                            type="text"
                                            value={formData.anh}
                                            onChange={handleImageChange}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                                            placeholder="Nhập link ảnh hoặc upload file..."
                                        />

                                        {/* Upload file */}
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        handleFileUpload(file);
                                                    }
                                                }}
                                                className="hidden"
                                                id="image-upload"
                                            />
                                            <label
                                                htmlFor="image-upload"
                                                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 cursor-pointer transition-colors duration-200"
                                            >
                                                Upload ảnh
                                            </label>
                                        </div>

                                        {/* Preview ảnh */}
                                        {imagePreview && (
                                            <div className="mt-3">
                                                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                                <div className="relative inline-block">
                                                    <img
                                                        src={imagePreview.startsWith('http') ? imagePreview : `http://localhost:5273/upload/dienvien/${imagePreview}`}
                                                        alt="Preview"
                                                        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
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
                                    {loading ? 'Đang xử lý...' : (editingActor ? 'Cập Nhật' : 'Thêm Mới')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}