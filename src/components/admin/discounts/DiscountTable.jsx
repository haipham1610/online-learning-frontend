// DiscountTable.jsx
import React from 'react';
import { DollarSign, Percent, Calendar, Eye, Edit, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';

const getStatusColor = (statusCode) => {
    switch (statusCode) {
        case 1: return 'bg-green-100 text-green-800';
        case 2: return 'bg-gray-100 text-gray-800';
        case 3: return 'bg-red-100 text-red-800';
        case 4: return 'bg-orange-100 text-orange-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const DiscountTable = ({
    discounts,
    loading,
    pagination,
    setPagination,
    onViewUsage,
    onEdit,
    onToggleStatus,
    onDelete
}) => {
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creator</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center">
                                    <div className="animate-spin mx-auto h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                                </td>
                            </tr>
                        ) : discounts.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                    No discounts found
                                </td>
                            </tr>
                        ) : (
                            discounts.map((discount) => (
                                <tr key={discount.discountId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{discount.code}</div>
                                        {discount.description && (
                                            <div className="text-sm text-gray-500">{discount.description}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1">
                                            {discount.fixValue && (
                                                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                                    <DollarSign size={12} /> ${discount.fixValue}
                                                </span>
                                            )}
                                            {discount.percentageValue && (
                                                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                                    <Percent size={12} /> {discount.percentageValue}%
                                                </span>
                                            )}
                                        </div>
                                        {discount.maxValue && (
                                            <div className="text-xs text-gray-500 mt-1">Max: ${discount.maxValue}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(discount.startDate).toLocaleDateString()} - {new Date(discount.endDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div>Used: {discount.used}/{discount.quantity}</div>
                                        <div>Remaining: {discount.remaining}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(discount.status)}`}>
                                            {discount.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {discount.creator}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => onViewUsage(discount.discountId)} className="text-blue-600 hover:text-blue-800" title="View Usage">
                                                <Eye size={16} />
                                            </button>
                                            <button onClick={() => onEdit(discount)} className="text-green-600 hover:text-green-800" title="Edit">
                                                <Edit size={16} />
                                            </button>
                                            {(discount.status === 'Active' || discount.status === 'Inactive') && (
                                                <button onClick={() => onToggleStatus(discount.discountId)} className="text-orange-600 hover:text-orange-800" title="Toggle Status">
                                                    {discount.status === 'Active' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                                </button>
                                            )}
                                            <button onClick={() => onDelete(discount.discountId)} className="text-red-600 hover:text-red-800" title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-between items-center px-6 py-4 border-t">
                    <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default DiscountTable;
