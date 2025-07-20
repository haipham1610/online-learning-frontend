import React from 'react';

const statusMap = {
    0: { label: 'Pending', color: 'bg-yellow-200 text-yellow-800' },
    1: { label: 'Approved', color: 'bg-green-200 text-green-800' },
    2: { label: 'Rejected', color: 'bg-red-200 text-red-800' },
};

const CommentStatusTag = ({ status }) => {
    const statusInfo = statusMap[status] || { label: 'Unknown', color: 'bg-gray-200 text-gray-700' };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
            {statusInfo.label}
        </span>
    );
};

export default CommentStatusTag;