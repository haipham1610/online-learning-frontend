import React from 'react';
import { getUserStatusText, getStatusColor, getUserRoleText } from "../../../constants/enums";

import { Pencil, Trash2, Lock, RotateCcw } from 'lucide-react';

const UserTable = ({ users, onEdit, onDelete, onToggleStatus, onResetPassword }) => {
    if (!users || users.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <h2 className="text-lg font-semibold text-gray-600">Không có người dùng</h2>
                <p className="text-gray-400 mt-1">Vui lòng thêm người dùng hoặc thay đổi bộ lọc</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-3 text-left">Người dùng</th>
                            <th className="px-6 py-3 text-left">Liên hệ</th>
                            <th className="px-6 py-3 text-left">Trạng thái</th>
                            <th className="px-6 py-3 text-left">Vai trò</th>
                            <th className="px-6 py-3 text-left">Khóa học</th>
                            <th className="px-6 py-3 text-left">Ngày tạo</th>
                            <th className="px-6 py-3 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr key={user.userId} className="hover:bg-gray-50 transition">
                                {/* User Info */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random`}
                                            alt={user.fullName}
                                            onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random`}
                                            className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900">{user.fullName}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>

                                {/* Contact */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <p className="text-gray-900">{user.phone || '--'}</p>
                                    <p className="text-xs text-gray-500 truncate max-w-[150px]" title={user.address}>{user.address || '--'}</p>
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                                        {getUserStatusText(user.status)}
                                    </span>
                                </td>

                                {/* Role */}
                                <td className="px-6 py-4 text-gray-800">
                                    {user.roles?.map(r => getUserRoleText(r)).join(', ') || '--'}
                                </td>

                                {/* Courses */}
                                <td className="px-6 py-4 text-gray-800">
                                    <p>{user.totalCourses || 0} khóa học</p>
                                    <p className="text-xs text-gray-500">{user.completedCourses || 0} hoàn thành</p>
                                </td>

                                {/* Created Date */}
                                <td className="px-6 py-4 text-gray-500">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '--'}
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <IconButton title="Sửa" color="text-blue-600" onClick={() => onEdit(user)} icon={<Pencil size={16} />} />
                                        <IconButton title="Xóa" color="text-red-600" onClick={() => onDelete(user)} icon={<Trash2 size={16} />} />
                                        <IconButton title="Khóa/Mở" color="text-yellow-600" onClick={() => onToggleStatus(user)} icon={<Lock size={16} />} />
                                        <IconButton title="Reset" color="text-indigo-600" onClick={() => onResetPassword(user)} icon={<RotateCcw size={16} />} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Button đẹp hơn
const IconButton = ({ title, onClick, icon, color }) => (
    <button
        title={title}
        onClick={onClick}
        className={`flex items-center gap-1 text-xs font-medium ${color} hover:underline transition`}
    >
        {icon}
        <span>{title}</span>
    </button>
);

export default UserTable;
