import { useState } from 'react';
import { UserService } from '../services/userService';
import toast from 'react-hot-toast';

export const useUserActions = ({
    refresh,
    setShowCreateModal,
    setShowEditModal,
    setShowDeleteModal,
    setSelectedUser,
    setCreateForm,
    filters
}) => {
    const [actionLoading, setActionLoading] = useState(false);

    const handleCreateUser = async (e, createForm) => {
        e.preventDefault();
        setActionLoading(true);

        try {
            const payload = {
                email: createForm.email,
                password: createForm.password,
                fullName: createForm.fullName,
                doB: createForm.doB || null,
                gender: createForm.gender === 1 ? true : createForm.gender === 0 ? false : null,
                phone: createForm.phone || null,
                address: createForm.address || null,
                avatarUrl: createForm.avatarUrl?.trim() || null,
                status: 1,
                roles: [2],
            };

            const response = await UserService.createUser(payload);

            if (response?.success) {
                setShowCreateModal(false);
                setCreateForm({
                    email: '',
                    password: '',
                    fullName: '',
                    doB: '',
                    gender: null,
                    phone: '',
                    address: '',
                    avatarUrl: '',
                    status: 1,
                    roles: [2],
                });
                refresh();
                toast.success('Tạo người dùng thành công!');
            } else {
                toast.error(response?.message || 'Tạo người dùng thất bại!');
            }
        } catch (err) {
            toast.error('Lỗi: ' + err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleEditUser = async (e, userId, editForm) => {
        e.preventDefault();
        setActionLoading(true);

        try {
            const payload = {
                fullName: editForm.fullName,
                phone: editForm.phone || null,
                doB: editForm.doB || null,
                gender:
                    editForm.gender === '' || editForm.gender === null
                        ? null
                        : editForm.gender === true
                            ? true
                            : false,
                address: editForm.address || null,
                avatarUrl: editForm.avatarUrl?.trim() || null
            };

            const response = await UserService.updateUser(userId, payload);
            if (response?.success) {
                setShowEditModal(false);
                setSelectedUser(null);
                refresh();
                toast.success('Cập nhật người dùng thành công!');
            } else {
                toast.error(response?.message || 'Cập nhật thất bại!');
            }
        } catch (err) {
            toast.error('Lỗi: ' + err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        setActionLoading(true);

        try {
            const response = await UserService.deleteUser(userId);
            if (response?.success) {
                setShowDeleteModal(false);
                setSelectedUser(null);
                refresh();
                toast.success('Xóa người dùng thành công!');
            } else {
                toast.error(response?.message || 'Xóa người dùng thất bại!');
            }
        } catch (err) {
            toast.error('Lỗi: ' + err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleStatus = async (user) => {
        try {
            const response = await UserService.toggleUserStatus(user.userId);
            if (response?.success) {
                refresh();
                toast.success(response.message);
            }
        } catch (err) {
            toast.error('Lỗi: ' + err.message);
        }
    };

    const handleResetPassword = async (user) => {
        if (confirm('Bạn có chắc chắn muốn reset mật khẩu cho người dùng này?')) {
            try {
                const response = await UserService.resetPassword(user.userId);
                if (response?.success) {
                    toast.success(response.message);
                } else {
                    toast.error(response?.message || 'Reset mật khẩu thất bại!');
                }
            } catch (err) {
                toast.error('Lỗi: ' + err.message);
            }
        }
    };

    const handleExport = async (type) => {
        try {
            const filtersToUse = {
                ...filters,
                pageNumber: filters.pageNumber || 1,
                pageSize: filters.pageSize || 10
            };

            const exportParams = {};
            for (const key in filtersToUse) {
                if (filtersToUse[key] !== null && filtersToUse[key] !== '') {
                    exportParams[key] = filtersToUse[key];
                }
            }

            let blob, filename;
            if (type === 'excel') {
                blob = await UserService.exportToExcel(exportParams);
                filename = `Users_${new Date().toISOString().slice(0, 10)}.xlsx`;
            } else {
                blob = await UserService.exportToPdf(exportParams);
                filename = `Users_${new Date().toISOString().slice(0, 10)}.pdf`;
            }

            if (blob.type.includes('application/json')) {
                const text = await blob.text();
                throw new Error('Lỗi từ server: ' + text);
            }

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success('Xuất file thành công!');
        } catch (err) {
            toast.error('Lỗi khi xuất file: ' + err.message);
        }
    };

    return {
        actionLoading,
        handleCreateUser,
        handleEditUser,
        handleDeleteUser,
        handleToggleStatus,
        handleResetPassword,
        handleExport
    };
};
