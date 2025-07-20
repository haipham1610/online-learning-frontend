import axios from 'axios';

const BASE_URL = 'https://localhost:5000/api';

export const getOverview = () => axios.get(`${BASE_URL}/dashboard/overview`); // GET /
export const getRevenueSummary = (params) => axios.get(`${BASE_URL}/Dashboard/revenue`, { params });
export const getRevenueChart = (params) => axios.get(`${BASE_URL}/Dashboard/revenue/chart`, { params });
export const getStudentsSummary = (params) => axios.get(`${BASE_URL}/Dashboard/students`, { params });
export const getStudentAnalytics = () => axios.get(`${BASE_URL}/Dashboard/students/analytics`);
export const getTopCourses = (params) => axios.get(`${BASE_URL}/Dashboard/courses/top`, { params });
export const getCoursePerformance = (params) => axios.get(`${BASE_URL}/Dashboard/courses/performance`, { params });
export const exportDashboardReport = (params) => axios.get(`${BASE_URL}/dashboard/reports/export`, { params, responseType: 'blob' });


// ⚠️ Nếu có auth sau này:
// axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
