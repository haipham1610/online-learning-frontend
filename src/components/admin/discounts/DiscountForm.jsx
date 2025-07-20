import React from 'react';

const DiscountForm = ({ formData, setFormData, loading, modalType, onSubmit, onCancel }) => {
    const getValue = (value, defaultValue) => value !== '' && value !== undefined ? value : defaultValue;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-11/12 md:w-3/4 lg:w-1/2 p-8 relative animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    {modalType === 'create' ? 'Create New Discount' : 'Edit Discount'}
                </h2>

                <form onSubmit={onSubmit} className="space-y-4">
                    {/* Code & Creator */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-600">Code *</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                required
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Creator</label>
                            <input
                                type="text"
                                value={formData.creator}
                                disabled
                                className="w-full px-4 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-lg text-gray-500"
                            />
                        </div>
                    </div>

                    {/* Values */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="number"
                            placeholder="Fix Value ($)"
                            value={getValue(formData.fixValue, '')}
                            onChange={(e) => setFormData({ ...formData, fixValue: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                            type="number"
                            placeholder="Percentage (%)"
                            value={getValue(formData.percentageValue, '')}
                            onChange={(e) => setFormData({ ...formData, percentageValue: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                            type="number"
                            placeholder="Max Value ($)"
                            value={getValue(formData.maxValue, '')}
                            onChange={(e) => setFormData({ ...formData, maxValue: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>

                    {/* Min Purchase */}
                    <input
                        type="number"
                        placeholder="Min Purchase ($)"
                        value={getValue(formData.minPurchase, '')}
                        onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="date"
                            placeholder="Start Date"
                            value={getValue(formData.startDate, '')}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                        <input
                            type="date"
                            placeholder="End Date"
                            value={getValue(formData.endDate, '')}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

                    {/* Quantity & Max Use */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="number"
                            placeholder="Quantity (default 100)"
                            value={getValue(formData.quantity, 100)}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                            type="number"
                            placeholder="Max Use Per User (default 1)"
                            value={getValue(formData.maxUse, 1)}
                            onChange={(e) => setFormData({ ...formData, maxUse: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>

                    {/* Description */}
                    <textarea
                        placeholder="Description"
                        value={getValue(formData.description, '')}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        rows={3}
                    ></textarea>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
                        >
                            {loading ? 'Processing...' : modalType === 'create' ? 'Create Discount' : 'Update Discount'}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DiscountForm;
