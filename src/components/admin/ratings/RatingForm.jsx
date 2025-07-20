import React, { useState } from 'react';
import { Send } from 'lucide-react';
import StarRating from './StarRating';
import LoadingSpinner from "../../common/LoadingSpinner";


const RatingForm = ({
    onSubmit,
    loading = false,
    initialData = null,
    className = ''
}) => {
    const [formData, setFormData] = useState({
        score: initialData?.score || 5,
        reviewText: initialData?.reviewText || ''
    });

    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit(formData);
        }
    };

    const handleScoreChange = (score) => {
        setFormData(prev => ({ ...prev, score }));
    };

    const handleReviewChange = (e) => {
        setFormData(prev => ({ ...prev, reviewText: e.target.value }));
    };

    return (
        <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
            <h3 className="text-lg font-semibold mb-4">
                {initialData ? 'Cập nhật đánh giá' : 'Tạo đánh giá mới'}
            </h3>

            <div className="space-y-4">
                {/* Score Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Điểm đánh giá
                    </label>
                    <div className="flex items-center space-x-4">
                        <StarRating
                            score={formData.score}
                            interactive={true}
                            onStarClick={handleScoreChange}
                            showText={false}
                        />
                        <select
                            value={formData.score}
                            onChange={(e) => handleScoreChange(parseInt(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {[1, 2, 3, 4, 5].map(score => (
                                <option key={score} value={score}>
                                    {score} sao
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Review Text */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nhận xét
                    </label>
                    <textarea
                        value={formData.reviewText}
                        onChange={handleReviewChange}
                        rows={4}
                        maxLength={500}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Chia sẻ kinh nghiệm của bạn về khóa học này..."
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        {formData.reviewText.length}/500 ký tự
                    </p>
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
                >
                    {loading ? (
                        <LoadingSpinner size="sm" />
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            <span>{initialData ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default RatingForm;
