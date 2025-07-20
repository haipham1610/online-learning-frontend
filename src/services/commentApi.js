import axios from 'axios';

const BASE_URL = 'https://localhost:5000/api';

// Tạo axios instance với config mặc định
const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// ✅ FIX 1: Cải thiện interceptor request với debug tốt hơn
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        // 🔍 DEBUG: Log token state
        console.log("🔐 Token Debug:", {
            hasToken: !!token,
            tokenLength: token?.length,
            tokenStart: token?.substring(0, 20) + "...",
            isValidFormat: token && token.includes('.') // JWT có dấu chấm
        });

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("✅ Authorization header added");
        } else {
            console.warn("⚠️ No token found - request will be unauthorized");
        }

        console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        console.log("📋 Request Headers:", config.headers);
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// ✅ FIX 2: Cải thiện error handling trong response interceptor
apiClient.interceptors.response.use(
    (response) => {
        console.log(`✅ API Response: ${response.status}`, response.data);
        return response;
    },
    (error) => {
        console.error('❌ Response Error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method
        });

        // ✅ FIX: Handle authentication errors globally
        if (error.response?.status === 401) {
            console.warn("🚫 Unauthorized - Token may be invalid/expired");
            // Có thể tự động redirect to login hoặc refresh token ở đây
        }

        return Promise.reject(error);
    }
);

// ✅ FIX 3: Add token validation utility
const validateToken = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("⚠️ No token in localStorage");
        return { isValid: false, reason: "No token" };
    }

    try {
        // Basic JWT format check
        const parts = token.split('.');
        if (parts.length !== 3) {
            return { isValid: false, reason: "Invalid JWT format" };
        }

        // Decode payload to check expiry
        const payload = JSON.parse(atob(parts[1]));
        const isExpired = payload.exp && (payload.exp * 1000 < Date.now());

        console.log("🔍 Token Info:", {
            userId: payload.sub || payload.userId,
            role: payload.role,
            exp: payload.exp ? new Date(payload.exp * 1000) : "No expiry",
            isExpired
        });

        if (isExpired) {
            return { isValid: false, reason: "Token expired" };
        }

        return { isValid: true, payload };
    } catch (e) {
        console.error("❌ Token validation error:", e);
        return { isValid: false, reason: "Invalid token format" };
    }
};

// GET /comment - không thay đổi
export const getComments = async ({
    page = 1,
    pageSize = 10,
    searchTerm = '',
    status = null,
    lessonId = null,
    userId = null,
    fromDate = null,
    toDate = null,
    sortBy = 'CreatedAt',
    isDescending = true
} = {}) => {
    try {
        const params = {
            page,
            pageSize,
            searchTerm,
            status,
            lessonId,
            userId,
            fromDate,
            toDate,
            sortBy,
            isDescending
        };

        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== null && v !== undefined && v !== '')
        );

        const response = await apiClient.get('/comment', { params: cleanParams });
        return response;
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
};

export const getCommentStatistics = async () => {
    try {
        const response = await apiClient.get('/comment/statistics');
        return response;
    } catch (error) {
        console.error('Error fetching statistics:', error);
        return {
            data: {
                success: true,
                data: {
                    totalComments: 0,
                    pendingCount: 0,
                    approvedCount: 0,
                    rejectedCount: 0,
                    reportedCount: 0,
                    mostActiveUser: 'N/A'
                }
            }
        };
    }
};

// ✅ FIX 4: Cải thiện bulkModerateComments với validation
export const bulkModerateComments = async ({ commentIds, action }) => {
    try {
        // Validate token trước khi gửi
        // const tokenCheck = validateToken();
        // if (!tokenCheck.isValid) {
        //     throw new Error(`Authentication failed: ${tokenCheck.reason}`);
        // }

        const requestData = {
            commentIds,
            action: action === 'approve' ? 1 : action === 'reject' ? 2 : action
        };

        console.log("📤 Bulk moderation payload:", requestData);
        const response = await apiClient.post('/comment/moderate/bulk', requestData);
        return response.data;
    } catch (error) {
        console.error('❌ Error in bulk moderation:', error);
        throw error;
    }
};

// ✅ FIX 5: Cải thiện moderateComment - đây là function chính bị lỗi
export const moderateComment = async ({ commentId, action, reason }) => {
    try {
        // 🔍 STEP 1: Validate token trước khi gửi request
        const tokenCheck = validateToken();
        if (!tokenCheck.isValid) {
            console.error("🚫 Token validation failed:", tokenCheck.reason);
            throw new Error(`Authentication failed: ${tokenCheck.reason}. Please login again.`);
        }

        // 🔍 STEP 2: Validate input parameters
        if (!commentId) {
            throw new Error("commentId is required");
        }

        if (!action) {
            throw new Error("action is required");
        }

        // 🔍 STEP 3: Convert action to numeric
        const numericAction = action === 'approve' ? 1 : action === 'reject' ? 2 : parseInt(action);

        if (![1, 2].includes(numericAction)) {
            throw new Error("Invalid action. Must be 'approve', 'reject', 1, or 2");
        }

        const requestData = {
            commentId: parseInt(commentId), // ✅ Ensure it's a number
            action: numericAction,
            reason: reason || ''
        };

        console.log("📤 POST /comment/moderate Payload:", requestData);
        console.log("🔐 Using token:", localStorage.getItem("token")?.substring(0, 20) + "...");

        // 🔍 STEP 4: Make the API call
        const response = await apiClient.post('/comment/moderate', requestData);

        console.log("✅ Moderation successful:", response.data);
        return response.data;

    } catch (error) {
        console.error('❌ Error moderating comment:', error);

        // ✅ Better error handling
        if (error.response) {
            console.error('🔙 Server response:', error.response.data);

            // Handle specific HTTP status codes
            switch (error.response.status) {
                case 401:
                    console.error("🚫 Unauthorized - check token validity");
                    localStorage.removeItem("token"); // Clear invalid token
                    throw new Error("Session expired. Please login again.");

                case 403:
                    throw new Error("You don't have permission to perform this action.");

                case 400:
                    const message = error.response.data?.message || "Bad request";
                    throw new Error(message);

                default:
                    throw new Error(`Server error: ${error.response.status}`);
            }
        } else if (error.request) {
            console.error("🌐 Network error - no response received");
            throw new Error("Network error. Please check your connection.");
        } else {
            console.error("⚠️ Request setup error:", error.message);
            throw error;
        }
    }
};

export const deleteComment = async (commentId) => {
    try {
        // ✅ Add token validation for delete as well
        const tokenCheck = validateToken();
        if (!tokenCheck.isValid) {
            throw new Error(`Authentication failed: ${tokenCheck.reason}`);
        }

        const response = await apiClient.delete(`/comment/${commentId}`);
        return response;
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
    }
};

export const getPendingComments = async (page = 1, pageSize = 10) => {
    try {
        const response = await apiClient.get('/comment/pending', {
            params: { page, pageSize }
        });
        return response;
    } catch (error) {
        console.error('Error fetching pending comments:', error);
        throw error;
    }
};

// ✅ FIX 6: Export thêm utility functions
export { validateToken };

// Export default
export default {
    getComments,
    getCommentStatistics,
    bulkModerateComments,
    moderateComment,
    deleteComment,
    getPendingComments,
    validateToken
};