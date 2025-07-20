import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Eye, Edit, User, Calendar, Star } from 'lucide-react';

import { useRatings } from "../../../hooks/useRatings";
import RatingForm from './RatingForm';
import RatingCard from './RatingCard';
import StarRating from './StarRating';
import LoadingSpinner from "../../common/LoadingSpinner";
import Pagination from "../../common/Pagination";


const CourseRatingsManager = () => {
    const { courseId } = useParams();
    const [userId, setUserId] = useState('');
    const [activeTab, setActiveTab] = useState('view');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        if (savedUser?.userId) {
            setUserId(savedUser.userId);
        }
    }, []);

    const {
        ratings,
        userRating,
        averageRating,
        currentPage,
        totalCount,
        totalPages,
        loading,
        error,
        submitRating,
        deleteRating,
        goToPage,
        clearError
    } = useRatings(courseId, userId);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => clearError(), 5000);
            return () => clearTimeout(timer);
        }
    }, [error, clearError]);

    const handleRatingSubmit = async (ratingData) => {
        try {
            await submitRating(ratingData);
            setSuccess('Đánh giá đã được gửi thành công!');
            setActiveTab('view');
        } catch { }
    };

    const handleRatingDelete = async (ratingId) => {
        try {
            await deleteRating(ratingId);
            setSuccess('Đánh giá đã được xóa thành công!');
        } catch { }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-6 rounded-xl mb-6 shadow-md">
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
                    <Star className="w-8 h-8" /> Đánh giá khóa học
                </h1>
                <p className="text-indigo-100 text-lg">Học viên có thể gửi, chỉnh sửa và xem đánh giá của họ tại đây</p>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={clearError} className="text-red-700 hover:text-red-900 font-bold">×</button>
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center justify-between">
                    <span>{success}</span>
                    <button onClick={() => setSuccess('')} className="text-green-700 hover:text-green-900 font-bold">×</button>
                </div>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" /> Thống kê tổng quan
                </h2>
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3">
                        <StarRating score={Math.round(averageRating)} />
                        <span className="text-3xl font-bold text-blue-600">{averageRating.toFixed(1)}</span>
                    </div>
                    <div className="text-base text-gray-600">
                        <span className="font-medium">{totalCount}</span> lượt đánh giá
                    </div>
                </div>
            </div>

            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg shadow-sm">
                <button
                    className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'view' ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:text-gray-800'}`}
                    onClick={() => setActiveTab('view')}
                >
                    <Eye className="w-4 h-4 inline mr-2" /> Xem đánh giá
                </button>
                <button
                    className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'create' ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:text-gray-800'}`}
                    onClick={() => setActiveTab('create')}
                >
                    <Edit className="w-4 h-4 inline mr-2" /> {userRating ? 'Cập nhật đánh giá' : 'Tạo đánh giá'}
                </button>
            </div>

            {activeTab === 'view' ? (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Danh sách đánh giá học viên</h2>
                        <div className="text-sm text-gray-500">
                            Trang {currentPage} / {totalPages}
                        </div>
                    </div>

                    {loading ? (
                        <LoadingSpinner size="large" text="Đang tải danh sách đánh giá..." />
                    ) : ratings.length === 0 ? (
                        <div className="text-center py-12">
                            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">Hiện chưa có đánh giá nào cho khóa học này</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {ratings.map((rating) => (
                                    <RatingCard
                                        key={rating.ratingID}
                                        rating={rating}
                                        currentUserId={userId}
                                        onDelete={handleRatingDelete}
                                    />
                                ))}
                            </div>
                            {totalPages > 1 && (
                                <div className="mt-8">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={goToPage}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            ) : (
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        {userRating ? 'Chỉnh sửa đánh giá của bạn' : 'Tạo đánh giá mới'}
                    </h2>

                    {userRating && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <h3 className="font-medium text-blue-900 mb-3 flex items-center">
                                <User className="w-5 h-5 mr-2" /> Đánh giá hiện tại của bạn:
                            </h3>
                            <div className="space-y-2">
                                <StarRating score={userRating.score} />
                                {userRating.reviewText && (
                                    <p className="text-blue-800">{userRating.reviewText}</p>
                                )}
                                <p className="text-sm text-blue-600">
                                    Tạo lúc: {new Date(userRating.createdAt).toLocaleDateString('vi-VN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    )}

                    <RatingForm
                        onSubmit={handleRatingSubmit}
                        loading={loading}
                        initialData={userRating}
                    />
                </div>
            )}
        </div>
    );
};

export default CourseRatingsManager;
