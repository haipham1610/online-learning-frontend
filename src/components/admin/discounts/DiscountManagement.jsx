// DiscountManagement.jsx
import React, { useState, useEffect } from 'react';
import DiscountForm from './DiscountForm';
import DiscountTable from './DiscountTable';
import DiscountFilters from './DiscountFilters';
import DiscountUsageModal from './DiscountUsageModal';
import toast from 'react-hot-toast';

const DiscountManagement = () => {
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('create');
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [usageInfo, setUsageInfo] = useState(null);
    const [filters, setFilters] = useState({ search: '', status: '', date: '' });
    const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalPages: 1, totalCount: 0 });

    const [formData, setFormData] = useState({
        code: '', fixValue: '', percentageValue: '', maxValue: '', minPurchase: '',
        startDate: '', endDate: '', quantity: '', maxUse: '', description: '', creator: 'U123456789'
    });

    const resetForm = () => {
        setFormData({
            code: '', fixValue: '', percentageValue: '', maxValue: '', minPurchase: '',
            startDate: '', endDate: '', quantity: '', maxUse: '', description: '', creator: 'U123456789'
        });
    };

    const fetchDiscounts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                pageSize: pagination.pageSize.toString(),
            });

            if (filters.search) params.append('search', filters.search);
            if (filters.status !== '') params.append('status', parseInt(filters.status));
            if (filters.date) params.append('date', filters.date);

            const response = await fetch(`https://localhost:5000/api/discounts?${params}`);
            const data = await response.json();

            if (response.ok) {
                setDiscounts(data.items || []);
                setPagination(prev => ({
                    ...prev,
                    totalPages: data.totalPages || 1,
                    totalCount: data.totalCount || 0
                }));
            } else {
                toast.error(data.message || 'Failed to fetch discounts');
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = modalType === 'create'
                ? 'https://localhost:5000/api/discounts'
                : `https://localhost:5000/api/discounts/${selectedDiscount?.discountId}`;
            const method = modalType === 'create' ? 'POST' : 'PUT';
            const payload = { ...formData };

            ['fixValue', 'percentageValue', 'maxValue', 'minPurchase'].forEach(k => payload[k] = payload[k] ? parseFloat(payload[k]) : undefined);
            ['quantity', 'maxUse'].forEach(k => payload[k] = payload[k] ? parseInt(payload[k]) : k === 'quantity' ? 100 : 1);
            ['startDate', 'endDate'].forEach(k => payload[k] = payload[k] ? new Date(payload[k]).toISOString() : undefined);

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(`Discount ${modalType === 'create' ? 'created' : 'updated'} successfully!`);
                setShowModal(false);
                resetForm();
                fetchDiscounts();
            } else {
                toast.error(data.message || 'Failed to save discount');
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this discount?')) return;
        setLoading(true);
        try {
            const response = await fetch(`https://localhost:5000/api/discounts/${id}`, { method: 'DELETE' });
            if (response.ok) {
                toast.success('Discount deleted successfully!');
                fetchDiscounts();
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to delete discount');
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`https://localhost:5000/api/discounts/${id}/toggle-status`, { method: 'PATCH' });
            if (response.ok) {
                toast.success('Status toggled successfully!');
                fetchDiscounts();
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to toggle status');
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleViewUsage = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`https://localhost:5000/api/discounts/${id}/usage`);
            const data = await response.json();
            if (response.ok) {
                setUsageInfo(data);
                setModalType('usage');
                setShowModal(true);
            } else {
                toast.error(data.message || 'Failed to load usage info');
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        resetForm();
        setModalType('create');
        setSelectedDiscount(null);
        setShowModal(true);
    };

    const openEditModal = (discount) => {
        setFormData({
            code: discount.code || '',
            fixValue: discount.fixValue?.toString() || '',
            percentageValue: discount.percentageValue?.toString() || '',
            maxValue: discount.maxValue?.toString() || '',
            minPurchase: discount.minPurchase?.toString() || '',
            startDate: discount.startDate?.split('T')[0] || '',
            endDate: discount.endDate?.split('T')[0] || '',
            quantity: discount.quantity?.toString() || '',
            maxUse: discount.maxUse?.toString() || '',
            description: discount.description || '',
            creator: discount.creator || 'U123456789'
        });
        setSelectedDiscount(discount);
        setModalType('edit');
        setShowModal(true);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    useEffect(() => { fetchDiscounts(); }, [pagination.page, filters]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Discount Management</h1>
                    <p className="text-gray-600">Manage discount codes and promotions</p>
                </div>

                <DiscountFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onCreate={openCreateModal}
                />

                <DiscountTable
                    discounts={discounts}
                    loading={loading}
                    pagination={pagination}
                    setPagination={setPagination}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                    onViewUsage={handleViewUsage}
                />

                {showModal && modalType === 'usage' && (
                    <DiscountUsageModal usageInfo={usageInfo} onClose={() => setShowModal(false)} />
                )}

                {showModal && modalType !== 'usage' && (
                    <DiscountForm
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleSubmit}
                        onCancel={() => setShowModal(false)}
                        modalType={modalType}
                        loading={loading}
                    />
                )}
            </div>
        </div>
    );
};

export default DiscountManagement;