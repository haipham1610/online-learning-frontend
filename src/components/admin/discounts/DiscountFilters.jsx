import React from 'react';
import { Search } from 'lucide-react';

const DiscountFilters = ({ filters, onFilterChange, onCreate }) => {
    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: '1', label: 'Active' },
        { value: '2', label: 'Inactive' },
        { value: '3', label: 'Expired' },
        { value: '4', label: 'Used Up' }
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by code or creator..."
                            value={filters.search}
                            onChange={(e) => onFilterChange('search', e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={filters.status}
                        onChange={(e) => onFilterChange('status', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <input
                        type="date"
                        value={filters.date}
                        onChange={(e) => onFilterChange('date', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <button
                    onClick={onCreate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    + Create Discount
                </button>
            </div>
        </div>
    );
};

export default DiscountFilters;