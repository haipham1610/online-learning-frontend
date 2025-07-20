import { useState, useEffect, useCallback } from 'react';
import ratingService from '../services/ratingService';

export const useRatings = (courseId, userId) => {
    const [ratings, setRatings] = useState([]);
    const [userRating, setUserRating] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [pageSize] = useState(10);

    // Fetch paginated ratings
    const fetchPaginatedRatings = useCallback(async (page = 1) => {
        if (!courseId) return;

        setLoading(true);
        setError('');

        try {
            const data = await ratingService.getRatingsByCoursePaginated(courseId, page, pageSize);
            setRatings(data.data);
            setTotalCount(data.totalCount);
            setCurrentPage(data.page);
        } catch (err) {
            setError('Không thể tải danh sách đánh giá');
            console.error('Error fetching ratings:', err);
        } finally {
            setLoading(false);
        }
    }, [courseId, pageSize]);

    // Fetch user's rating for the course
    const fetchUserRating = useCallback(async () => {
        if (!courseId || !userId) return;

        try {
            const data = await ratingService.getUserRatingForCourse(courseId, userId);
            setUserRating(data);
        } catch (err) {
            setUserRating(null);
            console.error('Error fetching user rating:', err);
        }
    }, [courseId, userId]);

    // Fetch average rating
    const fetchAverageRating = useCallback(async () => {
        if (!courseId) return;

        try {
            const average = await ratingService.getAverageRating(courseId);
            setAverageRating(average);
        } catch (err) {
            setAverageRating(0);
            console.error('Error fetching average rating:', err);
        }
    }, [courseId]);

    // Create or update rating
    const submitRating = async (ratingData) => {
        if (!courseId || !userId) {
            throw new Error('Course ID và User ID là bắt buộc');
        }

        setLoading(true);
        setError('');

        try {
            const submitData = {
                userId: userId,
                courseID: courseId,
                score: ratingData.score,
                reviewText: ratingData.reviewText
            };

            await ratingService.createRating(submitData);

            // Refresh data after successful submission
            await Promise.all([
                fetchUserRating(),
                fetchAverageRating(),
                fetchPaginatedRatings(currentPage)
            ]);

            return { success: true, message: 'Đánh giá đã được gửi thành công!' };
        } catch (err) {
            const errorMessage = err.message || 'Có lỗi xảy ra khi gửi đánh giá';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Delete rating
    const deleteRating = async (ratingId) => {
        setLoading(true);
        setError('');

        try {
            await ratingService.deleteRating(ratingId);

            // Refresh data after successful deletion
            await Promise.all([
                fetchUserRating(),
                fetchAverageRating(),
                fetchPaginatedRatings(currentPage)
            ]);

            return { success: true, message: 'Đánh giá đã được xóa thành công!' };
        } catch (err) {
            const errorMessage = err.message || 'Có lỗi xảy ra khi xóa đánh giá';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Go to specific page
    const goToPage = (page) => {
        if (page >= 1 && page <= Math.ceil(totalCount / pageSize)) {
            fetchPaginatedRatings(page);
        }
    };

    // Refresh all data
    const refreshData = useCallback(() => {
        Promise.all([
            fetchUserRating(),
            fetchAverageRating(),
            fetchPaginatedRatings(currentPage)
        ]);
    }, [fetchUserRating, fetchAverageRating, fetchPaginatedRatings, currentPage]);

    // Clear error
    const clearError = () => setError('');

    // Initial data fetch
    useEffect(() => {
        if (courseId) {
            refreshData();
        }
    }, [courseId, userId, refreshData]);

    return {
        // Data
        ratings,
        userRating,
        averageRating,
        currentPage,
        totalCount,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),

        // States
        loading,
        error,

        // Actions
        submitRating,
        deleteRating,
        goToPage,
        refreshData,
        clearError,

        // Fetch functions
        fetchPaginatedRatings,
        fetchUserRating,
        fetchAverageRating
    };
};