import React from 'react';
import { UserRole, UserStatus } from "../../../constants/enums";


const UserFilters = ({
    filters,
    onSearch,
    onFilterChange,
    onCreateClick,
    onExport,
    onRefresh
}) => {
    const statusOptions = [
        { value: '', label: ' Tất cả trạng thái' },
        { value: UserStatus.ACTIVE, label: ' Hoạt động' },
        { value: UserStatus.INACTIVE, label: ' Không hoạt động' },
        { value: UserStatus.BANNED, label: ' Bị cấm' },
        { value: UserStatus.PENDING, label: ' Chờ xác thực' }
    ];

    const roleOptions = [
        { value: '', label: '👥 Tất cả vai trò' },
        { value: UserRole.STUDENT, label: '🎓 Học viên' },
        { value: UserRole.ADMIN, label: '🛡️ Quản trị viên' }
    ];

    const pageSizeOptions = [10, 25, 50, 100];

    const actionButtons = [
        {
            label: '➕ Thêm người dùng',
            onClick: onCreateClick,
            className: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        },
        {
            label: '📊 Xuất Excel',
            onClick: () => onExport('excel'),
            className: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
        },
        {
            label: '📝 Xuất PDF',
            onClick: () => onExport('pdf'),
            className: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        },
        {
            label: '🔄 Làm mới',
            onClick: onRefresh,
            className: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Search Input */}
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                        🔍 Tìm kiếm
                    </label>
                    <input
                        type="text"
                        placeholder="Nhập tên, email hoặc SĐT..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={filters.searchTerm || ''}
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>

                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                        📄 Trạng thái
                    </label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={filters.status !== null && filters.status !== undefined ? filters.status : ''}
                        onChange={(e) =>
                            onFilterChange(
                                'status',
                                e.target.value === '' ? null : parseInt(e.target.value)
                            )
                        }
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Role Filter */}
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                        🧩 Vai trò
                    </label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={filters.role !== null && filters.role !== undefined ? filters.role : ''}
                        onChange={(e) =>
                            onFilterChange(
                                'role',
                                e.target.value === '' ? null : parseInt(e.target.value)
                            )
                        }
                    >
                        {roleOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Page Size Filter */}
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                        📦 Số bản ghi
                    </label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={filters.pageSize || 10}
                        onChange={(e) => onFilterChange('pageSize', parseInt(e.target.value))}
                    >
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
                {actionButtons.map((button, index) => (
                    <button
                        key={index}
                        onClick={button.onClick}
                        className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${button.className}`}
                    >
                        {button.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default UserFilters;
