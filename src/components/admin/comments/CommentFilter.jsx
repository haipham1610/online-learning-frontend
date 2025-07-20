import React, { useState } from 'react';

const CommentFilter = ({ onChange }) => {
    const [term, setTerm] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onChange((prev) => ({ 
            ...prev, 
            searchTerm: term, 
            status: status || undefined,
            page: 1 
        }));
    };

    const handleReset = () => {
        setTerm('');
        setStatus('');
        onChange((prev) => ({ 
            ...prev, 
            searchTerm: undefined, 
            status: undefined,
            page: 1 
        }));
    };

    return (
        <div className="bg-white p-4 border rounded-lg mb-4">
            <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-64">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Search
                    </label>
                    <input
                        type="text"
                        placeholder="Search by content or user name..."
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Status</option>
                        <option value="0">Pending</option>
                        <option value="1">Approved</option>
                        <option value="2">Rejected</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <button 
                        type="submit" 
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Search
                    </button>
                    <button 
                        type="button" 
                        onClick={handleReset}
                        className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CommentFilter;