import React, { useState } from 'react';
import { exportDashboardReport } from "../../../services/dashboardApi";
import { Download } from 'lucide-react';

const ExportReportButton = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleExport = async () => {
        if (!startDate || !endDate) {
            alert('Vui lòng chọn ngày bắt đầu và kết thúc');
            return;
        }

        try {
            const response = await exportDashboardReport({
                type: 'excel',
                startDate,
                endDate,
                sections: 'revenue,students,courses'
            });

            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'dashboard_report.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(error);
            alert('Lỗi khi xuất báo cáo');
        }
    };

    return (
        <div className="flex flex-col md:flex-row md:items-end gap-4 bg-white p-4 rounded-xl shadow-md border border-gray-100">
            {/* Date Range */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-600">Từ ngày</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-600">Đến ngày</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Button */}
            <div className="mt-2 md:mt-0">
                <button
                    onClick={handleExport}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-150"
                >
                    <Download size={16} />
                    Xuất báo cáo (Excel)
                </button>
            </div>
        </div>
    );
};

export default ExportReportButton;
