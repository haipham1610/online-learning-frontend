import React from 'react';

const DeleteUserModal = ({ isOpen, onClose, onConfirm, userName, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-md max-w-md w-full p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Xác nhận xóa</h2>
                <p className="text-gray-700 mb-6">
                    Bạn có chắc chắn muốn xóa người dùng <strong className="text-red-600">{userName}</strong> không? Hành động này không thể hoàn tác.
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                    >
                        {loading ? 'Đang xóa...' : 'Xóa'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteUserModal;
