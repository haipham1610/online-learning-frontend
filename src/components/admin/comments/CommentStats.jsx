import React from 'react';

const CommentStats = ({ data }) => {
    if (!data) return <div className="text-gray-500">Loading statistics...</div>;

    const stats = [
        { label: 'Total Comments', value: data.totalComments || 0, color: 'bg-blue-500' },
        { label: 'Pending', value: data.pendingCount || 0, color: 'bg-yellow-500' },
        { label: 'Approved', value: data.approvedCount || 0, color: 'bg-green-500' },
        { label: 'Rejected', value: data.rejectedCount || 0, color: 'bg-red-500' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${stat.color} mr-3`}></div>
                        <div>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CommentStats;
