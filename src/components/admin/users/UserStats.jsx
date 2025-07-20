import React from 'react';
import {
    Users,
    CheckCircle,
    GraduationCap,
    CalendarPlus
} from 'lucide-react';

const UserStats = ({ statistics }) => {
    if (!statistics) return null;

    const statCards = [
        {
            title: 'Tổng người dùng',
            value: statistics.totalUsers,
            color: 'text-blue-600',
            iconBg: 'bg-blue-100',
            Icon: Users
        },
        {
            title: 'Đang hoạt động',
            value: statistics.activeUsers,
            color: 'text-green-600',
            iconBg: 'bg-green-100',
            Icon: CheckCircle
        },
        {
            title: 'Học viên',
            value: statistics.studentUsers,
            color: 'text-purple-600',
            iconBg: 'bg-purple-100',
            Icon: GraduationCap
        },
        {
            title: 'Người dùng mới tháng này',
            value: statistics.newUsersThisMonth,
            color: 'text-orange-600',
            iconBg: 'bg-orange-100',
            Icon: CalendarPlus
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, index) => (
                <StatCard
                    key={index}
                    title={card.title}
                    value={card.value}
                    color={card.color}
                    iconBg={card.iconBg}
                    Icon={card.Icon}
                />
            ))}
        </div>
    );
};

const StatCard = ({ title, value, color, iconBg, Icon }) => (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
        <div className={`p-3 rounded-full ${iconBg}`}>
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className={`text-2xl font-bold ${color}`}>
                {value?.toLocaleString() || 0}
            </p>
        </div>
    </div>
);

export default UserStats;
