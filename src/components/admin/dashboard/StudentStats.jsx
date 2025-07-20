import React from 'react';
import { User, UserPlus, Activity, CheckCircle } from 'lucide-react';

const StudentStats = ({ data }) => {
    const { totalStudents, newStudents, activeStudents, completionRate } = data.summary;

    const stats = [
        {
            icon: <User size={20} className="text-blue-600" />,
            label: 'Tổng học viên',
            value: totalStudents.toLocaleString(),
        },
        {
            icon: <UserPlus size={20} className="text-green-600" />,
            label: 'Học viên mới',
            value: newStudents.toLocaleString(),
        },
        {
            icon: <Activity size={20} className="text-yellow-600" />,
            label: 'Đang hoạt động',
            value: activeStudents.toLocaleString(),
        },
        {
            icon: <CheckCircle size={20} className="text-purple-600" />,
            label: 'Tỷ lệ hoàn thành',
            value: `${completionRate.toFixed(2)}%`,
        },
    ];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
                👥 Tổng quan học viên
            </h2>
            <ul className="space-y-4">
                {stats.map((stat, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-700">
                        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100">
                            {stat.icon}
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">{stat.label}</div>
                            <div className="text-base font-medium text-gray-800">{stat.value}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudentStats;
