import React from 'react';
import { Calendar, User, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import StarRating from './StarRating';

const RatingCard = ({ rating, currentUserId, onDelete, className = '' }) => {
    const isCurrentUser = rating.userID?.trim() === currentUserId?.trim();

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDelete = async () => {
        toast((t) => (
            <span>
                Bạn có chắc chắn muốn xóa đánh giá này?
                <div className="mt-2 flex justify-end gap-2">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            await onDelete(rating.ratingID);
                            toast.success('Đã xóa đánh giá!');
                        }}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                        Xóa
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
                    >
                        Hủy
                    </button>
                </div>
            </span>
        ), {
            duration: 8000,
        });
    };

    return (
        <div
            className={`
                border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow
                ${isCurrentUser ? 'bg-yellow-50' : 'bg-white'}
                ${className}
            `}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                        <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <span className="font-medium text-gray-900 block">
                            {rating.userID.trim()}
                        </span>
                        <span className="text-sm text-gray-500">
                            ID: {rating.ratingID}
                        </span>
                    </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(rating.createdAt)}</span>
                </div>
            </div>

            {/* Rating */}
            <div className="mb-3">
                <StarRating score={rating.score} />
            </div>

            {/* Review Text */}
            {rating.reviewText && (
                <div className="mb-3">
                    <p className="text-gray-700 leading-relaxed">
                        {rating.reviewText}
                    </p>
                </div>
            )}

            {/* Actions */}
            {isCurrentUser && (
                <div className="flex justify-end pt-2 border-t border-gray-100">
                    <button
                        onClick={handleDelete}
                        className="flex items-center space-x-2 text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>Xóa đánh giá</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default RatingCard;
