import React from 'react';
import { TrendingUp } from 'lucide-react';

const OverviewCards = ({ data }) => {
    const cards = [
        {
            icon: '💰',
            label: 'Tổng doanh thu',
            value: `${data.totalRevenue.current} ${data.totalRevenue.unit}`,
            growth: data.totalRevenue.growthRate + '%',
        },
        {
            icon: '👨‍🎓',
            label: 'Học viên hiện tại',
            value: `${data.totalStudents.current}`,
            growth: data.totalStudents.growthRate + '%',
        },
        {
            icon: '📚',
            label: 'Khóa học đang mở',
            value: data.totalCourses.published,
        },
        {
            icon: '📈',
            label: 'Tỷ lệ chuyển đổi',
            value: `${data.conversionRate.current}%`,
            growth: data.conversionRate.growthRate + '%',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, idx) => (
                <div
                    key={idx}
                    className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition duration-300 border border-gray-100"
                >
                    {/* Icon và tiêu đề */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <span className="text-xl">{card.icon}</span>
                        <span>{card.label}</span>
                    </div>

                    {/* Giá trị chính */}
                    <div className="text-3xl font-bold text-gray-800">{card.value}</div>

                    {/* Tăng trưởng */}
                    {card.growth && (
                        <div className="flex items-center text-sm text-green-600 mt-2">
                            <TrendingUp size={16} className="mr-1" />
                            <span>+{card.growth}</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default OverviewCards;
