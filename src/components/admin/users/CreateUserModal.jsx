import React, { useState } from 'react';

const CreateUserModal = ({
    isOpen,
    onClose,
    onSubmit,
    form,
    setForm,
    loading
}) => {
    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const validate = () => {
        const newErrors = {};
        if (!form.fullName || form.fullName.trim() === '') newErrors.fullName = 'Họ tên là bắt buộc';
        if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email không hợp lệ';
        if (!form.password || form.password.length < 6) newErrors.password = 'Mật khẩu phải ít nhất 6 ký tự';
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        onSubmit(e);
    };

    const getInputStyle = (field) =>
        `w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${errors[field] ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
        }`;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Thêm người dùng</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Họ tên *</label>
                            <input
                                type="text"
                                value={form.fullName}
                                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                className={getInputStyle('fullName')}
                                placeholder="Nhập họ tên"
                            />
                            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Email *</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className={getInputStyle('email')}
                                placeholder="Nhập email"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Mật khẩu *</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className={getInputStyle('password')}
                                placeholder="Nhập mật khẩu"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                className={getInputStyle('phone')}
                                placeholder="Nhập số điện thoại"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Ngày sinh</label>
                            <input
                                type="date"
                                value={form.doB}
                                onChange={(e) => setForm({ ...form, doB: e.target.value })}
                                className={getInputStyle('doB')}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Giới tính</label>
                            <select
                                value={form.gender === true ? '1' : form.gender === false ? '0' : '2'}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        gender: e.target.value === '2' ? null : e.target.value === '1'
                                    })
                                }
                                className={getInputStyle('gender')}
                            >
                                <option value="2">Khác</option>
                                <option value="0">Nam</option>
                                <option value="1">Nữ</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Địa chỉ</label>
                        <input
                            type="text"
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                            className={getInputStyle('address')}
                            placeholder="Nhập địa chỉ"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">URL Avatar</label>
                        <input
                            type="url"
                            value={form.avatarUrl}
                            onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                            className={getInputStyle('avatarUrl')}
                            placeholder="URL hình đại diện (không bắt buộc)"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Đang tạo...' : 'Tạo người dùng'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUserModal;
