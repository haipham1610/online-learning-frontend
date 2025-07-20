import React from 'react';

const getStatusColor = (statusCode) => {
    switch (statusCode) {
        case 1: return 'bg-green-100 text-green-800';
        case 2: return 'bg-gray-100 text-gray-800';
        case 3: return 'bg-red-100 text-red-800';
        case 4: return 'bg-orange-100 text-orange-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const DiscountUsageModal = ({ usageInfo, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-11/12 md:w-3/4 lg:w-1/2 p-8 relative animate-fade-in">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Discount Usage Information
                </h3>

                <div className="bg-gray-50 p-6 rounded-xl shadow-inner space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Code</p>
                            <p className="font-medium text-gray-800">{usageInfo?.code || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(usageInfo?.status || '')}`}>
                                {usageInfo?.status}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Used</p>
                            <p className="font-medium text-gray-800">{usageInfo?.used ?? 0}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Remaining</p>
                            <p className="font-medium text-gray-800">{usageInfo?.remaining ?? 0}</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-all duration-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DiscountUsageModal;
