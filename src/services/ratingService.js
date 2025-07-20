const API_BASE_URL = 'https://localhost:5000/api/ratings';

class RatingService {
    // Get all ratings for a course
    async getRatingsByCourse(courseId) {
        try {
            const response = await fetch(`${API_BASE_URL}/course/${courseId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching ratings by course:', error);
            throw error;
        }
    }

    // Get paginated ratings for a course
    async getRatingsByCoursePaginated(courseId, page = 1, pageSize = 10) {
        try {
            const response = await fetch(`${API_BASE_URL}/course/${courseId}/paged?page=${page}&pageSize=${pageSize}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching paginated ratings:', error);
            throw error;
        }
    }

    // Get average rating for a course
    async getAverageRating(courseId) {
        try {
            const response = await fetch(`${API_BASE_URL}/course/${courseId}/average`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.average;
        } catch (error) {
            console.error('Error fetching average rating:', error);
            throw error;
        }
    }

    // Get user's rating for a course
    async getUserRatingForCourse(courseId, userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/course/${courseId}/user/${userId}`);
            if (response.status === 404) {
                return null; // User hasn't rated this course
            }
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching user rating:', error);
            throw error;
        }
    }

    // Create or update rating
    async createRating(ratingData) {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ratingData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating rating:', error);
            throw error;
        }
    }

    // Delete rating
    async deleteRating(ratingId) {
        try {
            const response = await fetch(`${API_BASE_URL}/${ratingId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error deleting rating:', error);
            throw error;
        }
    }

    // Update API base URL if needed
    setApiBaseUrl(newBaseUrl) {
        API_BASE_URL = newBaseUrl;
    }
}

// Export singleton instance
const ratingService = new RatingService();
export default ratingService;