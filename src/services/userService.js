// src/services/userService.js
import ApiService from './api';

export const UserService = {
    // Lấy danh sách người dùng
    getUsers: (params = {}) => {
        return ApiService.get('/user', params);
    },

    // Lấy thông tin chi tiết người dùng
    getUserById: (id) => {
        return ApiService.get(`/user/${id}`);
    },

    // Tạo người dùng mới
    createUser: (userData) => {
        return ApiService.post('/user', userData);
    },

    // Cập nhật thông tin người dùng
    updateUser: (id, userData) => {
        return ApiService.put(`/user/${id}`, userData);
    },

    // Xóa người dùng
    deleteUser: (id) => {
        return ApiService.delete(`/user/${id}`);
    },

    // Thay đổi trạng thái người dùng
    toggleUserStatus: (id) => {
        return ApiService.patch(`/user/${id}/toggle-status`);
    },

    // Reset mật khẩu
    resetPassword: (id) => {
        return ApiService.post(`/user/${id}/reset-password`);
    },

    // Gán vai trò
    assignRole: (id, roles) => {
        return ApiService.patch(`/user/${id}/assign-role`, { roles });
    },

    // Xuất Excel
    exportToExcel: (params = {}) => {
        return ApiService.downloadFile('/user/export/excel', params);
    },

    // Xuất PDF
    exportToPdf: (params = {}) => {
        return ApiService.downloadFile('/user/export/pdf', params);
    },

    // Lấy thống kê
    getStatistics: () => {
        return ApiService.get('/user/statistics');
    }
};

export default UserService;