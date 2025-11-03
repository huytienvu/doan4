"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { addCommentMovie, getCommentMovie } from "@/services/comment";
import { Getiduser } from "@/utils/auth";
import { getRatingMovie } from "@/services/rating";

export default function CommentBox({ id }) {
  const [activeTab, setActiveTab] = useState("comments");
  const [comment, setComment] = useState("");
  const [user, setUser] = useState(null);
  const [listComment, setListComment] = useState([]);
  const [listRating, setListRating] = useState([]);

  // Mapping điểm số thành emoji và label
  const getRatingDisplay = (score) => {
    const ratingMap = {
      2: { emoji: '🤮', label: 'Dở tệ', color: 'text-red-500' },
      4: { emoji: '😴', label: 'Phim chán', color: 'text-orange-500' },
      6: { emoji: '😐', label: 'Khá ổn', color: 'text-yellow-500' },
      8: { emoji: '😊', label: 'Phim hay', color: 'text-green-500' },
      10: { emoji: '😍', label: 'Tuyệt vời', color: 'text-pink-500' }
    };
    return ratingMap[score] || { emoji: '😐', label: 'Chưa đánh giá', color: 'text-gray-500' };
  };

  // Tính điểm trung bình và thống kê
  const calculateStats = () => {
    if (listRating.length === 0) return { average: 0, distribution: {} };

    const distribution = { 2: 0, 4: 0, 6: 0, 8: 0, 10: 0 };
    let total = 0;

    listRating.forEach(review => {
      const score = Number(review.diem);
      if (distribution.hasOwnProperty(score)) {
        distribution[score]++;
        total += score;
      }
    });

    const average = (total / listRating.length).toFixed(1);
    return { average, distribution };
  };

  const fetdata = async () => {
    const data = await getCommentMovie(id);
    setListComment(data);
    const review = await getRatingMovie(id);
    setListRating(review);
    console.log(review);
  };

  useEffect(() => {
    fetdata();
  }, []);

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    const newComment = {
      user_id: Getiduser(),
      phim_id: id,
      binh_luan: comment,
    };

    await addCommentMovie(newComment);
    alert("Đã gửi bình luận: " + comment);
    fetdata();
    setComment("");
  };

  const stats = calculateStats();

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100 p-6 rounded-2xl shadow-2xl mt-8 border border-gray-800">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-800 mb-6">
        <button
          onClick={() => setActiveTab("comments")}
          className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-300 relative ${activeTab === "comments"
              ? "text-red-500"
              : "text-gray-400 hover:text-gray-200"
            }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Bình luận ({listComment.length})
          {activeTab === "comments" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-300 relative ${activeTab === "reviews"
              ? "text-red-500"
              : "text-gray-400 hover:text-gray-200"
            }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          Đánh giá ({listRating.length})
          {activeTab === "reviews" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Comments Tab */}
        {activeTab === "comments" && (
          <div className="animate-fadeIn">
            {/* Nhập bình luận */}
            <div className="flex items-start gap-4 mb-6">
              <Image
                src="/images/ava.jpg"
                alt="User Avatar"
                width={48}
                height={48}
                className="rounded-full border-2 border-gray-700 hover:border-red-500 transition-colors"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Viết bình luận của bạn..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="flex-1 bg-gray-800/50 backdrop-blur text-gray-100 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-gray-800 transition-all placeholder-gray-500"
                  />
                  <button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 py-3 rounded-full text-white font-semibold transition-all transform hover:scale-105 shadow-lg"
                  >
                    Gửi
                  </button>
                </div>
              </div>
            </div>

            {/* Danh sách bình luận */}
            <div className="space-y-4">
              {listComment.map((c) => (
                <div
                  key={c.id}
                  className="flex items-start gap-4 bg-gray-900/50 backdrop-blur p-4 rounded-xl border border-gray-800 hover:border-red-500/50 transition-all hover:bg-gray-900/70"
                >
                  <Image
                    src="/images/ava.jpg"
                    alt={c.username}
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-gray-700"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold text-sm text-gray-100">{c.username}</p>
                      <span className="text-xs text-gray-500">{c.ngay}</span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{c.binh_luan}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="animate-fadeIn">
            {/* Thống kê đánh giá */}
            <div className="bg-gray-900/50 backdrop-blur rounded-xl p-6 mb-6 border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold text-gray-100">Tổng quan đánh giá</h4>
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <span className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                      {stats.average}
                    </span>
                    <p className="text-xs text-gray-400">/10</p>
                  </div>
                  <div className="text-sm text-gray-400">
                    <p className="font-semibold text-gray-300">{listRating.length} đánh giá</p>
                  </div>
                </div>
              </div>

              {/* Phân bổ đánh giá */}
              <div className="space-y-3">
                {[10, 8, 6, 4, 2].map((score) => {
                  const rating = getRatingDisplay(score);
                  const count = stats.distribution[score] || 0;
                  const percentage = listRating.length > 0 ? (count / listRating.length) * 100 : 0;

                  return (
                    <div key={score} className="flex items-center gap-3">
                      <div className="flex items-center gap-2 w-28">
                        <span className="text-2xl">{rating.emoji}</span>
                        <span className={`text-xs font-medium ${rating.color}`}>{rating.label}</span>
                      </div>
                      <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${score === 10 ? 'bg-gradient-to-r from-pink-500 to-red-500' :
                              score === 8 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                                score === 6 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                                  score === 4 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                                    'bg-gradient-to-r from-red-600 to-red-700'
                            }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-12 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Danh sách đánh giá */}
            <div className="space-y-4">
              {listRating.map((review) => {
                const rating = getRatingDisplay(Number(review.diem));

                return (
                  <div
                    key={review.id}
                    className="bg-gray-900/50 backdrop-blur p-6 rounded-xl border border-gray-800 hover:border-red-500/50 transition-all hover:bg-gray-900/70"
                  >
                    <div className="flex items-start gap-4">
                      <Image
                        src="/images/ava.jpg"
                        alt={review.username}
                        width={56}
                        height={56}
                        className="rounded-full border-2 border-gray-700"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-1">
                              <p className="font-semibold text-gray-100 mb-1">{review.username}</p>
                              <div className="flex items-center gap-2 bg-gray-500 rounded-2xl px-2 py-2">
                                <span className="text-2xl">{rating.emoji}</span>
                                <div className="flex flex-col">
                                  <span className={`text-sm ${rating.color}`}>
                                    {rating.label}
                                  </span>

                                </div>
                              </div>
                            </div>

                          </div>
                          <span className="text-xs text-gray-500">{review.ngay}</span>
                        </div>

                        <p className="text-sm text-gray-300 leading-relaxed bg-gray-800/30 p-3 rounded-lg">
                          {review.danhgia}
                        </p>


                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty state */}
            {listRating.length === 0 && (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">😔</span>
                <p className="text-gray-400 text-lg mb-2">Chưa có đánh giá nào</p>
                <p className="text-gray-500 text-sm">Hãy là người đầu tiên đánh giá phim này!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}