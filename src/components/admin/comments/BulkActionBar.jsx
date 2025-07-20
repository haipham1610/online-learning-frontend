import React from 'react';

const BulkActionBar = ({ selectedCount, onApprove, onReject, onClear }) => {
    if (selectedCount === 0) return null;

    return (
        <div className="flex justify-between items-center p-3 bg-gray-50 border rounded mb-4">
            <span className="text-sm font-medium">{selectedCount} comment{selectedCount > 1 ? 's' : ''} selected</span>
            <div className="space-x-2">
                <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    onClick={onApprove}
                >
                    Approve All
                </button>
                <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    onClick={onReject}
                >
                    Reject All
                </button>
                <button
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                    onClick={onClear}
                >
                    Clear Selection
                </button>
            </div>
        </div>
    );
};

export default BulkActionBar;