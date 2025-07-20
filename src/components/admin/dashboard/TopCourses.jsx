import React from 'react';
import { TrendingUp, Users } from 'lucide-react';

const TopCourses = ({ courses }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
                🏆 Top khóa học theo doanh thu
            </h2>

            <ul className="space-y-4">
                {courses.map((course, idx) => (
                    <li
                        key={idx}
                        className="flex items-start gap-4 border-b pb-4 last:border-none last:pb-0"
                    >
                        <div className="flex-shrink-0">
                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shadow-sm">
                                #{idx + 1}
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="text-base font-medium text-gray-900">{course.title}</div>
                            <div className="flex items-center text-sm text-gray-500 mt-1 gap-4">
                                <span className="flex items-center gap-1">
                                    <TrendingUp size={16} className="text-green-500" />
                                    {course.revenue.toLocaleString()} VND
                                </span>
                                <span className="flex items-center gap-1">
                                    <Users size={16} className="text-blue-500" />
                                    {course.enrollments} đăng ký
                                </span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopCourses;
