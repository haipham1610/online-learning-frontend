// src/pages/users/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { UserService } from '../../services/userService';
import { UserStatus, UserRole } from '../../constants/enums';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import UserStats from '../../components/admin/users/UserStats';
import UserFilters from '../../components/admin/users/UserFilters';
import UserTable from '../../components/admin/users/UserTable';
import UserPagination from '../../components/admin/users/UserPagination';
import CreateUserModal from '../../components/admin/users/CreateUserModal';
import EditUserModal from '../../components/admin/users/EditUserModal';
import DeleteUserModal from '../../components/admin/users/DeleteUserModal';
import { useUserActions } from '../../hooks/useUserActions';

const UserManagement = () => {
    const { users, loading, error, pagination, filters, updateFilters, refresh } = useUsers();
    const [statistics, setStatistics] = useState(null);

    // Modal states
    const [selectedUser, setSelectedUser] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Form states
    const [createForm, setCreateForm] = useState({
        email: '',
        password: '',
        fullName: '',
        doB: '',
        gender: null,
        phone: '',
        address: '',
        avatarUrl: '',
        status: UserStatus.ACTIVE,
        roles: [UserRole.STUDENT]
    });

    const [editForm, setEditForm] = useState({
        fullName: '',
        doB: '',
        gender: null,
        phone: '',
        address: '',
        avatarUrl: ''
    });

    const {
        actionLoading,
        handleCreateUser,
        handleEditUser,
        handleDeleteUser,
        handleToggleStatus,
        handleResetPassword,
        handleExport
    } = useUserActions({
        refresh,
        setShowCreateModal,
        setShowEditModal,
        setShowDeleteModal,
        setSelectedUser,
        setCreateForm,
        filters
    });

    // Fetch statistics
    const fetchStatistics = async () => {
        try {
            const response = await UserService.getStatistics();
            if (response.success) {
                setStatistics(response.data);
            }
        } catch (err) {
            console.error('Error fetching statistics:', err);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, []);

    // Update edit form when selectedUser changes
    useEffect(() => {
        if (selectedUser && showEditModal) {
            setEditForm({
                fullName: selectedUser.fullName || '',
                phone: selectedUser.phone || '',
                doB: selectedUser.doB || '',
                gender: selectedUser.gender === true ? true : selectedUser.gender === false ? false : null,
                address: selectedUser.address || '',
                avatarUrl: selectedUser.avatarUrl || ''
            });
        }
    }, [selectedUser, showEditModal]);

    // Event handlers
    const handleSearch = (searchTerm) => {
        updateFilters({ searchTerm, pageNumber: 1 });
    };

    const handleFilterChange = (key, value) => {
        updateFilters({ [key]: value, pageNumber: 1 });
    };

    const handlePageChange = (pageNumber) => {
        updateFilters({ pageNumber });
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const openDeleteModal = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const resetCreateForm = () => {
        setCreateForm({
            email: '',
            password: '',
            fullName: '',
            doB: '',
            gender: null,
            phone: '',
            address: '',
            avatarUrl: '',
            status: UserStatus.ACTIVE,
            roles: [UserRole.STUDENT]
        });
    };

    if (loading && users.length === 0) {
        return <LoadingSpinner text="Đang tải danh sách người dùng..." />;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý người dùng</h1>
                <p className="text-gray-600">Quản lý thông tin người dùng trong hệ thống</p>
            </div>

            {/* Statistics */}
            <UserStats statistics={statistics} />

            {/* Filters */}
            <UserFilters
                filters={filters}
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                onCreateClick={() => setShowCreateModal(true)}
                onExport={handleExport}
                onRefresh={refresh}
            />

            {/* Error message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {/* Users Table */}
            <UserTable
                users={users}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
                onToggleStatus={handleToggleStatus}
                onResetPassword={handleResetPassword}
            />

            {/* Pagination */}
            <UserPagination
                pagination={pagination}
                onPageChange={handlePageChange}
            />

            {/* Modals */}
            <CreateUserModal
                isOpen={showCreateModal}
                onClose={() => {
                    setShowCreateModal(false);
                    resetCreateForm();
                }}
                onSubmit={(e) => handleCreateUser(e, createForm)}
                form={createForm}
                setForm={setCreateForm}
                loading={actionLoading}
            />

            <EditUserModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                }}
                onSubmit={(e) => handleEditUser(e, selectedUser?.userId, editForm)}
                form={editForm}
                setForm={setEditForm}
                loading={actionLoading}
            />

            <DeleteUserModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                }}
                onConfirm={() => handleDeleteUser(selectedUser?.userId)}
                userName={selectedUser?.fullName}
                loading={actionLoading}
            />
        </div>
    );
};

export default UserManagement;