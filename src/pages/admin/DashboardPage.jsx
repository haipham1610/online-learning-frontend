import React, { useEffect, useState } from 'react';
import OverviewCards from '../../components/admin/dashboard/OverviewCards';
import RevenueChart from '../../components/admin/dashboard/RevenueChart';
import TopCourses from '../../components/admin/dashboard/TopCourses';
import StudentStats from '../../components/admin/dashboard/StudentStats';
import ExportReportButton from '../../components/admin/dashboard/ExportReportButton';

import {
    getOverview,
    getRevenueChart,
    getStudentsSummary,
    getTopCourses
} from '../../services/dashboardApi';

const DashboardPage = () => {
    const [overview, setOverview] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [studentStats, setStudentStats] = useState(null);
    const [topCourses, setTopCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [overviewRes, chartRes, studentRes, topCoursesRes] = await Promise.all([
                    getOverview(),
                    getRevenueChart({ period: '30d', interval: 'day' }),
                    getStudentsSummary({ period: '30d' }),
                    getTopCourses({ limit: 5, sortBy: 'revenue' }),
                ]);

                setOverview(overviewRes.data.data);
                setChartData(chartRes.data.data);
                setStudentStats(studentRes.data.data);
                setTopCourses(topCoursesRes.data.data.topByRevenue);
            } catch (err) {
                console.error('Failed to load dashboard data:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-500 text-lg animate-pulse">
                <span>Loading dashboard...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 px-4 md:px-6 py-4">
            <div className="max-w-screen-xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 tracking-tight mb-1">
                            📊 Dashboard
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Key performance indicators of revenue, students, and courses
                        </p>
                    </div>
                    <ExportReportButton />
                </div>

                {/* Overview Cards */}
                {overview && (
                    <div className="mb-6">
                        <OverviewCards data={overview} />
                    </div>
                )}

                {/* Charts and Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                    {chartData && (
                        <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
                            <h2 className="text-lg font-semibold text-gray-700 mb-3">
                                📈 Revenue Trends (Last 30 Days)
                            </h2>
                            <RevenueChart data={chartData} />
                        </div>
                    )}
                    {studentStats && (
                        <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
                            <h2 className="text-lg font-semibold text-gray-700 mb-3">
                                👨‍🎓 Student Statistics
                            </h2>
                            <StudentStats data={studentStats} />
                        </div>
                    )}
                </div>

                {/* Top Courses */}
                {topCourses.length > 0 && (
                    <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">
                            🏆 Top Earning Courses
                        </h2>
                        <TopCourses courses={topCourses} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
